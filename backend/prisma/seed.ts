import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const clientPassword = await bcrypt.hash("client123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@track-connect.com" },
    update: {},
    create: {
      email: "admin@track-connect.com",
      password: adminPassword,
      name: "Admin",
      role: "admin",
      phone: "+237 XXX XXX XXX",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      email: "client@example.com",
      password: clientPassword,
      name: "Jean Dupont",
      role: "client",
      phone: "+237 YYY YYY YYY",
    },
  });

  const tracking = await prisma.tracking.upsert({
    where: { trackingNumber: "TC-DEMO001" },
    update: {},
    create: {
      trackingNumber: "TC-DEMO001",
      clientName: "Jean Dupont",
      clientEmail: "client@example.com",
      packageDescription: "Document administratif",
      weight: 0.5,
      originLat: 48.8566,
      originLng: 2.3522,
      originAddress: "Paris, France",
      destLat: 4.0511,
      destLng: 9.7679,
      destinationAddress: "Douala, Cameroun",
      currentLat: 48.8566,
      currentLng: 2.3522,
      status: "in_transit",
      avgSpeedKmh: 60,
      statusHistory: {
        create: {
          oldStatus: null,
          newStatus: "in_transit",
          reason: "Colis créé et en transit",
        },
      },
    },
  });

  const tracking2 = await prisma.tracking.upsert({
    where: { trackingNumber: "TC-DEMO002" },
    update: {},
    create: {
      trackingNumber: "TC-DEMO002",
      clientName: "Marie Claire",
      clientEmail: "marie@example.com",
      packageDescription: "Vêtements",
      weight: 2.3,
      originLat: 34.0522,
      originLng: -118.2437,
      originAddress: "Los Angeles, USA",
      destLat: 48.8566,
      destLng: 2.3522,
      destinationAddress: "Paris, France",
      currentLat: 40.7128,
      currentLng: -74.006,
      status: "customs_hold",
      avgSpeedKmh: 60,
      statusHistory: {
        create: {
          oldStatus: "in_transit",
          newStatus: "customs_hold",
          reason: "Document douane manquant",
        },
      },
    },
  });

  await prisma.dispute.create({
    data: {
      trackingId: tracking2.id,
      clientId: client.id,
      reason: "delivery_delay",
      description: "Le colis est bloqué depuis 2 semaines sans nouvelle.",
      status: "open",
    },
  });

  await prisma.message.create({
    data: {
      trackingId: tracking2.id,
      senderId: client.id,
      senderRole: "client",
      body: "Bonjour, quand est-ce que mon colis va être débloqué ?",
    },
  });

  console.log("Seed completed successfully");
  console.log(`Admin: admin@track-connect.com / admin123`);
  console.log(`Client: client@example.com / client123`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
