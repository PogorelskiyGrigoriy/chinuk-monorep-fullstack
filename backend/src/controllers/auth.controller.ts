/**
 * @module AuthController
 * Handles authentication requests and records security events in the audit trail.
 */
import type { Request, Response, NextFunction } from 'express';
import { 
  type AuthService, 
  type AuditService, 
  loginSchema 
} from '@project/shared';
import { UnauthorizedError } from '../utils/app-errors.js';
import logger from '../utils/pino-logger.js';

export class AuthController {
  constructor(
    private authService: AuthService,
    private auditService: AuditService
  ) {}

  /**
   * Authenticates user and logs the entry event.
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const authData = await this.authService.login(credentials);

      await this.auditService.log({
        employeeId: authData.user.employeeId,
        email: authData.user.email,
        action: 'AUTH_LOGIN',
        metadata: { ip: req.ip, userAgent: req.headers['user-agent'] }
      });

      logger.info({ email: authData.user.email }, "User logged in successfully");
      res.json(authData);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Retrieves current session profile.
   */
  getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new UnauthorizedError("No active session");

      const token = req.headers.authorization?.split(' ')[1] || '';
      const user = await this.authService.verifySession(token);
      res.json(user);
    } catch (e) {
      next(e);
    }
  };

  /**
   * Invalidates session and logs the exit event.
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        await this.auditService.log({
          employeeId: req.user.employeeId,
          email: req.user.email,
          action: 'AUTH_LOGOUT'
        });

        await this.authService.logout(req.user.employeeId);
        logger.info({ email: req.user.email }, "User logged out");
      }
      
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  };
}