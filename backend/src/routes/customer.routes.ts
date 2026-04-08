import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller.js";
import { services } from "../services/service.factory.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { auditRead } from "../middleware/audit.middleware.js";

const router = Router();

/**
 * Инициализируем контроллер, передавая ему реализацию CustomersKnexService
 */
const customerController = new CustomerController(services.customers);

/**
 * Применяем общие правила для всех роутов клиентов:
 * 1. protect - только для залогиненных
 * 2. authorize - только для ролей SALE и SUPER_USER (ТЗ 2.5.2)
 */
const customerGuard = [protect, authorize("SALE", "SUPER_USER")];

/**
 * GET /api/customers
 * ТЗ 1.1: Список всех клиентов
 */
router.get(
  "/", 
  ...customerGuard, 
  auditRead("Customers List"), 
  customerController.getAll
);

/**
 * GET /api/customers/:id
 * Детали конкретного клиента
 */
router.get(
  "/:id", 
  ...customerGuard, 
  auditRead("Customer Details"), 
  customerController.getById
);

/**
 * GET /api/customers/:id/invoices
 * ТЗ 1.1.1.2.1: Список счетов клиента
 */
router.get(
  "/:id/invoices", 
  ...customerGuard, 
  auditRead("Customer Invoices"), 
  customerController.getInvoices
);

/**
 * GET /api/customers/:id/sales-agent
 * ТЗ 1.1.1.2.2: Данные агента поддержки
 */
router.get(
  "/:id/sales-agent", 
  ...customerGuard, 
  auditRead("Customer Sales Agent"), 
  customerController.getSalesAgent
);

export default router;