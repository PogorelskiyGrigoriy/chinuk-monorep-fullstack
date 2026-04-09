import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.implementation";
import { type Pagination } from "@project/shared";

export const useAuditLogs = (params: Pagination) => {
  return useQuery({
    queryKey: ["audit", params],
    // Теперь adminService.getLogs(params) сработает корректно
    queryFn: () => adminService.getLogs(params), 
    staleTime: 1000 * 30, 
  });
};