/**
 * @module CustomerController
 * Handles requests related to customers, invoices, and sales agents.
 */
import type { Request, Response, NextFunction } from 'express';
import { type CustomersService } from 'src/services/entities.service.js';
import { NotFoundError } from '../utils/app-errors.js';

export class CustomerController {
  /**
   * Внедряем CustomersService для работы с БД Chinook.
   */
  constructor(private customersService: CustomersService) {}

  /**
   * ТЗ 1.1: Получить список всех клиентов для главной таблицы.
   */
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const customers = await this.customersService.getAll();
      res.json(customers);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Получить детальную информацию о конкретном клиенте.
   */
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const customer = await this.customersService.getById(id);
      
      if (!customer) throw new NotFoundError(`Customer with ID ${id}`);
      
      res.json(customer);
    } catch (e) {
      next(e);
    }
  };

  /**
   * ТЗ 1.1.1.2.1: Получить все счета (инвойсы) клиента.
   */
  getInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = Number(req.params.id);
      const invoices = await this.customersService.getCustomerInvoices(customerId);
      res.json(invoices);
    } catch (e) {
      next(e);
    }
  };

  /**
   * ТЗ 1.1.1.2.2: Получить данные агента по продажам, закрепленного за клиентом.
   */
  getSalesAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = Number(req.params.id);
      const agent = await this.customersService.getSalesAgent(customerId);
      res.json(agent);
    } catch (e) {
      next(e);
    }
  };
}