/**
 * @module EntryPoint
 * Main application file. Initializes Express, global middlewares, 
 * API routes, and starts the server.
 */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

import { ENV } from './config/env.js';
import logger from './utils/pino-logger.js';
import { errorMiddleware } from './middleware/error.middleware.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import auditRoutes from './routes/audit.routes.js';
import customerRoutes from './routes/customer.routes.js';
import musicRoutes from './routes/music.routes.js';

/**
 * Security: Rate limiting for authentication attempts.
 * Limits brute-force risks on the login endpoint.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,                 // 5 attempts max
  message: { message: 'Too many login attempts, please try again after 15 minutes' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const app = express();

// --- 1. Global Middlewares ---

// HTTP request logging (Standard dev format)
app.use(morgan('dev'));

// Cross-Origin Resource Sharing (enabled for Frontend access)
app.use(cors());

// Body parsing: JSON support
app.use(express.json());

// Apply rate limiting to security-sensitive routes
app.use('/api/auth/login', loginLimiter);

// --- 2. API Routes ---

/**
 * Domain-specific route mounting.
 * All paths follow the /api prefix for architecture consistency.
 */
app.use('/api/auth', authRoutes);      // Auth & Session
app.use('/api/admin', auditRoutes);    // Administration & Logs
app.use('/api/customers', customerRoutes); // CRM & Invoices
app.use('/api/music', musicRoutes);          // Music Catalog (internal prefixes applied)

// --- 3. Error Handling ---

/**
 * Final defensive layer.
 * MUST be registered after all routes to catch exceptions.
 */
app.use(errorMiddleware);

// --- 4. Server Execution ---

const PORT = ENV.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 Server is running at http://localhost:${PORT}`);
  logger.info(`🔐 Mode: ${ENV.NODE_ENV}`);
  logger.info('📡 API Routes initialized');
});