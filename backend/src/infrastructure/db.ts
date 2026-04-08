import knex from 'knex';
import { ENV } from '../config/env.js';

// Инициализация Knex
export const db = knex({
  client: 'pg',
  connection: {
    connectionString: ENV.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Обязательно для Supabase
  },
  // Автоматическая конвертация snake_case (DB) -> camelCase (JS)
  // Мы можем сделать это здесь или вручную в сервисах. 
  // Для начала сделаем вручную в .select(), чтобы ты видел процесс.
});