import { type AuditLog } from "../schemas/audit.schema.js";

export interface AuditService {
  /** * Мы не передаем id и timestamp, так как сервис добавит их сам 
   * при записи в массив или базу.
   */
  log(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void>;
  
  getLogs(): Promise<AuditLog[]>;
}