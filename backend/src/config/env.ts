/**
 * @module EnvConfig
 * Validated environment variables for the Chinook Backend.
 */
import dotenv from "dotenv";
import { z } from "zod";
import logger from "../utils/pino-logger.js";

dotenv.config();

const envSchema = z.object({
  // --- App ---
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),

  // --- Auth & Security ---
  JWT_SECRET: z.string().min(8, "JWT_SECRET must be at least 8 characters"),
  JWT_EXPIRES_IN: z.string().default("2h"),

  // --- Service Logic ---
  DB_TYPE: z.enum(["SUPABASE", "IN_MEMORY"]).default("SUPABASE"),
  AUDIT_TYPE: z.enum(["IN_MEMORY", "DB"]).default("IN_MEMORY"),

  // --- Database (Object-based for Pooler/IPv4 compatibility) ---
  DB_HOST: z.string().min(1, "DB_HOST is required"),
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
  DB_NAME: z.string().default("postgres"),
  DB_PORT: z.coerce.number().default(6543), // Defaulting to Supabase Pooler port
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  const errors = _env.error.issues.map((issue) => ({
    variable: issue.path.join("."),
    message: issue.message,
  }));
  logger.fatal({ errors }, "❌ Invalid environment variables configuration");
  process.exit(1);
}

// Extra security check for production
if (_env.data.NODE_ENV === "production" && 
    (_env.data.JWT_SECRET === "default_fallback_secret" || _env.data.JWT_SECRET === "CHANGE_ME")) {
  logger.fatal("❌ FATAL: Secure JWT_SECRET is required in production!");
  process.exit(1);
}

export const ENV = _env.data;

export type DbType = z.infer<typeof envSchema>["DB_TYPE"];
export type AuditType = z.infer<typeof envSchema>["AUDIT_TYPE"];