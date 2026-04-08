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

export class CustomersKnexService implements CustomersService {
  
  async getAll(): Promise<Customer[]> {
    // Наш Knex сам превратит snake_case из базы в camelCase
    const rows = await db('customer').select('*');
    
    // Валидируем данные. Благодаря postProcessResponse, ключи уже в camelCase
    return rows.map(row => CustomerSchema.parse(row));
  }

  async getById(id: number): Promise<Customer> {
    const row = await db('customer')
      .where({ customerId: id }) // wrapIdentifier превратит это в customer_id
      .first();

    if (!row) throw new NotFoundError(`Customer with ID ${id}`);

    return CustomerSchema.parse(row);
  }

  async getCustomerInvoices(customerId: number): Promise<Invoice[]> {
    const rows = await db('invoice')
      .where({ customerId });

    return rows.map(row => InvoiceSchema.parse(row));
  }

  async getSalesAgent(customerId: number): Promise<Employee> {
    const agent = await db('customer')
      .join('employee', 'customer.support_rep_id', 'employee.employee_id')
      .where('customer.customer_id', customerId)
      // Выбираем только поля сотрудника. 
      // Knex всё равно превратит их в camelCase для нас.
      .select('employee.*') 
      .first();

    if (!agent) throw new NotFoundError(`Sales agent for customer ${customerId}`);

    return EmployeeSchema.parse(agent);
  }
}