/**
 * @module AuthSchema
 * Zod schemas for identity and access management.
 */
import { z } from "zod";

/**
 * Valid system roles based on business logic.
 */
export const userRoleSchema = z.enum(['SALE', 'USER', 'SUPER_USER']);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * Base user entity.
 * Uses employeeId to maintain mapping with the Chinook database.
 */
export const userSchema = z.object({
  employeeId: z.number().int().positive(),
  email: z.string().email("Invalid email format"),
  role: userRoleSchema,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

export type User = z.infer<typeof userSchema>;

/**
 * Successful authentication payload.
 */
export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
});
export type AuthResponse = z.infer<typeof authResponseSchema>;

/**
 * Login credentials validation.
 */
export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(1, "Password cannot be empty"),
});
export type LoginData = z.infer<typeof loginSchema>;

/**
 * JWT standard structure for cross-service token parsing.
 */
export interface JwtPayload {
  employeeId: number;
  email: string;
  role: UserRole;
}