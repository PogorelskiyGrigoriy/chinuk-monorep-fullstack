/**
 * @module EnvConfig
 * Environment variables validation and configuration for Chinook Explorer.
 */
import dotenv from "dotenv";
import { z } from "zod";
import logger from "src/utils/pino-logger.js";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  
  // JWT для авторизации (из твоего ТЗ 2.4)
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  JWT_EXPIRES_IN: z.string().default("2h"),

  // Тип базы данных для основных данных (Chinook)
  // Мы оставляем выбор, но по умолчанию теперь SUPABASE (Postgres)
  DB_TYPE: z.enum(["SUPABASE", "IN_MEMORY"]).default("SUPABASE"),

  // Тип для аудита (как ты и просил — in-memory)
  AUDIT_TYPE: z.enum(["IN_MEMORY", "DB"]).default("IN_MEMORY"),

  // Строка подключения к Supabase (обязательна, если DB_TYPE = SUPABASE)
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection string"),
});

// Parse and validate process.env
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const errors = _env.error.issues.map((issue) => ({
    variable: issue.path.join("."),
    message: issue.message,
  }));

  logger.fatal({ errors }, "❌ Invalid environment variables configuration");
  process.exit(1);
}

// Проверка безопасности для продакшена
if (_env.data.NODE_ENV === "production" && 
    (_env.data.JWT_SECRET === "default_fallback_secret" || _env.data.JWT_SECRET === "CHANGE_ME")) {
  logger.fatal(
    { node_env: _env.data.NODE_ENV },
    "❌ FATAL: JWT_SECRET must be a unique secure string in production!"
  );
  process.exit(1);
}

export const ENV = _env.data;

// Типизация для фабрики сервисов
export type DbType = z.infer<typeof envSchema>["DB_TYPE"];
export type AuditType = z.infer<typeof envSchema>["AUDIT_TYPE"];