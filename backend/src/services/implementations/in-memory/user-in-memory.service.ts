/**
 * @module InMemoryUserService
 * Implementation of UserService using the provided MOCK_USERS.
 * Handles user lookup for Authentication and Session management.
 */
import { 
  type UserService, 
  type User, 
  type UserWithPassword 
} from "@project/shared";
import { MOCK_USERS } from "../../../utils/user-mocks.js";
import logger from "../../../utils/pino-logger.js";

export class InMemoryUserService implements UserService {
  /**
   * Internal storage initialized with our "Three Musketeers"
   */
  private users: UserWithPassword[] = [...MOCK_USERS];

  /**
   * ТЗ 2.4: Поиск пользователя по email для процесса Login.
   * Возвращает полную запись, включая passwordHash.
   */
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    logger.debug({ email }, 'InMemoryUser: searching by email');
    
    const user = this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    return user || null;
  }

  /**
   * ТЗ 2.4: Получение данных пользователя по ID (employeeId).
   * Используется для проверки сессии (verifySession).
   * Возвращает чистый объект User (без пароля).
   */
  async getById(id: number): Promise<User | null> {
    const userRecord = this.users.find((u) => u.employeeId === id);

    if (!userRecord) return null;

    // "Очищаем" объект от хеша пароля перед возвратом
    const { passwordHash, ...user } = userRecord;
    return user;
  }
}