import { Router, Request, Response } from "express";
import prisma from "../utils/prisma";
import { auth } from "../middleware/auth";
import { notFound } from "../utils/errors";

const STATUS_LABELS: Record<string, string> = {
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  delayed: "Delayed",
  customs_hold: "Customs Hold",
  fees_pending: "Fees Pending",
  returned: "Returned",
  lost: "Lost",
};

const router = Router();

router.get("/", auth, async (req: Request, res: Response) => {
  const userRole = req.user!.role;
  const userId = req.user!.userId;

  const where: Record<string, unknown> = { messages: { some: {} } };

  if (userRole === "client") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) where.clientEmail = user.email;
  }

  const trackings = await prisma.tracking.findMany({
    where,
    select: {
      id: true,
      trackingNumber: true,
      clientName: true,
      clientEmail: true,
      status: true,
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true, senderRole: true },
      },
      _count: {
        select: {
          messages: {
            where: {
              senderRole: userRole === "client" ? "admin" : "client",
              readAt: null,
            },
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const conversations = trackings
    .filter((t) => t.messages.length > 0)
    .map((t) => {
      const lastMsg = t.messages[0];
      return {
        id: t.id,
        trackingId: t.id,
        trackingNumber: t.trackingNumber,
        subject: `${t.clientName} - ${STATUS_LABELS[t.status] || t.status}`,
        clientName: t.clientName,
        clientEmail: t.clientEmail,
        status: "open",
        priority: "medium",
        lastMessage: lastMsg.body,
        lastMessageTime: lastMsg.createdAt.toISOString(),
        unreadCount: t._count.messages,
      };
    });

  res.json(conversations);
});

router.patch("/read-all", auth, async (req: Request, res: Response) => {
  const userRole = req.user!.role;
  const userId = req.user!.userId;

  const where: Record<string, unknown> = { messages: { some: {} } };

  if (userRole === "client") {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw notFound("User not found");
    where.clientEmail = user.email;
  }

  const trackings = await prisma.tracking.findMany({
    where,
    select: { id: true },
  });

  const oppositeRole = userRole === "client" ? "admin" : "client";

  await prisma.message.updateMany({
    where: {
      trackingId: { in: trackings.map((t) => t.id) },
      senderRole: oppositeRole,
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  res.json({ success: true });
});

export default router;
