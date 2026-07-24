import { Router, Request, Response } from "express";
import { z } from "zod";
import { config } from "../config/env";
import { badRequest } from "../utils/errors";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== "string" || q.trim().length === 0) {
    throw badRequest("Query parameter 'q' is required");
  }

  const params = new URLSearchParams({
    q: q.trim(),
    format: "json",
    limit: "5",
  });

  const response = await fetch(
    `${config.nominatimBaseUrl}/search?${params.toString()}`,
    {
      headers: { "User-Agent": "track-connect/1.0" },
    }
  );

  if (!response.ok) {
    throw badRequest("Geocoding request failed");
  }

  const data = await response.json();

  const results = (data as Array<{ lat: string; lon: string; display_name: string }>).map(
    (item) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
    })
  );

  res.json(results);
});

export default router;
