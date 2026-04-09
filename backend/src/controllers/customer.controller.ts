/**
 * @module CustomerController
 * Orchestrates customer-related requests between the route layer and domain services.
 */
import type { Request, Response, NextFunction } from 'express';
import { type CustomersService } from '../services/entities.service.js';
import { NotFoundError } from '../utils/app-errors.js';
import { paginationSchema } from '@project/shared';

export class CustomerController {
  constructor(private customersService: CustomersService) {}

  /**
   * GET /api/customers - Retrieves paginated list of customers.
   */
  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate page/limit from query string (?page=1&limit=10)
      const params = paginationSchema.parse(req.query);
      
      const result = await this.customersService.getAll(params);
      res.json(result);
    } catch (e) {
      next(e);
    }
  };

  /**
   * GET /api/customers/:id - Retrieves a single customer profile.
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
   * GET /api/customers/:id/invoices - Retrieves customer billing history.
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
   * GET /api/customers/:id/sales-agent - Retrieves assigned support representative.
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