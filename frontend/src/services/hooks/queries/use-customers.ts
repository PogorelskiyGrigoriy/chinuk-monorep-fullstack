/**
 * @module CustomerQueries
 * Набор хуков TanStack Query для домена Клиентов.
 * Управляет кэшированием и жизненным циклом данных CRM.
 */
import { useQuery } from "@tanstack/react-query";
import { customerService } from "@/services/customer.implementation";
import { type Pagination, type SortParams } from "@project/shared";

/**
 * Хук для получения списка клиентов.
 * Автоматически перезапрашивает данные при изменении страницы или сортировки.
 */
export const useCustomers = (params: Pagination & SortParams) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customerService.getAll(params),
    // Данные кэшируются на 5 минут, что идеально для стабильного списка клиентов
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Хук для получения счетов конкретного клиента.
 * Используется в модальном окне/шторке Invoices.
 */
export const useCustomerInvoices = (customerId: number | null) => {
  return useQuery({
    queryKey: ["invoices", "customer", customerId],
    // Запрос выполнится только если customerId не null
    queryFn: () => customerService.getInvoices(customerId!),
    enabled: !!customerId,
    // Счета могут обновляться часто, ставим время "свежести" поменьше
    staleTime: 1000 * 60, 
  });
};

/**
 * Хук для получения данных ответственного менеджера.
 * Используется в карточке Sales Agent.
 */
export const useCustomerAgent = (customerId: number | null) => {
  return useQuery({
    queryKey: ["customer-agent", customerId],
    queryFn: () => customerService.getSalesAgent(customerId!),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 15, // Данные сотрудников меняются редко
  });
};