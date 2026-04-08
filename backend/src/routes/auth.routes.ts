/**
 * @module AuthRoutes
 * Entry points for identity and session management.
 */
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { services } from "../services/service.factory.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
const authController = new AuthController(services.auth, services.audit);

// Public access
router.post("/login", authController.login);

// Protected access
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);

export default router;