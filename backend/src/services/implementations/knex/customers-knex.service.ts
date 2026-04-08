import { db } from '../../../infrastructure/db.js';
import { 
  CustomerSchema, 
  InvoiceSchema, 
  EmployeeSchema,
  type Customer, 
  type Invoice, 
  type Employee 
} from '@project/shared';
import { CustomersService } from '../../interfaces.js';
import { NotFoundError } from '../../../utils/app-errors.js';

export class CustomersKnexService implements CustomersService {
  
  async getAll(): Promise<Customer[]> {
    const rows = await db('customer').select({
      customerId: 'customer_id',
      firstName: 'first_name',
      lastName: 'last_name',
      company: 'company',
      address: 'address',
      city: 'city',
      state: 'state',
      country: 'country',
      postalCode: 'postal_code',
      phone: 'phone',
      fax: 'fax',
      email: 'email',
      supportRepId: 'support_rep_id'
    });
    
    // Валидируем массив через Zod
    return rows.map(row => CustomerSchema.parse(row));
  }

  async getById(id: number): Promise<Customer> {
    const row = await db('customer')
      .where({ customer_id: id })
      .first();

    if (!row) throw new NotFoundError(`Customer with ID ${id}`);

    // Маппинг и валидация
    return CustomerSchema.parse({
      ...row,
      customerId: row.customer_id,
      firstName: row.first_name,
      lastName: row.last_name,
      // ... остальные поля через маппер
    });
  }

  async getCustomerInvoices(customerId: number): Promise<Invoice[]> {
    const rows = await db('invoice')
      .where({ customer_id: customerId })
      .select({
        invoiceId: 'invoice_id',
        customerId: 'customer_id',
        invoiceDate: 'invoice_date',
        billingAddress: 'billing_address',
        total: 'total'
        // ... и так далее
      });

    return rows.map(row => InvoiceSchema.parse(row));
  }

  async getSalesAgent(customerId: number): Promise<Employee> {
    // ТЗ требует данные об агенте, закрепленном за клиентом
    const agent = await db('customer')
      .join('employee', 'customer.support_rep_id', 'employee.employee_id')
      .where('customer.customer_id', customerId)
      .select({
        employeeId: 'employee.employee_id',
        firstName: 'employee.first_name',
        lastName: 'employee.last_name',
        email: 'employee.email',
        hireDate: 'employee.hire_date',
        birthDate: 'employee.birth_date',
        city: 'employee.city',
        country: 'employee.country'
      })
      .first();

    if (!agent) throw new NotFoundError(`Sales agent for customer ${customerId}`);

    return EmployeeSchema.parse(agent);
  }
}