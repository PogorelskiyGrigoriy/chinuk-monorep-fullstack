/**
 * @module AdminServiceRest
 * Реализация сервиса администрирования.
 */
import { api } from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { auditLogSchema, type AuditLog } from "@project/shared";
import type { AdminService } from "./admin.service";

class AdminServiceRest implements AdminService {
  
  async getLogs(): Promise<AuditLog[]> {
    const { data } = await api.get<AuditLog[]>(API_ENDPOINTS.ADMIN.LOGS);
    
    // Валидируем массив логов. 
    // Поскольку это аудит безопасности, важно убедиться в корректности данных.
    return data.map(log => auditLogSchema.parse(log));
  }
}

export const adminService: AdminService = new AdminServiceRest();