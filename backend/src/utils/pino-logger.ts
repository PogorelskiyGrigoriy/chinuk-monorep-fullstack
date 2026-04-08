/**
 * @module PinoLogger
 * Centralized logging system using Pino.
 * Supports console output (pretty-printed for dev) and file rotation for production.
 */
import pino from "pino";
import fs from "node:fs";
import pretty from "pino-pretty";

// Constants for log storage
const LOGS_DIR = "./logs";
const COMBINED_LOG = `${LOGS_DIR}/combined.log`;
const ERRORS_LOG = `${LOGS_DIR}/errors.log`;

// Ensure logs directory exists at startup
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * Console formatter configuration.
 * Optimized for readability during development.
 */
const prettyStream = pretty({
  colorize: true,
  translateTime: 'SYS:standard',
  ignore: 'pid,hostname', // Hide unnecessary metadata
  singleLine: false,      // Expanded objects for better debugging
});

/**
 * Multi-stream configuration:
 * 1. Console: Formatted text.
 * 2. Combined: Raw JSON for all events (info level and above).
 * 3. Errors: Dedicated file for tracking critical failures.
 */
const streams: pino.StreamEntry[] = [
  { 
    level: (process.env.LOG_LEVEL as pino.Level) || 'info', 
    stream: prettyStream 
  },
  { 
    level: 'info', 
    stream: pino.destination({ dest: COMBINED_LOG, sync: true }) 
  },
  { 
    level: 'error', 
    stream: pino.destination({ dest: ERRORS_LOG, sync: true }) 
  }
];

/**
 * Logger instance.
 * Automatically switches behavior based on the current NODE_ENV.
 */
const logger = pino(
  {
    level: (process.env.LOG_LEVEL as pino.Level) || 'info',
    base: process.env.NODE_ENV === 'production' ? undefined : { env: process.env.NODE_ENV },
  },
  pino.multistream(streams)
);

export default logger;