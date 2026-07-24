import { Router, Request, Response } from "express";
import { z } from "zod";
import { config } from "../config/env";
import { badRequest } from "../utils/errors";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const querySchema = z.object({
    originLat: z.coerce.number(),
    originLng: z.coerce.number(),
    destLat: z.coerce.number(),
    destLng: z.coerce.number(),
  });

  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) throw badRequest("Invalid coordinates", parsed.error.flatten());

  const { originLat, originLng, destLat, destLng } = parsed.data;

  const url = `${config.osrmBaseUrl}/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`;

  const response = await fetch(url);

  if (!response.ok) {
    throw badRequest("Routing request failed");
  }

  const data = await response.json() as {
    code: string;
    routes: Array<{ distance: number; duration: number }>;
  };

  if (data.code !== "Ok" || !data.routes.length) {
    throw badRequest("No route found between the given points");
  }

  const route = data.routes[0];

  res.json({
    distanceKm: route.distance / 1000,
    durationSeconds: route.duration,
  });
});

export default router;
