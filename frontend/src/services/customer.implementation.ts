/**
 * @module CustomerServiceRest
 * REST-реализация сервиса для работы с Chinook CRM.
 */
import { api } from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { 
  CustomerSchema, 
  InvoiceSchema, 
  EmployeeSchema,
  type Customer, 
  type Invoice, 
  type Employee 
} from "@project/shared";
import type { CustomerService } from "./customer.service";

class CustomerServiceRest implements CustomerService {
  
  async getAll(): Promise<Customer[]> {
    const { data } = await api.get<Customer[]>(API_ENDPOINTS.CUSTOMERS.BASE);
    // Используем маппинг для валидации каждого элемента
    return data.map(item => CustomerSchema.parse(item));
  }

  async getById(id: number): Promise<Customer> {
    const { data } = await api.get<Customer>(API_ENDPOINTS.CUSTOMERS.BY_ID(id));
    return CustomerSchema.parse(data);
  }

  async getInvoices(customerId: number): Promise<Invoice[]> {
    const { data } = await api.get<Invoice[]>(API_ENDPOINTS.CUSTOMERS.INVOICES(customerId));
    return data.map(item => InvoiceSchema.parse(item));
  }

  async getSalesAgent(customerId: number): Promise<Employee> {
    const { data } = await api.get<Employee>(API_ENDPOINTS.CUSTOMERS.SALES_AGENT(customerId));
    return EmployeeSchema.parse(data);
  }
}

export const customerService: CustomerService = new CustomerServiceRest();