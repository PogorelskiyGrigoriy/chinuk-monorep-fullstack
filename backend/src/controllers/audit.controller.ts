/**
 * @module AuditController
 * Provides administrative access to security and activity logs.
 */
import type { Request, Response, NextFunction } from 'express';
import { type AuditService } from '@project/shared';

export class AuditController {
  constructor(private auditService: AuditService) {}

  /**
   * Retrieves system-wide audit logs.
   * Access is restricted via middleware to administrative roles only.
   */
  getLogs = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.auditService.getLogs();
      res.json(logs);
    } catch (e) {
      next(e);
    }
  };
}