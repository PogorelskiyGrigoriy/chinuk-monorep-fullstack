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
    passwordHash: "$2b$10$3bZbXhJx3gkQgfd887ac6uxvGv/jC5qaORmGFvvjN7yPAoEMi8UPe", 
  },
  {
    employeeId: 3, // Jane Peacock (Sales Support)
    email: "sales@chinook.com",
    firstName: "Jane",
    lastName: "Sales",
    role: "SALE",
    passwordHash: "$2b$10$3bZbXhJx3gkQgfd887ac6uxvGv/jC5qaORmGFvvjN7yPAoEMi8UPe",
  },
  {
    employeeId: 999, // Виртуальный пользователь (не сотрудник)
    email: "user@chinook.com",
    firstName: "Music",
    lastName: "Lover",
    role: "USER",
    passwordHash: "$2b$10$3bZbXhJx3gkQgfd887ac6uxvGv/jC5qaORmGFvvjN7yPAoEMi8UPe",
  }
];