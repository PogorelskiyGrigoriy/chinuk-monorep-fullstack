import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import logger from './utils/pino-logger.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { rateLimit } from 'express-rate-limit';

// Импорт роутов
import authRoutes from './routes/auth.routes.js';
import auditRoutes from './routes/audit.routes.js';
import customerRoutes from './routes/customer.routes.js';
import musicRoutes from './routes/music.routes.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  limit: 5, // Максимум 5 попыток логина
  message: { message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const app = express();

// --- 1. Глобальные Middleware ---

// ТЗ 2.3.2: Morgan для логирования HTTP-запросов
// Используем формат 'dev' для удобного чтения в консоли
app.use(morgan('dev'));

// Разрешаем кросс-доменные запросы для фронтенда
app.use(cors());

// Парсинг JSON в теле запроса
app.use(express.json());

// Защита (Rate Limiting)
app.use('/api/auth/login', loginLimiter);

// --- 2. Подключение роутов (API) ---

/**
 * Все пути будут начинаться с /api для чистоты архитектуры
 */
app.use('/api/auth', authRoutes);     // Авторизация (/login, /me)
app.use('/api/admin', auditRoutes);   // Админка и логи (/logs)
app.use('/api/customers', customerRoutes); // Клиенты и инвойсы

/**
 * Музыкальные роуты (albums, playlists) подключаем к корню /api,
 * так как пути внутри music.routes.ts уже содержат свои префиксы.
 */
app.use('/api', musicRoutes);

// --- 3. Обработка ошибок ---

/**
 * ВАЖНО: errorMiddleware должен быть самым последним,
 * чтобы ловить ошибки со всех роутов выше.
 */
app.use(errorMiddleware);

// --- 4. Запуск сервера ---

const PORT = ENV.PORT || 5000;

app.listen(PORT, () => {
  // ТЗ 2.3.1: Используем Pino для системного лога
  logger.info(`🚀 Server is running at http://localhost:${PORT}`);
  logger.info(`🔐 Mode: ${ENV.NODE_ENV}`);
});