import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { unauthorized } from "../utils/errors";
import prisma from "../utils/prisma";

export interface AuthPayload {
  userId: string;
  role: string;
  tokenVersion: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function auth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw unauthorized("Missing or invalid token");
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthPayload;
    prisma.user.findUnique({ where: { id: payload.userId }, select: { tokenVersion: true } })
      .then((user) => {
        if (!user || user.tokenVersion !== payload.tokenVersion) {
          return next(unauthorized("Token revoked"));
        }
        req.user = payload;
        next();
      })
      .catch(() => {
        next(unauthorized("Token verification failed"));
      });
  } catch {
    throw unauthorized("Invalid or expired token");
  }
}
