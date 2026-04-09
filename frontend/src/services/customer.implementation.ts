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
  type SortParams
} from "@project/shared";
import type { CustomerService } from "./customer.service";

class CustomerServiceRest implements CustomerService {
  
  /**
   * Получает список всех клиентов.
   * ИСПРАВЛЕНО: Добавлена детальная диагностика ошибок валидации.
   */
  async getAll(params?: Pagination & SortParams): Promise<Customer[]> {
    const { data } = await api.get<Customer[]>(API_ENDPOINTS.CUSTOMERS.BASE, { params });
    
    // Используем safeParse для массива, чтобы не блокировать UI при ошибках в схеме
    const result = z.array(CustomerSchema).safeParse(data);
    
    if (!result.success) {
      // Это критически важно для разработки — покажет, какое именно поле в БД «битое»
      console.error("❌ Customer Validation Error:", result.error.format());
      
      // Возвращаем данные как есть (fallback), чтобы таблица не была пустой
      return data as Customer[];
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