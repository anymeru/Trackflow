import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../utils/prisma";
import { config } from "../config/env";
import { badRequest, unauthorized } from "../utils/errors";
import { auth } from "../middleware/auth";
import nodemailer from "nodemailer";

const router = Router();

function getTransporter() {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest("Validation failed", parsed.error.flatten());

  const { email, password, name, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw badRequest("Email already in use");

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name, phone, role: "client" },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role, tokenVersion: user.tokenVersion },
    config.jwtSecret,
    { expiresIn: "24h" }
  );

  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) throw badRequest("Validation failed", parsed.error.flatten());

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw unauthorized("Invalid email or password");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw unauthorized("Invalid email or password");

  const token = jwt.sign(
    { userId: user.id, role: user.role, tokenVersion: user.tokenVersion },
    config.jwtSecret,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

router.get("/me", auth, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true, role: true, phone: true },
  });
  if (!user) throw unauthorized("User not found");
  res.json(user);
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = z.object({ email: z.string().email() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.json({ message: "If that email exists, a reset link has been sent." });
    return;
  }
  const resetToken = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: "15m" });
  const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;
  try {
    await getTransporter().sendMail({
      from: config.smtp.from,
      to: email,
      subject: "Password Reset — Track-Connect",
      html: `<div style="max-width:480px;margin:0 auto;font-family:sans-serif;padding:24px;">
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#00b4d8;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;">Reset Password</a>
        <p style="color:#6b7280;font-size:13px;">If you didn't request this, ignore this email.</p>
      </div>`,
    });
  } catch (err) {
    console.error("Failed to send reset email:", err);
  }
  res.json({ message: "If that email exists, a reset link has been sent." });
});

router.post("/reset-password", async (req: Request, res: Response) => {
  const { token, password } = z
    .object({ token: z.string().min(1), password: z.string().min(6) })
    .parse(req.body);
  let payload: { userId: string };
  try {
    payload = jwt.verify(token, config.jwtSecret) as { userId: string };
  } catch {
    throw badRequest("Invalid or expired reset token");
  }
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: payload.userId }, data: { password: hashed } });
  res.json({ message: "Password updated successfully" });
});

router.post("/refresh", async (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw unauthorized("Missing token");
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { userId: string; role: string; tokenVersion: number };
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { tokenVersion: true } });
    if (!user) throw unauthorized("User not found");
    const newToken = jwt.sign(
      { userId: payload.userId, role: payload.role, tokenVersion: user.tokenVersion },
      config.jwtSecret,
      { expiresIn: "24h" }
    );
    res.json({ token: newToken });
  } catch {
    throw unauthorized("Invalid or expired token");
  }
});

router.patch("/profile", auth, async (req: Request, res: Response) => {
  const { name, phone } = z
    .object({ name: z.string().min(1).optional(), phone: z.string().optional() })
    .parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: { ...(name && { name }), ...(phone !== undefined && { phone }) },
    select: { id: true, name: true, email: true, role: true, phone: true },
  });
  res.json(user);
});

router.post("/change-password", auth, async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = z
    .object({ currentPassword: z.string().min(1), newPassword: z.string().min(6) })
    .parse(req.body);
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user) throw unauthorized("User not found");
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw unauthorized("Current password is incorrect");
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, tokenVersion: { increment: 1 } },
  });
  res.json({ message: "Password changed successfully" });
});

export default router;
