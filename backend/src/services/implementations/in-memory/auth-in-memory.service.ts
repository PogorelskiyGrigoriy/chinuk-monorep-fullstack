/**
 * @module AuthService
 * Implementation of AuthService using JWT and bcrypt-ts.
 */
import jwt from "jsonwebtoken";
import { compare, hash } from "bcrypt-ts"; // Убедись, что пакет установлен
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
  constructor(private userService: UserService) { }

  /**
   * ТЗ 2.4: Вход в систему
   * Сверяет пароль через bcrypt-ts и выдает JWT.
   */
  async login(credentials: LoginData): Promise<AuthResponse> {
    const { email, password } = credentials;
    const userWithPass = await this.userService.findByEmail(email);


    // 1. Ищем пользователя

    // 2. Сверяем хеш пароля (как в твоем прошлом проекте)
    // Важно: функция асинхронная, поэтому обязательно await
    const isPasswordValid = userWithPass
      ? await compare(password, userWithPass.passwordHash)
      : false;

    // 3. Если не найден или пароль не совпал — кидаем ошибку
    if (!userWithPass || !isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // 4. Формируем Payload для токена (с учетом нашего рефакторинга)
    const payload: JwtPayload = {
      employeeId: userWithPass.employeeId,
      email: userWithPass.email,
      role: userWithPass.role
    };

    // 5. Подписываем токен
    const token = jwt.sign(
      payload,
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN as any }
    );

    // 6. Убираем хеш пароля из объекта пользователя
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

      // Ищем по нашему ключу employeeId
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
    // Метод для будущего расширения (Blacklisting)
    return Promise.resolve();
  }
}