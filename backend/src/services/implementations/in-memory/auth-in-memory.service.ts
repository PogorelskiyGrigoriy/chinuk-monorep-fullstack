/**
 * @module AuthService
 * Implementation of AuthService using JWT and bcrypt-ts.
 * Bridges the gap between identity (UserService) and session management.
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
  /**
   * Мы внедряем UserService через конструктор, чтобы AuthService 
   * не зависел от того, откуда берутся данные пользователей (память или БД).
   */
  constructor(private userService: UserService) {}

  /**
   * ТЗ 2.4: Вход в систему
   * Проверяет учетные данные и выдает JWT токен.
   */
  async login(credentials: LoginData): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Ищем пользователя через UserService
    const userWithPass = await this.userService.findByEmail(email);
    
    // Сверяем пароль с хэшем
    const isPasswordValid = userWithPass 
      ? await compare(password, userWithPass.passwordHash) 
      : false;

    if (!userWithPass || !isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Создаем полезную нагрузку для токена (используем числовой employeeId как id)
    const payload: JwtPayload = { 
      id: userWithPass.employeeId, 
      role: userWithPass.role 
    };

    const token = jwt.sign(
      payload, 
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );

    // Убираем пароль перед возвратом (деструктуризация)
    const { passwordHash, ...user } = userWithPass;

    return {
      user,
      token
    };
  }

  /**
   * ТЗ 2.4: Проверка сессии (/me)
   * Расшифровывает токен и возвращает актуальные данные пользователя.
   */
  async verifySession(token: string): Promise<User> {
    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
      
      const user = await this.userService.getById(decoded.id);
      
      if (!user) {
        throw new UnauthorizedError("User no longer exists");
      }

      return user;
    } catch (error) {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }

  /**
   * ТЗ 2.4: Выход из системы
   * В текущей JWT реализации достаточно просто "забыть" токен на клиенте,
   * но интерфейс требует наличия метода для будущего расширения.
   */
  async logout(employeeId: number): Promise<void> {
    // В будущем здесь можно добавить employeeId в "черный список" токенов (Redis)
    return Promise.resolve();
  }
}