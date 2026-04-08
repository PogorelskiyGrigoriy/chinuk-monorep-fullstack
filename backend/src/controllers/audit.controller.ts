/**
 * @module AuditController
 * Provides administrative access to system logs.
 * Part of the Accounting layer in AAA.
 */
import type { Request, Response, NextFunction } from 'express';
import { type AuditService } from '@project/shared';

export class AuditController {
  /**
   * Зависит только от AuditService.
   */
  constructor(private auditService: AuditService) {}

  /**
   * Получает все логи из памяти (InMemoryAuditService).
   * По ТЗ доступ к этому методу будет только у SUPER_USER.
   */
  getLogs = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const logs = await this.auditService.getLogs();
      
      // Возвращаем массив логов. 
      // На фронтенде администратор увидит кто, когда и что делал.
      res.json(logs);
    } catch (e) {
      next(e);
    }
  };
}