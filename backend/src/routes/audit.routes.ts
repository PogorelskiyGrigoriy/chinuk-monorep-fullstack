import { Router } from "express";
import { AuditController } from "../controllers/audit.controller.js";
import { services } from "../services/service.factory.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Инициализируем контроллер через фабрику сервисов.
 */
const auditController = new AuditController(services.audit);

/**
 * GET /api/admin/logs
 * * Безопасность (AAA):
 * 1. protect - проверяем JWT (кто это?)
 * 2. authorize('SUPER_USER') - проверяем права (имеет ли право смотреть логи?)
 */
router.get(
  "/logs", 
  protect, 
  authorize("SUPER_USER"), 
  auditController.getLogs
);

export default router;