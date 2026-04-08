import { z } from "zod";

/**
 * Валидация Email (обязательна для логина и таблиц)
 */
export const emailSchema = z.email("Invalid email address format");

/**
 * Валидация пароля (минимум 6 символов для нашего Auth In-Memory)
 */
export const passwordSchema = z.string()
    .min(6, "Password must be at least 6 characters");

/**
 * Сортировка: критически важна для таблиц Customers, Albums, Playlists
 */
export const sortOrderSchema = z.enum(["asc", "desc"]).nullable().optional();
export type SortOrder = z.infer<typeof sortOrderSchema>;

export const sortParamsSchema = z.object({
    sortBy: z.string().nullable().optional(),
    sortOrder: sortOrderSchema,
});

export type SortParams = z.infer<typeof sortParamsSchema>;

/**
 * Пагинация (Professional touch): 
 * Даже если в ТЗ не указано прямо, для таблиц это стандарт.
 */
export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type Pagination = z.infer<typeof paginationSchema>;

/**
 * Тип для выпадающих списков (Select/Dropdown) в UI
 */
export interface FilterOption {
    readonly label: string;
    readonly value: string | number; // В Chinook ID часто числа
}