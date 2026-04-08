/**
 * @module AuthService
 * Implementation of AuthService using JWT and bcrypt-ts.
 */
import jwt from "jsonwebtoken";
import { compare } from "bcrypt-ts";
import { 
  type AuthService, 
  type UserService,
  type LoginData, 
  type AuthResponse, 
  type User,
  type JwtPayload 
} from "@project/shared";
import { ENV } from "../../../config/env.js";
import { UnauthorizedError } from "../../../utils/app-errors.js";

export class InMemoryAuthService implements AuthService {
  constructor(private userService: UserService) {}

  /**
   * ТЗ 2.4: Вход в систему
   */
  async login(credentials: LoginData): Promise<AuthResponse> {
    const { email, password } = credentials;

    const userWithPass = await this.userService.findByEmail(email);
    
    const isPasswordValid = userWithPass 
      ? await compare(password, userWithPass.passwordHash) 
      : false;

    if (!userWithPass || !isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // --- ИСПРАВЛЕНИЕ ТУТ ---
    // Теперь payload соответствует новому интерфейсу JwtPayload
    const payload: JwtPayload = { 
      employeeId: userWithPass.employeeId, 
      email: userWithPass.email,
      role: userWithPass.role 
    };

    const token = jwt.sign(
      payload, 
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );

    const { passwordHash, ...user } = userWithPass;

    return {
      user,
      token
    };
  }

  /**
   * ТЗ 2.4: Проверка сессии (/me)
   */
  async verifySession(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
      
      // --- ИСПРАВЛЕНИЕ ТУТ ---
      // Используем employeeId вместо старого id
      const user = await this.userService.getById(decoded.employeeId);
      
      if (!user) {
        throw new UnauthorizedError("User no longer exists");
      }

      return user;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }

  async logout(employeeId: number): Promise<void> {
    return Promise.resolve();
  }
}