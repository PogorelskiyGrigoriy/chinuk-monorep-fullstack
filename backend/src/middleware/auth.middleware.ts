/**
 * @module AuthMiddleware
 * JWT protection and Role-Based Access Control (RBAC).
 */
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { type JwtPayload, type UserRole } from "@project/shared";
import { UnauthorizedError, ForbiddenError } from "../utils/app-errors.js";
import logger from "../utils/pino-logger.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Validates JWT in Authorization header.
 */
export const protect = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Bearer token required");
  }

  const token = authHeader.split(" ")[1];
  if (!token) throw new UnauthorizedError("Token missing");

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as unknown as JwtPayload;
    
    req.user = {
      employeeId: decoded.employeeId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    logger.debug({ error }, "JWT verification failed");
    throw new UnauthorizedError("Invalid session token");
  }
};

/**
 * Validates user permissions based on roles.
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError("Identity verification required");
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        { user: req.user.email, role: req.user.role, required: roles },
        "Unauthorized access attempt"
      );
      throw new ForbiddenError("Insufficient permissions for this resource");
    }

    next();
  };
};