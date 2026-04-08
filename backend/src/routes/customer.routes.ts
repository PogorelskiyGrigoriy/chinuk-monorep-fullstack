/**
 * @module CustomerRoutes
 * API endpoints for customer management, protected by RBAC.
 */
import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller.js";
import { services } from "../services/service.factory.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { auditRead } from "../middleware/audit.middleware.js";

const router = Router();
const customerController = new CustomerController(services.customers);

/**
 * Access policy:
 * 1. Authentication required (protect).
 * 2. SALE or SUPER_USER role required.
 */
const customerGuard = [protect, authorize("SALE", "SUPER_USER")];

// List all customers
router.get("/", ...customerGuard, auditRead("Customers List"), customerController.getAll);

// Specific customer details
router.get("/:id", ...customerGuard, auditRead("Customer Details"), customerController.getById);

// Billing history
router.get("/:id/invoices", ...customerGuard, auditRead("Customer Invoices"), customerController.getInvoices);

// Support staff info
router.get("/:id/sales-agent", ...customerGuard, auditRead("Customer Sales Agent"), customerController.getSalesAgent);

export default router;