/**
 * @module CustomerServiceRest
 * REST-реализация сервиса для работы с Chinook CRM.
 * Инкапсулирует вызовы к API и валидацию данных.
 */
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
   * Передает параметры пагинации и сортировки в Query String.
   */
  async getAll(params?: Pagination & SortParams): Promise<Customer[]> {
    const { data } = await api.get<Customer[]>(API_ENDPOINTS.CUSTOMERS.BASE, { params });
    
    // Валидируем каждый элемент массива через Zod
    return data.map(item => CustomerSchema.parse(item));
  }

  /**
   * Получает детальную информацию о конкретном клиенте.
   */
  async getById(id: number): Promise<Customer> {
    const { data } = await api.get<Customer>(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    return CustomerSchema.parse(data);
  }

  /**
   * Получает список инвойсов (счетов) клиента для модального окна №1.
   */
  async getInvoices(customerId: number): Promise<Invoice[]> {
    const { data } = await api.get<Invoice[]>(API_ENDPOINTS.CUSTOMERS.INVOICES(customerId));
    return data.map(item => InvoiceSchema.parse(item));
  }

  /**
   * Получает данные менеджера, закрепленного за клиентом (модальное окно №2).
   */
  async getSalesAgent(customerId: number): Promise<Employee> {
    const { data } = await api.get<Employee>(API_ENDPOINTS.CUSTOMERS.SALES_AGENT(customerId));
    return EmployeeSchema.parse(data);
  }
}

// Экспортируем синглтон
export const customerService: CustomerService = new CustomerServiceRest();