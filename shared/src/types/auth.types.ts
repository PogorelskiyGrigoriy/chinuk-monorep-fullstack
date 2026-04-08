/**
 * @module AuthTypes
 * Domain-specific types and service interfaces for authentication logic.
 */
import type { LoginData, AuthResponse, User } from "../schemas/auth.schema.js";

/**
 * Extended user type including security credentials.
 * Used strictly within back-end service layers.
 */
export type UserWithPassword = User & { passwordHash: string };

/**
 * Interface for user management and retrieval.
 */
export interface UserService {
  /** Retrieves a user by ID; returns null if not found to prevent exceptions. */
  getById(id: number): Promise<User | null>; 
  
  /** Finds a user by email for the login process. */
  findByEmail(email: string): Promise<UserWithPassword | null>;
}

/**
 * Interface for authentication and session lifecycle.
 */
export interface AuthService {
  /** Validates credentials and returns session data. */
  login(credentials: LoginData): Promise<AuthResponse>;
  
  /** Verifies token integrity and retrieves the active user. */
  verifySession(token: string): Promise<User>;
  
  /** Invalidates session for the specific employee. */
  logout(employeeId: number): Promise<void>;
}