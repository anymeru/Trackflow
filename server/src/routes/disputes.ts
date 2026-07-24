import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import { auth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { badRequest, notFound } from "../utils/errors";
import { param } from "../utils/params";
import { sendDisputeOpenedEmail, sendDisputeResolvedEmail } from "../services/email";
import { getIO } from "../socket";

const router = Router({ mergeParams: true });

const reasonLabels: Record<string, string> = {
  damaged_package: "Colis endommagé",
  lost_package: "Colis perdu",
  wrong_item: "Mauvais article",
  delivery_delay: "Retard de livraison",
  other: "Autre",
};

const createSchema = z.object({
  reason: z.enum([
    "damaged_package",
    "lost_package",
    "wrong_item",
    "delivery_delay",
    "other",
  ]),
  description: z.string().min(10),
});

const resolveSchema = z.object({
  adminResponse: z.string().min(1),
});

router.get("/", auth, async (req: Request, res: Response) => {
  const id = param(req, "id");
  const tracking = await prisma.tracking.findUnique({ where: { id } });
  if (!tracking) throw notFound("Tracking not found");

  const disputes = await prisma.dispute.findMany({
    where: { trackingId: id },
    orderBy: { createdAt: "desc" },
  });

  res.json(disputes);
});

router.post("/", auth, requireRole("client"), async (req: Request, res: Response) => {
  const id = param(req, "id");
  const tracking = await prisma.tracking.findUnique({ where: { id } });
  if (!tracking) throw notFound("Tracking not found");

  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest("Validation failed", parsed.error.flatten());

  const dispute = await prisma.dispute.create({
    data: {
      trackingId: id,
      clientId: req.user!.userId,
      reason: parsed.data.reason,
      description: parsed.data.description,
    },
  });

  await sendDisputeOpenedEmail(id, tracking.clientEmail, tracking.trackingNumber);

  const io = getIO();
  io.to(`tracking:${id}`).emit("dispute:updated", {
    trackingId: id,
    dispute,
  });

  res.status(201).json(dispute);
});

router.patch(
  "/:disputeId/resolve",
  auth,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const parsed = resolveSchema.safeParse(req.body);
    if (!parsed.success)
      throw badRequest("Validation failed", parsed.error.flatten());

    const disputeId = param(req, "disputeId");

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: { tracking: { select: { clientEmail: true, trackingNumber: true } } },
    });
    if (!dispute) throw notFound("Dispute not found");
    if (dispute.status === "resolved")
      throw badRequest("Dispute is already resolved");

    const updated = await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: "resolved",
        adminResponse: parsed.data.adminResponse,
        resolvedAt: new Date(),
      },
    });

    await sendDisputeResolvedEmail(
      dispute.trackingId,
      dispute.tracking.clientEmail,
      dispute.tracking.trackingNumber,
      parsed.data.adminResponse
    );

    const io = getIO();
    io.to(`tracking:${dispute.trackingId}`).emit("dispute:updated", {
      trackingId: dispute.trackingId,
      dispute: updated,
    });

    res.json(updated);
  }
);

export default router;
