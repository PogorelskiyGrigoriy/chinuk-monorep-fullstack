/**
 * @module AdminService
 * Интерфейс для административных операций и аудита системы.
 */
import { type AuditLog } from "@project/shared";

export interface AdminService {
  /** * Получить историю системных событий (Accounting layer).
   * Доступно только для роли SUPER_USER.
   */
  getLogs(): Promise<AuditLog[]>;
}