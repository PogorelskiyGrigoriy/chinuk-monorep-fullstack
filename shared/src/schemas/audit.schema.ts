/**
 * @module AuditSchema
 * Zod schemas for the Accounting layer.
 * Defines the structure of system activity logs and security events.
 */
import { z } from 'zod';

/**
 * Supported audit event types.
 */
export const auditActionSchema = z.enum([
  'AUTH_LOGIN',
  'AUTH_LOGOUT',
  'DATA_READ',
  'ACCESS_DENIED',
  'SYSTEM_ERROR'
]);

export type AuditAction = z.infer<typeof auditActionSchema>;

/**
 * Structure of a single audit log entry.
 * Consistent with ISO 8601 high-precision timestamps.
 */
export const auditLogSchema = z.object({
  id: z.string().uuid("Invalid log ID format"), 
  timestamp: z.string().datetime({ precision: 3 }),
  
  // Linked to employeeId from Chinook DB and Auth context
  employeeId: z.number().int().positive(),
  
  email: z.string().email("Invalid email format"),
  action: auditActionSchema,
  resource: z.string().optional(),
  
  // Metadata stores extra context (IP, User Agent, etc.) using unknown for safety
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;