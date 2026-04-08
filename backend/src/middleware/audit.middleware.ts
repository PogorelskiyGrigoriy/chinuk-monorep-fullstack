/**
 * @module AuditMiddleware
 * Express middleware for automatic data access recording.
 */
import type { Request, Response, NextFunction } from "express";
import { services } from "../services/service.factory.js";
import logger from "../utils/pino-logger.js";

/**
 * Tracks DATA_READ actions for protected resources.
 */
export const auditRead = (resource: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        await services.audit.log({
          employeeId: req.user.employeeId,
          email: req.user.email,
          action: 'DATA_READ',
          resource: resource,
          metadata: { 
            path: req.originalUrl,
            method: req.method,
            ip: req.ip 
          }
        });
      }
    } catch (error) {
      logger.error(
        { error, resource, user: req.user?.email }, 
        `Audit logging failed for resource: ${resource}`
      );
    } finally {
      next();
    }
  };
};