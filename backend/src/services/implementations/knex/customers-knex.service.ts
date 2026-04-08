import { db } from '../../../infrastructure/db.js';
import { 
  CustomerSchema, 
  InvoiceSchema, 
  EmployeeSchema,
  type Customer, 
  type Invoice, 
  type Employee 
} from '@project/shared';
import { CustomersService } from '../../entities.service.js';
import { NotFoundError } from '../../../utils/app-errors.js';
import logger from '../../../utils/pino-logger.js';

export class CustomersKnexService implements CustomersService {
  
  /**
   * ТЗ 1.1: Получаем всех клиентов.
   * Если данные в базе "грязные", мы логируем это, но не валим сервер.
   */
  async getAll(): Promise<Customer[]> {
    const rows = await db('customer').select('*');
    
    return rows.map(row => {
      const result = CustomerSchema.safeParse(row);
      
      if (!result.success) {
        logger.warn({ customerId: row.customerId, errors: result.error.format() }, 'Data integrity issue');
        // Возвращаем данные, но хотя бы через safeParse.data, если это возможно,
        // либо очищенный объект.
        return row as Customer; 
      }
      
      return result.data;
    });
  }

  async getById(id: number): Promise<Customer> {
    const row = await db('customer').where({ customerId: id }).first();

    if (!row) throw new NotFoundError(`Customer with ID ${id}`);

    // Используем safeParse и здесь для консистентности
    const result = CustomerSchema.safeParse(row);
    if (!result.success) {
      logger.error({ id, error: result.error.format() }, 'Customer data corrupted in DB');
      return row as Customer;
    }

    return result.data;
  }

  async getCustomerInvoices(customerId: number): Promise<Invoice[]> {
    const rows = await db('invoice').where({ customerId });
    // Инвойсы обычно чище, но safeParse лишним не будет
    return rows.map(row => {
      const res = InvoiceSchema.safeParse(row);
      return res.success ? res.data : (row as Invoice);
    });
  }

  async getSalesAgent(customerId: number): Promise<Employee> {
    const agent = await db('customer')
      .join('employee', 'customer.support_rep_id', 'employee.employee_id')
      .where('customer.customer_id', customerId)
      .select('employee.*') 
      .first();

    if (!agent) throw new NotFoundError(`Sales agent for customer ${customerId}`);

    const result = EmployeeSchema.safeParse(agent);
    return result.success ? result.data : (agent as Employee);
  }
}