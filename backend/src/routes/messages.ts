import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import { auth } from "../middleware/auth";
import { badRequest, notFound } from "../utils/errors";
import { param } from "../utils/params";
import { isMessagingEnabled } from "../services/status";
import { getIO } from "../socket";

const router = Router({ mergeParams: true });

const sendSchema = z.object({
  body: z.string().min(1).max(2000),
});

router.get("/", auth, async (req: Request, res: Response) => {
  const id = param(req, "id");
  const tracking = await prisma.tracking.findUnique({ where: { id } });
  if (!tracking) throw notFound("Tracking not found");

  if (!isMessagingEnabled(tracking.status)) {
    return res.json([]);
  }

  const messages = await prisma.message.findMany({
    where: { trackingId: id },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { name: true } } },
  });

  res.json(messages);
});

router.patch("/read", auth, async (req: Request, res: Response) => {
  const id = param(req, "id");
  const tracking = await prisma.tracking.findUnique({ where: { id } });
  if (!tracking) throw notFound("Tracking not found");

  const oppositeRole = req.user!.role === "client" ? "admin" : "client";

  await prisma.message.updateMany({
    where: {
      trackingId: id,
      senderRole: oppositeRole,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  res.json({ success: true });
});

router.post("/", auth, async (req: Request, res: Response) => {
  const id = param(req, "id");
  const tracking = await prisma.tracking.findUnique({ where: { id } });
  if (!tracking) throw notFound("Tracking not found");

  if (!isMessagingEnabled(tracking.status)) {
    throw badRequest("Messaging is not available for this tracking status");
  }

  const parsed = sendSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest("Validation failed", parsed.error.flatten());

  const senderRole = req.user!.role === "client" ? "client" : "admin";

  const message = await prisma.message.create({
    data: {
      trackingId: id,
      senderId: req.user!.userId,
      senderRole,
      body: parsed.data.body,
    },
    include: { sender: { select: { name: true } } },
  });

  const io = getIO();
  io.to(`tracking:${id}`).emit("message:new", {
    trackingId: id,
    message,
  });

  res.status(201).json(message);
});

export default router;
