/**
 * @module CustomersKnexService
 * Database implementation for customer-related operations.
 * Uses Knex.js to interact with the PostgreSQL Chinook database.
 */
import { db } from '../../../infrastructure/db.js';
import { 
  CustomerSchema, 
  InvoiceSchema, 
  EmployeeSchema,
  type Customer, 
  type Invoice, 
  type Employee,
  type Pagination, 
  type PaginatedResponse
} from '@project/shared';
import { CustomersService } from '../../entities.service.js';
import { NotFoundError } from '../../../utils/app-errors.js';
import logger from '../../../utils/pino-logger.js';

export class CustomersKnexService implements CustomersService {
  
  async getAll(params: Pagination): Promise<PaginatedResponse<Customer>> {
    const { page, limit } = params;
    const offset = (page - 1) * limit;

    // 1. Fetch data slice
    const rows = await db('customer')
      .select('*')
      .limit(limit)
      .offset(offset)
      .orderBy('customer_id', 'asc');

    // 2. Fetch total count for metadata
    const countRes = await db('customer').count('customer_id as total').first();
    const total = Number(countRes?.total || 0);

    // 3. Map and validate results
    const data = rows.map(row => {
      const result = CustomerSchema.safeParse(row);
      return result.success ? result.data : (row as Customer);
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Retrieves a single customer by ID.
   */
  async getById(id: number): Promise<Customer> {
    const row = await db('customer').where({ customerId: id }).first();

    if (!row) throw new NotFoundError(`Customer with ID ${id}`);

    const result = CustomerSchema.safeParse(row);
    if (!result.success) {
      logger.error({ id, error: result.error.format() }, 'Customer record validation failed');
      return row as Customer;
    }

    return result.data;
  }

  /**
   * Retrieves all invoices for a specific customer.
   */
  async getCustomerInvoices(customerId: number): Promise<Invoice[]> {
    const rows = await db('invoice').where({ customerId });
    
    return rows.map(row => {
      const res = InvoiceSchema.safeParse(row);
      return res.success ? res.data : (row as Invoice);
    });
  }

  /**
   * Fetches the sales support employee associated with a customer.
   */
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