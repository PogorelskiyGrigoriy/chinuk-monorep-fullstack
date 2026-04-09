/**
 * @module CustomerServiceRest
 * REST-реализация сервиса для работы с Chinook CRM.
 * Инкапсулирует вызовы к API и отказоустойчивую валидацию данных.
 */
import { z } from "zod";
import { api } from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { 
  CustomerSchema, 
  InvoiceSchema, 
  EmployeeSchema,
  type Customer, 
  type Invoice, 
  type Employee,
  type Pagination,
  type SortParams,
  type PaginatedResponse,
  createPaginatedResponseSchema
} from "@project/shared";
import type { CustomerService } from "./customer.service";

class CustomerServiceRest implements CustomerService {
  
  /**
   * Получает список всех клиентов.
   * ИСПРАВЛЕНО: Добавлена детальная диагностика ошибок валидации.
   */
  async getAll(params?: Pagination & SortParams): Promise<PaginatedResponse<Customer>> {
    // 1. Указываем правильный тип в дженерике axios
    const { data } = await api.get<PaginatedResponse<Customer>>(API_ENDPOINTS.CUSTOMERS.BASE, { params });
    
    // 2. Создаем схему для пагинированного ответа
    const paginatedSchema = createPaginatedResponseSchema(CustomerSchema);
    const result = paginatedSchema.safeParse(data);
    
    if (!result.success) {
      console.error("❌ Customers Pagination Validation Error:", result.error.format());
      // Возвращаем как есть (fallback), чтобы не ломать UI
      return data;
    }

    return result.data;
  }

  /**
   * Получает детальную информацию о конкретном клиенте.
   */
  async getById(id: number): Promise<Customer> {
    const { data } = await api.get<Customer>(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    
    const result = CustomerSchema.safeParse(data);
    if (!result.success) {
      console.error(`❌ Detail Customer (${id}) Validation Error:`, result.error.format());
      return data as Customer;
    }
    
    return result.data;
  }

  /**
   * Получает список инвойсов клиента.
   */
  async getInvoices(customerId: number): Promise<Invoice[]> {
    const { data } = await api.get<Invoice[]>(API_ENDPOINTS.CUSTOMERS.INVOICES(customerId));
    
    const result = z.array(InvoiceSchema).safeParse(data);
    if (!result.success) {
      console.error("❌ Invoice Validation Error:", result.error.format());
      return data as Invoice[];
    }
    
    return result.data;
  }

  /**
   * Получает данные менеджера, закрепленного за клиентом.
   */
  async getSalesAgent(customerId: number): Promise<Employee> {
    const { data } = await api.get<Employee>(API_ENDPOINTS.CUSTOMERS.SALES_AGENT(customerId));
    
    const result = EmployeeSchema.safeParse(data);
    if (!result.success) {
      console.warn("⚠️ Sales Agent Data Incomplete:", result.error.format());
      return data as Employee;
    }
    
    return result.data;
  }
}

export const customerService: CustomerService = new CustomerServiceRest();