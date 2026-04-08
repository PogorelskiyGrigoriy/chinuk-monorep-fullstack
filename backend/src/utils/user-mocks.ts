import { type UserWithPassword } from "@project/shared";

/**
 * Три мушкетера нашего приложения:
 * 1. Admin (SUPER_USER) - Полный доступ.
 * 2. Sales (SALE) - Доступ к клиентам.
 * 3. Fan (USER) - Доступ к музыке.
 * * Пароль для всех: password123
 */
export const MOCK_USERS: UserWithPassword[] = [
  {
    employeeId: 1, // Andrew Adams в оригинальной базе
    email: "admin@chinook.com",
    firstName: "Grigory",
    lastName: "Admin",
    role: "SUPER_USER",
    // Хеш для 'password123' (bcrypt)
    passwordHash: "$2a$10$X86pZ3pY0E2yvA5Gz9W7u.tYnL5V4kG7u/C9iGfWz/YlS5PqY8e2O", 
  },
  {
    employeeId: 3, // Jane Peacock (Sales Support)
    email: "sales@chinook.com",
    firstName: "Jane",
    lastName: "Sales",
    role: "SALE",
    passwordHash: "$2a$10$X86pZ3pY0E2yvA5Gz9W7u.tYnL5V4kG7u/C9iGfWz/YlS5PqY8e2O",
  },
  {
    employeeId: 999, // Виртуальный пользователь (не сотрудник)
    email: "user@chinook.com",
    firstName: "Music",
    lastName: "Lover",
    role: "USER",
    passwordHash: "$2a$10$X86pZ3pY0E2yvA5Gz9W7u.tYnL5V4kG7u/C9iGfWz/YlS5PqY8e2O",
  }
];