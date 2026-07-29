import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import { notFound, badRequest } from "../utils/errors";
import { param } from "../utils/params";
import { getIO } from "../socket";
import { isMessagingEnabled } from "../services/status";

const router = Router();

const publicDisputeSchema = z.object({
  trackingId: z.string().min(1),
  reason: z.enum([
    "damaged_package",
    "lost_package",
    "wrong_item",
    "delivery_delay",
    "other",
  ]),
  description: z.string().min(10),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional(),
});

const publicMessageSchema = z.object({
  trackingId: z.string().min(1),
  body: z.string().min(1).max(2000),
  senderName: z.string().optional(),
});

router.get("/carriers", async (_req: Request, res: Response) => {
  const trackings = await prisma.tracking.findMany({
    where: { carrierRef: { not: null } },
    select: { carrierRef: true },
    distinct: ["carrierRef"],
  });
  const fromTrackings = trackings.map((t) => t.carrierRef).filter(Boolean) as string[];
  const defaults = ["TransExpress", "DHL", "FedEx", "UPS", "Chronopost", "CMA CGM", "Maersk"];
  const all = [...new Set([...defaults, ...fromTrackings])];
  res.json(all);
});

router.get("/messages/:trackingId", async (req: Request, res: Response) => {
  const trackingId = param(req, "trackingId");
  const tracking = await prisma.tracking.findUnique({
    where: { id: trackingId },
  });
  if (!tracking) throw notFound("Tracking not found");

  if (!isMessagingEnabled(tracking.status)) {
    return res.json([]);
  }

  const messages = await prisma.message.findMany({
    where: { trackingId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { name: true } } },
  });

  res.json(messages);
});

router.post("/messages", async (req: Request, res: Response) => {
  const parsed = publicMessageSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest("Validation failed", parsed.error.flatten());

  const tracking = await prisma.tracking.findUnique({
    where: { id: parsed.data.trackingId },
  });
  if (!tracking) throw notFound("Tracking not found");

  if (!isMessagingEnabled(tracking.status)) {
    throw badRequest("Messaging is not available for this tracking status");
  }

  const message = await prisma.message.create({
    data: {
      trackingId: parsed.data.trackingId,
      senderId: null,
      senderRole: "client",
      body: parsed.data.body,
    },
  });

  const io = getIO();
  io.to(`tracking:${parsed.data.trackingId}`).emit("message:new", {
    trackingId: parsed.data.trackingId,
    message,
  });

  res.status(201).json(message);
});

router.post("/disputes", async (req: Request, res: Response) => {
  const parsed = publicDisputeSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest("Validation failed", parsed.error.flatten());

  const tracking = await prisma.tracking.findUnique({
    where: { id: parsed.data.trackingId },
  });
  if (!tracking) throw notFound("Tracking not found");

  const dispute = await prisma.dispute.create({
    data: {
      trackingId: parsed.data.trackingId,
      clientId: null,
      reason: parsed.data.reason,
      description: parsed.data.description,
    },
  });

  const io = getIO();
  io.to(`tracking:${parsed.data.trackingId}`).emit("dispute:updated", {
    trackingId: parsed.data.trackingId,
    dispute,
  });

  res.status(201).json(dispute);
});

export default router;
