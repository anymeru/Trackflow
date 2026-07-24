import { Request, Response, NextFunction } from "express";
import { forbidden } from "../utils/errors";

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw forbidden("Not authenticated");
    }
    if (!roles.includes(req.user.role)) {
      throw forbidden(`Requires one of roles: ${roles.join(", ")}`);
    }
    next();
  };
}
