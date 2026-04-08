/**
 * @module EnvConfig
 * Environment variables validation and configuration for the Chinook application.
 * Uses Zod to ensure the process fails early if critical variables are missing.
 */
import dotenv from "dotenv";
import { z } from "zod";
import logger from "../utils/pino-logger.js";

// Load .env file into process.env
dotenv.config();

/**
 * Validation schema for environment variables.
 */
const envSchema = z.object({
  // --- Application ---
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),

  // --- Auth & Security ---
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  JWT_EXPIRES_IN: z.string().default("2h"),

  // --- Service Strategy ---
  DB_TYPE: z.enum(["SUPABASE", "IN_MEMORY"]).default("SUPABASE"),
  AUDIT_TYPE: z.enum(["IN_MEMORY", "DB"]).default("IN_MEMORY"),

  // --- Database Configuration ---
  DB_HOST: z.string().min(1, "DB_HOST is required"),
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
  DB_NAME: z.string().default("postgres"),
  DB_PORT: z.coerce.number().default(6543), // Supabase Pooler default port
});

// Perform validation
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const errors = _env.error.issues.map((issue) => ({
    variable: issue.path.join("."),
    message: issue.message,
  }));
  
  logger.fatal({ errors }, "Invalid environment variables configuration");
  process.exit(1);
}

// Production-specific security check
if (_env.data.NODE_ENV === "production") {
  const insecureSecrets = ["default_fallback_secret", "CHANGE_ME", "password123"];
  if (insecureSecrets.includes(_env.data.JWT_SECRET)) {
    logger.fatal("FATAL: Secure JWT_SECRET is mandatory for production mode!");
    process.exit(1);
  }
}

/**
 * Exported validated environment object.
 */
export const ENV = _env.data;

// Export types for strategy switching
export type DbType = z.infer<typeof envSchema>["DB_TYPE"];
export type AuditType = z.infer<typeof envSchema>["AUDIT_TYPE"];

// Log successful initialization (excluding secrets)
logger.info(
  { port: ENV.PORT, env: ENV.NODE_ENV, dbType: ENV.DB_TYPE },
  "Configuration loaded successfully"
);