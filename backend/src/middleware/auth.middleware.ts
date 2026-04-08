/**
 * @module AuthMiddleware
 * Middleware for JWT verification and Role-Based Access Control (RBAC).
 */
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { type JwtPayload, type UserRole } from "@project/shared";
import { UnauthorizedError, ForbiddenError } from "../utils/app-errors.js";

/**
 * Расширяем интерфейс Request от Express.
 * Теперь TS будет знать, что у объекта req есть поле user.
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * ТЗ 2.4 & 2.5: Проверка JWT токена.
 * Если токен валиден, добавляет данные пользователя в req.user.
 */
export const protect = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // 1. Проверяем наличие заголовка и префикса Bearer
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Not authorized, no token provided");
  }

  // 2. Достаем сам токен
  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new UnauthorizedError("Not authorized, token is missing");
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as unknown as JwtPayload;
    
    // Теперь ключи в req.user полностью совпадают с JwtPayload и ожиданиями контроллера
    req.user = {
      employeeId: decoded.employeeId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // Если токен протух или подпись неверна
    throw new UnauthorizedError("Not authorized, invalid or expired token");
  }
};

/**
 * ТЗ 2.5: Проверка прав доступа (Authorization).
 * Сравнивает роль пользователя с разрешенными ролями для роута.
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Проверяем, прошел ли запрос через 'protect'
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    // Проверяем, есть ли у пользователя нужная роль (ТЗ 2.5.2 - 2.5.4)
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied: role '${req.user.role}' is not authorized for this action`
      );
    }

    next();
  };
};