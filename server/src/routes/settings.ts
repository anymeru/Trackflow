import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../utils/prisma";
import { auth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";

const router = Router();

router.get("/", auth, requireRole("admin"), async (_req: Request, res: Response) => {
  const rows = await prisma.setting.findMany();
  const settings: Record<string, string> = {};
  for (const row of rows) settings[row.key] = row.value;
  res.json(settings);
});

const setSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

router.put("/", auth, requireRole("admin"), async (req: Request, res: Response) => {
  const { key, value } = setSchema.parse(req.body);
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  res.json({ message: "Setting saved" });
});

export default router;
