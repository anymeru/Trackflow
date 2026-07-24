import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function env(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const config = {
  port: parseInt(env("PORT", "3001"), 10),
  jwtSecret: env("JWT_SECRET"),
  databaseUrl: env("DATABASE_URL"),
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
