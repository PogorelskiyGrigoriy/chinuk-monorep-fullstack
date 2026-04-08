/**
 * @module InMemoryAuditService
 * In-memory implementation of the Accounting layer.
 * Manages system activity logs with a fixed capacity to prevent memory leaks.
 */
import { randomUUID } from 'node:crypto';
import { type AuditService, type AuditLog } from '@project/shared';
import logger from '../../../utils/pino-logger.js';

export class InMemoryAuditService implements AuditService {
  private logs: AuditLog[] = [];
  private readonly MAX_LOGS = 1000;

  /**
   * Records a new event to the audit trail.
   */
  async log(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const newLog: AuditLog = {
      ...data,
      id: randomUUID(),
      timestamp: new Date().toISOString(), 
    };

    // Add to the beginning of the array (most recent first)
    this.logs.unshift(newLog);

    // Keep the log history within bounds
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    // Mirror audit event to system logger for terminal visibility
    logger.info(
      { 
        auditAction: newLog.action, 
        actor: newLog.email, 
        resource: newLog.resource 
      }, 
      `[AUDIT] ${newLog.action} by ${newLog.email}`
    );
  }

  /**
   * Returns the entire log history.
   */
  async getLogs(): Promise<AuditLog[]> {
    return this.logs;
  }
}