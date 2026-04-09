import { useQuery } from "@tanstack/react-query";
import { employeeService } from "@/services/employee.implementation";

/** Получение данных менеджера (Окно №2) */
export const useSalesAgent = (employeeId: number | null) => {
  return useQuery({
    queryKey: ["employees", employeeId],
    queryFn: () => employeeService.getById(employeeId!),
    enabled: !!employeeId,
    staleTime: 1000 * 60 * 30, // Данные сотрудников меняются редко, кэшируем на 30 мин
  });
};