/**
 * @module CustomerQueries
 * Хуки для работы с данными клиентов, инвойсов и их агентов.
 */
import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services/customer.implementation";
import { type Pagination, type SortParams } from "@project/shared";

/** * Список клиентов (ТЗ 1.1) 
 */
export const useCustomers = (params: Pagination & SortParams) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customerService.getAll(params),
  });
};

/** * Инвойсы конкретного клиента (ТЗ 1.1.1.2.1) - Окно №1 
 */
export const useCustomerInvoices = (customerId: number | null) => {
  return useQuery({
    queryKey: ["customers", customerId, "invoices"],
    queryFn: () => customerService.getInvoices(customerId!),
    enabled: !!customerId,
  });
};

/** * Данные менеджера клиента (ТЗ 1.1.1.2.2) - Окно №2 
 * ИСПРАВЛЕНО: Теперь принимает customerId и использует правильный эндпоинт.
 */
export const useCustomerAgent = (customerId: number | null) => {
  return useQuery({
    queryKey: ["customers", customerId, "sales-agent"],
    // Вызывает эндпоинт /api/customers/:id/sales-agent через твой сервис
    queryFn: () => customerService.getSalesAgent(customerId!),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 30, // Данные сотрудников меняются редко
  });
};