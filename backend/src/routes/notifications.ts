import { Router, Request, Response } from "express";
import prisma from "../utils/prisma";
import { auth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";

const router = Router();

router.get("/log", auth, requireRole("admin"), async (req: Request, res: Response) => {
  const { type, page = "1", limit = "50" } = req.query;

  const where: Record<string, unknown> = {};
  if (type && typeof type === "string") {
    where.type = type;
  }

  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));

  const [logs, total] = await Promise.all([
    prisma.notificationLog.findMany({
      where,
      orderBy: { sentAt: "desc" },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      include: { tracking: { select: { trackingNumber: true } } },
    }),
    prisma.notificationLog.count({ where }),
  ]);

  res.json({
    data: logs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

router.get(
  "/stats",
  auth,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const [totalTrackings, statusCounts, recentTrackings] = await Promise.all([
      prisma.tracking.count(),
      prisma.tracking.groupBy({
        by: ["status"],
        _count: true,
      }),
      prisma.tracking.findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          trackingNumber: true,
          clientName: true,
          status: true,
          updatedAt: true,
        },
      }),
    ]);

    const deliveryCount = statusCounts.find((s) => s.status === "delivered");
    const totalDelivered = deliveryCount?._count || 0;
    const deliveryRate = totalTrackings > 0 ? (totalDelivered / totalTrackings) * 100 : 0;

    const disputesOpen = await prisma.dispute.count({ where: { status: "open" } });

    res.json({
      totalTrackings,
      deliveryRate: Math.round(deliveryRate * 100) / 100,
      statusCounts: statusCounts.map((s) => ({ status: s.status, count: s._count })),
      recentTrackings,
      disputesOpen,
    });
  }
);

export default router;
