/**
 * @module Shared
 * Central entry point for the shared package.
 * Aggregates all schemas and types for seamless consumption by Backend and Frontend.
 */

// 1. Identity & Permissions
export * from './schemas/auth.schema.js';
export * from './types/auth.types.js';

// 2. Security & Compliance (Accounting)
export * from './schemas/audit.schema.js';
export * from './types/audit.types.js';

// 3. UI Helpers & Common Logic
export * from './schemas/common.schema.js';

// 4. Data Domain (Chinook Database)
export * from './schemas/entities.js';

// 5. Global Error Handling Contract
export * from './types/error.types.js';