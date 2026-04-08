import { z } from 'zod';

export const auditActionSchema = z.enum([
  'AUTH_LOGIN',
  'AUTH_LOGOUT',
  'DATA_READ',
  'ACCESS_DENIED',
  'SYSTEM_ERROR'
]);

export type AuditAction = z.infer<typeof auditActionSchema>;

export const auditLogSchema = z.object({
  id: z.string().min(1), 
  timestamp: z.string().datetime({ precision: 3 }),
  
  // Меняем userId на employeeId для консистентности с AuthSchema и БД Chinook
  employeeId: z.number().int().positive(),
  
  email: z.string().email(),
  action: auditActionSchema,
  resource: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type AuditLog = z.infer<typeof auditLogSchema>;