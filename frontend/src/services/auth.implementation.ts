/**
 * @module AuthServiceRest
 * REST-реализация сервиса аутентификации с использованием Axios.
 */
import { api } from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useAuthStore } from "@/store/auth-store";
import { 
  userSchema, 
  type LoginData, 
  type User 
} from "@project/shared";
import type { AuthService } from "./auth.service";

class AuthServiceRest implements AuthService {
  /**
   * Логин: отправляем данные, получаем юзера и токен, 
   * валидируем ответ через Zod.
   */
  async login(credentials: LoginData): Promise<{ user: User; token: string }> {
    const { data } = await api.post<{ user: User; token: string }>(
      API_ENDPOINTS.AUTH.LOGIN, 
      credentials
    );
    
    // Валидируем только объект пользователя, токен просто пробрасываем
    const validatedUser = userSchema.parse(data.user);
    
    return { 
      user: validatedUser, 
      token: data.token 
    };
  }

  /**
   * Логаут: уведомляем бэкенд и очищаем локальный стор.
   */
  async logout(): Promise<void> {
    try {
      // Даже если бэкенд упал, мы должны разлогинить юзера локально
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      useAuthStore.getState().logout();
    }
  }

  /**
   * Проверка сессии: используется в AppInitializer для восстановления входа.
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await api.get<User>(API_ENDPOINTS.AUTH.ME);
      return userSchema.parse(data);
    } catch (error) {
      // Если 401 или ошибка сети — возвращаем null, инициализатор сам разберется
      return null;
    }
  }
}

// Экспортируем готовый экземпляр (Singleton)
export const authService: AuthService = new AuthServiceRest();