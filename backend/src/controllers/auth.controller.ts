/**
 * @module AuthController
 * Handles identity-related requests and logs security events (Accounting).
 */
import type { Request, Response, NextFunction } from 'express';
import { 
  type AuthService, 
  type AuditService, 
  loginSchema 
} from '@project/shared';
import { UnauthorizedError } from '../utils/app-errors.js';

export class AuthController {
  /**
   * Контроллер зависит от AuthService (бизнес-логика) 
   * и AuditService (логирование действий согласно ТЗ 2.2).
   */
  constructor(
    private authService: AuthService,
    private auditService: AuditService
  ) {}

  /**
   * ТЗ 2.4: Аутентификация пользователя.
   * Проверяет данные, выдает токен и записывает событие в аудит.
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Валидация входных данных через Zod
      const credentials = loginSchema.parse(req.body);

      // 2. Вызов сервиса аутентификации
      const authData = await this.authService.login(credentials);

      // 3. ТЗ 2.2: Запись успешного входа в лог аудита
      await this.auditService.log({
        employeeId: authData.user.employeeId,
        email: authData.user.email,
        action: 'AUTH_LOGIN',
        metadata: { ip: req.ip, userAgent: req.headers['user-agent'] }
      });

      // 4. Отправка ответа (User + Token)
      res.json(authData);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Получение данных текущей сессии (/me).
   */
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // req.user будет заполнен нашим Auth Middleware (напишем следующим шагом)
      if (!req.user) {
        throw new UnauthorizedError("Session not found");
      }

      // Возвращаем данные пользователя, привязанного к токену
      const user = await this.authService.verifySession(req.headers.authorization?.split(' ')[1] || '');
      res.json(user);
    } catch (e) {
      next(e);
    }
  };

  /**
   * ТЗ 2.4: Выход из системы.
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        // ТЗ 2.2: Логируем выход
        await this.auditService.log({
          employeeId: req.user.employeeId,
          email: req.user.email,
          action: 'AUTH_LOGOUT'
        });

        await this.authService.logout(req.user.employeeId);
      }
      
      // По ТЗ на логаут обычно возвращаем 204 No Content
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}