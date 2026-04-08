/**
 * @module AuditRoutes
 * Administrative endpoints for system oversight.
 */
import { Router } from "express";
import { AuditController } from "../controllers/audit.controller.js";
import { services } from "../services/service.factory.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();
const auditController = new AuditController(services.audit);

/**
 * GET /api/admin/logs
 * Restricted to SUPER_USER only.
 */
router.get(
  "/logs", 
  protect, 
  authorize("SUPER_USER"), 
  auditController.getLogs
);

export default router;