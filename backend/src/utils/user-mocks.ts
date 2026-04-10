/**
 * @module UserMocks
 * Static mock users for development and testing.
 * Maps directly to Chinook database records where applicable.
 * Default password for all accounts: 'password123'
 */
import { type UserWithPassword } from "@project/shared";

export const MOCK_USERS: UserWithPassword[] = [
  {
    // Corresponds to Andrew Adams in the original DB
    employeeId: 1,
    email: "admin@chinook.com",
    firstName: "John",
    lastName: "Admin",
    role: "SUPER_USER",
    // Bcrypt hash ($2b$ variant) for 'password123'
    passwordHash: "$2b$10$3bZbXhJx3gkQgfd887ac6uxvGv/jC5qaORmGFvvjN7yPAoEMi8UPe", 
  },
  {
    // Corresponds to Jane Peacock (Sales Support)
    employeeId: 3,
    email: "sales@chinook.com",
    firstName: "Jane",
    lastName: "Sales",
    role: "SALE",
    passwordHash: "$2b$10$3bZbXhJx3gkQgfd887ac6uxvGv/jC5qaORmGFvvjN7yPAoEMi8UPe",
  },
  {
    // Virtual user (non-employee) for public access testing
    employeeId: 999,
    email: "user@chinook.com",
    firstName: "Music",
    lastName: "Lover",
    role: "USER",
    passwordHash: "$2b$10$3bZbXhJx3gkQgfd887ac6uxvGv/jC5qaORmGFvvjN7yPAoEMi8UPe",
  }
];