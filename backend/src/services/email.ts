import nodemailer from "nodemailer";
import { config } from "../config/env";
import prisma from "../utils/prisma";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }
  return transporter;
}

function buildStatusEmail(
  trackingNumber: string,
  statusLabel: string,
  reason?: string,
  includeContact?: boolean
): { subject: string; html: string } {
  const statusEmojis: Record<string, string> = {
    in_transit: "🚚",
    out_for_delivery: "📬",
    delivered: "✅",
    delayed: "⏰",
    customs_hold: "🛃",
    fees_pending: "💳",
    returned: "↩️",
    lost: "❌",
  };

  const emoji = statusEmojis[statusLabel] || "📦";
  const subject = `${emoji} Votre colis #${trackingNumber} est ${statusLabel}`;

  const contactBlock = includeContact
    ? `
    <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:16px;margin:16px 0;">
      <p style="font-weight:600;margin:0 0 8px;">📞 Contactez notre équipe support :</p>
      <p style="margin:4px 0;">📱 WhatsApp : <strong>${config.admin.phone}</strong></p>
      <p style="margin:4px 0;">✈️ Telegram : <strong>${config.admin.telegram}</strong></p>
    </div>`
    : "";

  const reasonBlock = reason
    ? `<p style="color:#6b7280;font-size:14px;">Motif : ${reason}</p>`
    : "";

  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <div style="background:#1e293b;color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:20px;">${emoji} Mise à jour de votre colis</h1>
      </div>
      <div style="background:white;border:1px solid #e5e7eb;padding:24px;border-radius:0 0 12px 12px;">
        <h2 style="margin:0 0 16px;color:#1e293b;">Colis #${trackingNumber}</h2>
        <div style="background:#f0fdf4;border:1px solid #22c55e;border-radius:8px;padding:12px;text-align:center;margin-bottom:16px;">
          <p style="font-size:18px;font-weight:700;margin:0;color:#16a34a;">Nouveau statut : ${statusLabel}</p>
        </div>
        ${reasonBlock}
        ${contactBlock}
        <p style="color:#6b7280;font-size:13px;margin-top:16px;">
          Suivez votre colis en temps réel sur votre tableau de bord.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
        <p style="color:#9ca3af;font-size:12px;text-align:center;">
          Track-Connect — Plateforme de suivi de colis
        </p>
      </div>
    </div>`;

  return { subject, html };
}

const FREEZE_LABELS = ["Bloqué en douane", "Frais en attente", "Perdu"];

export async function sendStatusEmail(
  trackingId: string,
  recipientEmail: string,
  trackingNumber: string,
  statusLabel: string,
  reason?: string
): Promise<void> {
  const includeContact = FREEZE_LABELS.includes(statusLabel);

  const { subject, html } = buildStatusEmail(trackingNumber, statusLabel, reason, includeContact);

  try {
    await getTransporter().sendMail({
      from: config.smtp.from,
      to: recipientEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }

  await prisma.notificationLog.create({
    data: {
      trackingId,
      recipientEmail,
      type: "status_change",
      subject,
      body: html,
    },
  });
}

export async function sendDisputeOpenedEmail(
  trackingId: string,
  recipientEmail: string,
  trackingNumber: string
): Promise<void> {
  const subject = `📋 Litige ouvert pour le colis #${trackingNumber}`;
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <div style="background:#1e293b;color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:20px;">📋 Litige ouvert</h1>
      </div>
      <div style="background:white;border:1px solid #e5e7eb;padding:24px;border-radius:0 0 12px 12px;">
        <p>Un litige a été ouvert pour le colis <strong>#${trackingNumber}</strong>.</p>
        <p>Notre équipe va examiner votre demande et vous tiendra informé.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
        <p style="color:#9ca3af;font-size:12px;text-align:center;">Track-Connect</p>
      </div>
    </div>`;

  try {
    await getTransporter().sendMail({
      from: config.smtp.from,
      to: recipientEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send dispute email:", err);
  }

  await prisma.notificationLog.create({
    data: {
      trackingId,
      recipientEmail,
      type: "dispute_opened",
      subject,
      body: html,
    },
  });
}

export async function sendDisputeResolvedEmail(
  trackingId: string,
  recipientEmail: string,
  trackingNumber: string,
  response: string
): Promise<void> {
  const subject = `✅ Litige résolu pour le colis #${trackingNumber}`;
  const html = `
    <div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;">
      <div style="background:#1e293b;color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="margin:0;font-size:20px;">✅ Litige résolu</h1>
      </div>
      <div style="background:white;border:1px solid #e5e7eb;padding:24px;border-radius:0 0 12px 12px;">
        <p>Le litige pour le colis <strong>#${trackingNumber}</strong> a été résolu.</p>
        <div style="background:#f0fdf4;border:1px solid #22c55e;border-radius:8px;padding:12px;margin:12px 0;">
          <p style="font-weight:600;margin:0 0 4px;">Réponse de l'équipe :</p>
          <p style="margin:0;color:#374151;">${response}</p>
        </div>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">
        <p style="color:#9ca3af;font-size:12px;text-align:center;">Track-Connect</p>
      </div>
    </div>`;

  try {
    await getTransporter().sendMail({
      from: config.smtp.from,
      to: recipientEmail,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send dispute resolved email:", err);
  }

  await prisma.notificationLog.create({
    data: {
      trackingId,
      recipientEmail,
      type: "dispute_resolved",
      subject,
      body: html,
    },
  });
}
