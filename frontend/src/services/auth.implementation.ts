import { api } from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { useAuthStore } from "@/store/auth-store";
import { 
  userSchema, 
  authResponseSchema, // Добавили схему ответа
  type LoginData, 
  type User,
  type AuthResponse   // Добавили тип
} from "@project/shared";
import type { AuthService } from "./auth.service";

class AuthServiceRest implements AuthService {
  async login(credentials: LoginData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN, 
      credentials
    );
    
    // Валидируем весь объект (и user, и token) одной строчкой
    return authResponseSchema.parse(data);
  }

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      // Важно: вызываем метод из нашего стора для очистки localStorage
      useAuthStore.getState().logout();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await api.get<User>(API_ENDPOINTS.AUTH.ME);
      return userSchema.parse(data);
    } catch {
      return null;
    }
  }
}

export const authService: AuthService = new AuthServiceRest();