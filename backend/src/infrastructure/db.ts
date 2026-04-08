/**
 * @module DatabaseInfrastructure
 * Knex configuration for PostgreSQL (Supabase).
 * Handles automatic case conversion between DB (snake_case) and JS (camelCase).
 */
import knex from 'knex';
import { ENV } from '../config/env.js';
import logger from '../utils/pino-logger.js';

/**
 * Case conversion utility functions.
 */
const toCamel = (str: string) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
const toSnake = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/**
 * Knex instance initialization.
 */
export const db = knex({
  client: 'pg',
  connection: {
    host: ENV.DB_HOST,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
    port: ENV.DB_PORT,
    ssl: { rejectUnauthorized: false }, // Required for Supabase security
  },

  /**
   * Response Hook: Converts DB snake_case columns to JS camelCase.
   */
  postProcessResponse: (result) => {
    if (!result) return result;
    
    const convertRow = (row: any) => {
      if (typeof row !== 'object' || row === null) return row;
      
      const entries = Object.entries(row).map(([key, value]) => [toCamel(key), value]);
      return Object.fromEntries(entries);
    };

    return Array.isArray(result) ? result.map(convertRow) : convertRow(result);
  },

  /**
   * Identifier Wrapper: Converts JS camelCase identifiers to DB snake_case.
   */
  wrapIdentifier: (value, origImpl) => {
    if (value === '*') return origImpl(value);
    return origImpl(toSnake(value));
  },
});

/**
 * Lifecycle Events: Logging for observability and debugging.
 */

// Debug SQL queries in development
db.on('query', (data) => {
  logger.debug({ sql: data.sql, bindings: data.bindings }, 'SQL Query Executing');
});

// Capture and log database execution errors
db.on('query-error', (error, data) => {
  logger.error(
    { message: error.message, sql: data.sql, bindings: data.bindings }, 
    'Database Query Error'
  );
});

logger.info('Database infrastructure initialized');