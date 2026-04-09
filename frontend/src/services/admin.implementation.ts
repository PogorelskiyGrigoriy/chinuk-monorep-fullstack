/**
 * @module AdminServiceRest
 * Реализация сервиса администрирования.
 */
import { api } from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { auditLogSchema, type AuditLog, type Pagination } from "@project/shared";
import type { AdminService } from "./admin.service";

class AdminServiceRest implements AdminService {
  // Добавляем params в сигнатуру
  async getLogs(params?: Pagination): Promise<AuditLog[]> {
    // Передаем параметры пагинации в axios
    const { data } = await api.get<AuditLog[]>(API_ENDPOINTS.ADMIN.LOGS, { params });
    
    return data.map(log => auditLogSchema.parse(log));
  }
}

export const adminService: AdminService = new AdminServiceRest();