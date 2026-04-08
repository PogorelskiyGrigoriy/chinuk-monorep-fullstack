import type { LoginData, AuthResponse, User } from "../schemas/auth.schema.js";

export type UserWithPassword = User & { passwordHash: string };

export interface UserService {
  /** Возвращаем null, если не нашли, чтобы не падать */
  getById(id: number): Promise<User | null>; 
  findByEmail(email: string): Promise<UserWithPassword | null>;
}

export interface AuthService {
  login(credentials: LoginData): Promise<AuthResponse>;
  verifySession(token: string): Promise<User>;
  /** Используем employeeId для логаута */
  logout(employeeId: number): Promise<void>;
}