import prisma from "../utils/prisma";
import { calculateEta } from "./eta";
import { sendStatusEmail } from "./email";
import { getIO } from "../socket";
import { isMovingStatus, isFreezingStatus, isTerminalStatus } from "./status";
import { haversineDistance } from "../utils/geo";

let simulationInterval: ReturnType<typeof setInterval> | null = null;

export function startPositionSimulation(intervalMs = 10000): void {
  if (simulationInterval) return;

  simulationInterval = setInterval(async () => {
    try {
      const trackings = await prisma.tracking.findMany({
        where: { status: { in: ["in_transit", "out_for_delivery"] } },
      });

      for (const tracking of trackings) {
        const remaining = haversineDistance(
          tracking.currentLat,
          tracking.currentLng,
          tracking.destLat,
          tracking.destLng
        );

        if (remaining < 0.5) {
          await changeStatusAndNotify(
            tracking.id,
            tracking.status,
            "delivered",
            "Livraison effectuée"
          );
          continue;
        }

        const distancePerTick =
          (tracking.avgSpeedKmh * (intervalMs / 3600000));

        const progress = 1 - remaining / haversineDistance(
          tracking.originLat,
          tracking.originLng,
          tracking.destLat,
          tracking.destLng
        );

        if (
          tracking.status === "in_transit" &&
          progress >= 0.9
        ) {
          await changeStatusAndNotify(
            tracking.id,
            "in_transit",
            "out_for_delivery",
            "En cours de livraison"
          );
          continue;
        }

        const frac = Math.min(1, distancePerTick / remaining);
        const newLat =
          tracking.currentLat + (tracking.destLat - tracking.currentLat) * frac;
        const newLng =
          tracking.currentLng + (tracking.destLng - tracking.currentLng) * frac;

        const { eta } = await calculateEta(
          newLat,
          newLng,
          tracking.destLat,
          tracking.destLng,
          tracking.avgSpeedKmh
        );

        await prisma.tracking.update({
          where: { id: tracking.id },
          data: { currentLat: newLat, currentLng: newLng, eta },
        });

        const io = getIO();
        io.to(`tracking:${tracking.id}`).emit("tracking:updated", {
          trackingId: tracking.id,
          status: tracking.status,
          currentLat: newLat,
          currentLng: newLng,
          eta: eta.toISOString(),
        });
      }
    } catch (err) {
      console.error("Position simulation error:", err);
    }
  }, intervalMs);
}

export function stopPositionSimulation(): void {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

export async function changeStatusAndNotify(
  trackingId: string,
  oldStatus: string,
  newStatus: string,
  reason: string
): Promise<void> {
  const tracking = await prisma.tracking.findUnique({ where: { id: trackingId } });
  if (!tracking) return;

  let newEta = tracking.eta;

  if (isFreezingStatus(newStatus)) {
    // ETA stays frozen
  } else if (isTerminalStatus(newStatus)) {
    if (newStatus === "delivered") {
      await prisma.tracking.update({
        where: { id: trackingId },
        data: {
          currentLat: tracking.destLat,
          currentLng: tracking.destLng,
          status: newStatus,
        },
      });
    }
    newEta = newStatus === "delivered" ? new Date() : null;
  } else if (newStatus === "in_transit") {
    const { eta } = await calculateEta(
      tracking.currentLat,
      tracking.currentLng,
      tracking.destLat,
      tracking.destLng,
      tracking.avgSpeedKmh
    );
    newEta = eta;
  }

  await prisma.statusHistory.create({
    data: {
      trackingId,
      oldStatus,
      newStatus,
      reason,
    },
  });

  await prisma.tracking.update({
    where: { id: trackingId },
    data: {
      status: newStatus,
      eta: newEta,
    },
  });

  const io = getIO();
  if (isFreezingStatus(newStatus)) {
    io.to(`tracking:${trackingId}`).emit("tracking:frozen", {
      trackingId,
      status: newStatus,
      reason,
    });
  } else if (newStatus === "delivered") {
    io.to(`tracking:${trackingId}`).emit("tracking:delivered", {
      trackingId,
    });
  } else {
    io.to(`tracking:${trackingId}`).emit("tracking:updated", {
      trackingId,
      status: newStatus,
      currentLat: tracking.currentLat,
      currentLng: tracking.currentLng,
      eta: newEta?.toISOString(),
    });
  }

  const statusLabels: Record<string, string> = {
    in_transit: "En transit",
    out_for_delivery: "En cours de livraison",
    delivered: "Livré",
    delayed: "En retard",
    customs_hold: "Bloqué en douane",
    fees_pending: "Frais en attente",
    returned: "Retourné",
    lost: "Perdu",
  };

  await sendStatusEmail(
    trackingId,
    tracking.clientEmail,
    tracking.trackingNumber,
    statusLabels[newStatus] || newStatus,
    reason
  );
}


