/**
 * @module CustomerService
 * Интерфейс для управления данными клиентов.
 */
import { 
  type Customer, 
  type Invoice, 
  type Employee, 
  type Pagination, 
  type SortParams 
} from "@project/shared";

export interface CustomerService {
  /** * Получить список всех клиентов с поддержкой пагинации и сортировки (ТЗ 1.1) 
   */
  getAll(params?: Pagination & SortParams): Promise<Customer[]>;
  
  /** Получить детальную информацию о клиенте (ТЗ 1.1.1.2) */
  getById(id: number): Promise<Customer>;
  
  /** Получить список инвойсов клиента (ТЗ 1.1.1.2.1) */
  getInvoices(customerId: number): Promise<Invoice[]>;
  
  /** Получить данные ответственного менеджера (ТЗ 1.1.1.2.2) */
  getSalesAgent(customerId: number): Promise<Employee>;
}