/**
 * @module ErrorHelpers
 * Утилиты для форматирования ошибок валидации (Zod) и ответов API.
 */
import { ZodError } from "zod";
import { isRouteErrorResponse } from "react-router-dom";
import axios from "axios";
// Импортируем типы из нашего общего пакета
import type { ApiErrorResponse, ValidationErrorDetail } from "@project/shared";

/**
 * Преобразует ошибки валидации (от Zod или Бэкенда) в плоский массив строк.
 * Полезно для вывода списка ошибок под полями формы.
 */
export const formatValidationErrors = (
  error: ZodError | ValidationErrorDetail[]
): string[] => {
  const issues = error instanceof ZodError ? error.issues : error;

  return issues.map(({ path, message }) => {
    const pathString = path.length > 0 ? path.join(".") : "поле";
    return `${pathString}: ${message}`;
  });
};

/**
 * Объединяет ошибки валидации в одну строку для кратких уведомлений (Toasts).
 */
export const formatValidationErrorsToString = (
  error: ZodError | ValidationErrorDetail[]
): string => formatValidationErrors(error).join(" | ");

/**
 * Универсальный парсер ошибок. 
 * Разбирает ошибки роутера, запросов Axios и обычные JS-ошибки.
 */
export const getErrorData = (error: unknown) => {
  // 1. Ошибки React Router (например, при загрузке данных в loader)
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      title: error.status === 404 ? "Страница не найдена" : "Ошибка навигации",
      desc: error.statusText || "Произошла ошибка при переходе по адресу.",
      debug: JSON.stringify(error.data)
    };
  }

  // 2. Ошибки API (Axios)
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    
    // Ошибка сети (сервер не ответил)
    if (!error.response) {
      return {
        status: "Network",
        title: "Соединение разорвано",
        desc: "Не удалось связаться с сервером. Проверьте интернет.",
        debug: error.message
      };
    }

    // Типизированная ошибка от нашего бэкенда
    return {
      status: error.response.status,
      title: data?.code || "Ошибка сервера",
      desc: data?.error || error.message,
      debug: JSON.stringify({ 
        code: data?.code, 
        ts: data?.timestamp, 
        url: error.config?.url 
      }, null, 2),
      // Извлекаем детали валидации, если они есть
      validation: data?.code === "VALIDATION_ERROR" ? (data.details as ValidationErrorDetail[]) : null
    };
  }

  // 3. Прочие ошибки приложения
  const err = error as Error;
  return { 
    status: "App", 
    title: "Внутренняя ошибка", 
    desc: err.message, 
    debug: err.stack 
  };
};