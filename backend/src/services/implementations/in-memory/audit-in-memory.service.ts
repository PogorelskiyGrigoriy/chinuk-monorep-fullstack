/**
 * @module InMemoryAuditService
 * Implements the Accounting layer.
 * Stores system actions in memory for administrative oversight.
 */
import { randomUUID } from 'node:crypto';
import { type AuditService, type AuditLog } from '@project/shared';
import logger from '../../../utils/pino-logger.js';

export class InMemoryAuditService implements AuditService {
  /**
   * Internal storage for audit records.
   */
  private logs: AuditLog[] = [];

  /**
   * Limit to prevent memory leaks during development/testing.
   */
  private readonly MAX_LOGS = 1000;

  /**
   * Records a new action to the audit trail.
   * Generates unique ID and high-precision timestamp automatically.
   */
  async log(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const newLog: AuditLog = {
      ...data,
      id: randomUUID(),
      // Соответствует z.string().datetime({ precision: 3 })
      timestamp: new Date().toISOString(), 
    };

    // Добавляем в начало (свежие логи сверху)
    this.logs.unshift(newLog);

    // Ограничиваем размер массива
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    /**
     * Дублируем аудит в системный логгер для удобства отладки в терминале.
     */
    logger.info(
      { 
        auditAction: newLog.action, 
        actor: newLog.email, 
        id: newLog.employeeId,
        resource: newLog.resource 
      }, 
      `[AUDIT] ${newLog.action} by ${newLog.email}`
    );
  }

  /**
   * Retrieves all recorded logs.
   */
  async getLogs(): Promise<AuditLog[]> {
    return this.logs;
  }
}