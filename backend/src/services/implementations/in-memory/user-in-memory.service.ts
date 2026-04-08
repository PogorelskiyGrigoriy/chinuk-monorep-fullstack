/**
 * @module InMemoryUserService
 * User data access layer using static mock data.
 * Used primarily for Authentication and Session management.
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
   * Internal data store initialized with predefined mock users.
   */
  private users: UserWithPassword[] = [...MOCK_USERS];

  /**
   * Finds a user by email address.
   * Required for the authentication process to retrieve the password hash.
   */
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    logger.debug({ email }, 'User lookup by email');
    
    const user = this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    return user || null;
  }

  /**
   * Retrieves a user profile by their unique employeeId.
   * Used for session verification. Returns a sanitized User object (no password).
   */
  async getById(id: number): Promise<User | null> {
    const userRecord = this.users.find((u) => u.employeeId === id);

    if (!userRecord) return null;

    // Sanitize the object by removing the password hash
    const { passwordHash, ...user } = userRecord;
    return user;
  }
}