/**
 * @module AuditMiddleware
 * Automatically records data access events using the application logger.
 */
import type { Request, Response, NextFunction } from "express";
import { services } from "../services/service.factory.js";
import logger from "../utils/pino-logger.js"; // Импортируем наш логгер

/**
 * Middleware для логирования чтения данных.
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
      // Заменяем console.error на профессиональный pino-logger
      logger.error(
        { error, resource, user: req.user?.email }, 
        `Audit logging failed for resource: ${resource}`
      );
    } finally {
      next();
    }
  };
};