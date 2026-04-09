/**
 * @module AdminService
 */
import { type AuditLog, type Pagination } from "@project/shared";

export interface AdminService {
  /** * Получить историю системных событий (Accounting layer).
   * Теперь контракт разрешает передачу параметров пагинации.
   */
  getLogs(params?: Pagination): Promise<AuditLog[]>; // Добавлен необязательный параметр
}