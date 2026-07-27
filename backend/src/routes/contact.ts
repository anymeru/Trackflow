import { Router, Request, Response } from "express";
import { z } from "zod";
import nodemailer from "nodemailer";
import { config } from "../config/env";

const router = Router();

function getTransporter() {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
  });
}

router.post("/", async (req: Request, res: Response) => {
  const { name, email, company, subject, message } = z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      company: z.string().optional(),
      subject: z.string().min(1),
      message: z.string().min(1),
    })
    .parse(req.body);

  try {
    await getTransporter().sendMail({
      from: config.smtp.from,
      to: config.smtp.from,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `<div style="font-family:sans-serif;padding:24px;">
        <h2>Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company || "—"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr/>
        <p>${message}</p>
      </div>`,
    });
  } catch (err) {
    console.error("Failed to send contact email:", err);
  }

  res.json({ message: "Message received" });
});

export default router;
