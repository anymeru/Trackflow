import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function env(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

function autoJwtSecret(): string {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  const generated = crypto.randomBytes(32).toString("hex");
  console.warn("⚠ JWT_SECRET not set — generated a random one (tokens invalidated on restart)");
  return generated;
}

export const config = {
  port: parseInt(env("PORT", "3001"), 10),
  jwtSecret: autoJwtSecret(),
  databaseUrl: env("DATABASE_URL"),
  corsOrigin: env("CORS_ORIGIN", "http://localhost:5173"),
  smtp: {
    host: env("SMTP_HOST"),
    port: parseInt(env("SMTP_PORT", "587"), 10),
    user: env("SMTP_USER", ""),
    pass: env("SMTP_PASS", ""),
    from: env("SMTP_FROM", "track-connect@example.com"),
  },
  admin: {
    phone: env("ADMIN_PHONE", "+237 XXX XXX XXX"),
    telegram: env("ADMIN_TELEGRAM", "+237 XXX XXX XXX"),
  },
  nominatimBaseUrl: env("NOMINATIM_BASE_URL", "https://nominatim.openstreetmap.org"),
  osrmBaseUrl: env("OSRM_BASE_URL", "https://router.project-osrm.org"),
  averageSpeedKmh: parseFloat(env("AVERAGE_SPEED_KMH", "60")),
};
