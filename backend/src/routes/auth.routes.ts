import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { services } from "../services/service.factory.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Инициализируем контроллер, передавая ему сервисы из фабрики.
 * Теперь AuthController имеет доступ и к логике JWT, и к системе аудита.
 */
const authController = new AuthController(services.auth, services.audit);

/**
 * POST /api/auth/login
 * Публичный эндпоинт для входа.
 */
router.post("/login", authController.login);

/**
 * GET /api/auth/me
 * Защищенный эндпоинт для получения данных текущей сессии.
 * Сначала проверяем токен через 'protect', затем отдаем данные.
 */
router.get("/me", protect, authController.getMe);

/**
 * POST /api/auth/logout
 * Защищенный эндпоинт для выхода.
 */
router.post("/logout", protect, authController.logout);

export default router;