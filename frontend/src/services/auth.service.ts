import { type LoginData, type AuthResponse, type User } from "@project/shared";

export interface AuthService {
  // Используем AuthResponse вместо ручного описания объекта
  login(credentials: LoginData): Promise<AuthResponse>;
  
  logout(): Promise<void>;
  
  getCurrentUser(): Promise<User | null>;
}