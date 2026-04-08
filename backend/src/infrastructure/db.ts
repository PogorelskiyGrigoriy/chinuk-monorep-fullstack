import knex from 'knex';
import { ENV } from '../config/env.js';
import logger from '../utils/pino-logger.js';

/**
 * Case conversion helpers:
 * DB (snake_case) <-> JS (camelCase)
 */
const toCamel = (str: string) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
const toSnake = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/**
 * Knex instance for PostgreSQL (Supabase)
 */
export const db = knex({
  client: 'pg',
  connection: {
    host: ENV.DB_HOST,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
    port: ENV.DB_PORT,
    ssl: { rejectUnauthorized: false }, // Critical for Supabase connection
  },

  /**
   * Automatic conversion: snake_case (DB) -> camelCase (JS)
   */
  postProcessResponse: (result) => {
    if (!result) return result;
    
    const convertRow = (row: any) => {
      if (typeof row !== 'object' || row === null) return row;
      const newNode: any = {};
      for (const key of Object.keys(row)) {
        newNode[toCamel(key)] = row[key];
      }
      return newNode;
    };

    return Array.isArray(result) ? result.map(convertRow) : convertRow(result);
  },

  /**
   * Automatic conversion: camelCase (JS) -> snake_case (DB)
   */
  wrapIdentifier: (value, origImpl) => {
    if (value === '*') return origImpl(value);
    return origImpl(toSnake(value));
  },
});

/**
 * Logging query executions for debugging (TZ 2.3)
 */
db.on('query', (data) => {
  logger.debug({ sql: data.sql, bindings: data.bindings }, 'Executing SQL');
});

/**
 * Logging database errors (TZ 2.3)
 */
db.on('query-error', (error, data) => {
  logger.error({ 
    message: error.message, 
    sql: data.sql 
  }, 'SQL Query Error');
});