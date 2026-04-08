import { z } from "zod";

export const userRoleSchema = z.enum(['SALE', 'USER', 'SUPER_USER']);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * Базовая сущность пользователя. 
 * Используем employeeId, чтобы совпадало с базой Chinook.
 */
export const userSchema = z.object({
  employeeId: z.number().int().positive(),
  email: z.email(),
  role: userRoleSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type User = z.infer<typeof userSchema>;

export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});
export type LoginData = z.infer<typeof loginSchema>;

export interface JwtPayload {
  id: number;
  role: UserRole;
}