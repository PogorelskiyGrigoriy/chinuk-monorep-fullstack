/**
 * @module CommonSchema
 * Shared validation building blocks and UI-related types.
 */
import { z } from "zod";

/**
 * Standardized Email validation.
 * Used for authentication and data integrity checks.
 */
export const emailSchema = z.string().email("Invalid email address format");

/**
 * Password policy.
 * Enforces a minimum length of 6 characters for development convenience.
 */
export const passwordSchema = z.string()
    .min(6, "Password must be at least 6 characters");

/**
 * Sort directions for table-based views (Customers, Albums, etc.).
 */
export const sortOrderSchema = z.enum(["asc", "desc"]).nullable().optional();
export type SortOrder = z.infer<typeof sortOrderSchema>;

/**
 * Parameters for server-side or client-side sorting logic.
 */
export const sortParamsSchema = z.object({
    sortBy: z.string().nullable().optional(),
    sortOrder: sortOrderSchema,
});

export type SortParams = z.infer<typeof sortParamsSchema>;

/**
 * Professional Pagination structure.
 * Coerces strings to numbers to handle URL query parameters effectively.
 */
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type Pagination = z.infer<typeof paginationSchema>;

/**
 * Generic interface for Select/Dropdown options in the UI.
 * Value can be numeric (DB IDs) or string.
 */
export interface FilterOption {
    readonly label: string;
    readonly value: string | number;
}