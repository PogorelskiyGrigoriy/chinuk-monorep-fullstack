import 'dotenv/config';
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import pino from 'pino';
import { PinoHttp } from 'pino-http';

// 1. Инициализация базового логгера (для системных сообщений)
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' 
    ? { target: 'pino-pretty', options: { colorize: true } } 
    : undefined,
});

const app: Express = express();
const port = process.env.PORT || 3000;

// 2. Middleware
app.use(cors()); // В будущем ограничь доступ конкретными доменами через { origin: '...' }
app.use(express.json());

// 3. Подключение pino-http для логирования запросов
app.use(pinoHttp({ 
  logger,
  // Настройка: не логировать стандартные проверки жизнеспособности (Health Checks)
  autoLogging: {
    ignore: (req) => req.url === '/health',
  },
}));

// 4. Health Check (Публичный роут)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 5. Заглушки для твоих роутеров из ТЗ
// TODO: app.use('/api/customers', customersRouter);
// TODO: app.use('/api/albums', albumsRouter);
// TODO: app.use('/api/playlists', playlistsRouter);

// 6. Запуск сервера
const server = app.listen(port, () => {
  logger.info(`🚀 Chinook Explorer API is running on http://localhost:${port}`);
});

// 7. Graceful Shutdown (Завершение работы без потери данных)
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});