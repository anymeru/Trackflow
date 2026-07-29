import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import http from "http";
import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { initSocket } from "./socket";
import { startPositionSimulation } from "./services/position";

import authRoutes from "./routes/auth";
import geocodeRoutes from "./routes/geocode";
import routingRoutes from "./routes/routing";
import trackingRoutes from "./routes/trackings";
import messageRoutes from "./routes/messages";
import disputeRoutes from "./routes/disputes";
import notificationRoutes from "./routes/notifications";
import userRoutes from "./routes/users";
import conversationRoutes from "./routes/conversations";
import contactRoutes from "./routes/contact";
import settingsRoutes from "./routes/settings";
import publicRoutes from "./routes/public";

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/routing", routingRoutes);
app.use("/api/trackings", trackingRoutes);
app.use("/api/trackings/:id/messages", messageRoutes);
app.use("/api/trackings/:id/disputes", disputeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/public", publicRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

initSocket(server);

startPositionSimulation();

server.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

export default app;
