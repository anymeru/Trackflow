import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import { auth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import { badRequest, notFound } from "../utils/errors";
import { param } from "../utils/params";

const router = Router();

router.get("/", auth, requireRole("admin"), async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      _count: { select: { messages: true } },
    },
  });
  res.json(users);
});

const updateRoleSchema = z.object({
  role: z.enum(["admin", "operator", "client"]),
});

router.patch("/:id", auth, requireRole("admin"), async (req: Request, res: Response) => {
  const id = param(req, "id");
  const parsed = updateRoleSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest("Validation failed", parsed.error.flatten());

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw notFound("User not found");

  const user = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
  });

  res.json(user);
});

router.delete("/:id", auth, requireRole("admin"), async (req: Request, res: Response) => {
  const id = param(req, "id");

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) throw notFound("User not found");

  if (id === req.user!.userId) {
    throw badRequest("Cannot delete yourself");
  }

  await prisma.user.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
