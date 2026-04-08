/**
 * @module AuthService
 * Описание интерфейса для работы с аутентификацией на фронтенде.
 */
import { type User, type LoginData } from "@project/shared";

export interface AuthService {
  /** Авторизация пользователя */
  login(credentials: LoginData): Promise<{ user: User; token: string }>;
  
  /** Выход из системы */
  logout(): Promise<void>;
  
  /** Получение данных текущей сессии (для AppInitializer) */
  getCurrentUser(): Promise<User | null>;
}