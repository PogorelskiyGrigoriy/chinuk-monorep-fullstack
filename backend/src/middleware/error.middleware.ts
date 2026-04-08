import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-errors.js";
import type { ApiErrorResponse, AppErrorCode } from "@project/shared";
import logger from "../utils/pino-logger.js";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = 500;
  let code: AppErrorCode = 'SERVER_ERROR';
  let message = 'Internal Server Error';
  let details: unknown = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;

    logger.warn({ code, message, path: req.path }, "Operational error caught");
  } 
  else if (err instanceof ZodError) {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
    details = err.issues.map(i => ({ path: i.path, message: i.message }));

    logger.warn({ path: req.path, issues: details }, "Validation error");
  } 
  else {
    logger.error(
      { 
        err: { message: err.message, stack: err.stack }, 
        path: req.path 
      }, 
      "Unhandled system exception"
    );
  }

  const response: ApiErrorResponse = {
    error: message,
    code,
    details,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};