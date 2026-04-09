/**
 * @module ErrorHelpers
 * Утилиты для форматирования ошибок валидации (Zod) и ответов API.
 * Исправленная версия с защитой от пустых значений (null-safe).
 */
import { ZodError } from "zod";
import { isRouteErrorResponse } from "react-router-dom";
import axios from "axios";
// Импортируем типы из нашего общего пакета
import type { ApiErrorResponse, ValidationErrorDetail } from "@project/shared";

/**
 * Преобразует ошибки валидации (от Zod или Бэкенда) в плоский массив строк.
 */
export const formatValidationErrors = (
  error: ZodError | ValidationErrorDetail[] | null | undefined
): string[] => {
  if (!error) return [];
  
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
  error: ZodError | ValidationErrorDetail[] | null | undefined
): string => formatValidationErrors(error).join(" | ");

/**
 * Универсальный парсер ошибок. 
 * Разбирает ошибки роутера, запросов Axios и обычные JS-ошибки.
 */
export const getErrorData = (error: unknown) => {
  // 1. ЗАЩИТА: Если ошибка отсутствует (null/undefined), возвращаем нейтральное состояние
  if (!error) {
    return {
      status: null,
      title: "",
      desc: "",
      debug: null,
      validation: null
    };
  }

  // 2. Ошибки React Router (например, при загрузке данных в loader)
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      title: error.status === 404 ? "Страница не найдена" : "Ошибка навигации",
      desc: error.statusText || "Произошла ошибка при переходе по адресу.",
      debug: JSON.stringify(error.data),
      validation: null
    };
  }

  // 3. Ошибки API (Axios)
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    
    // Ошибка сети (сервер не ответил)
    if (!error.response) {
      return {
        status: "Network",
        title: "Соединение разорвано",
        desc: "Не удалось связаться с сервером. Проверьте интернет.",
        debug: error.message,
        validation: null
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
      validation: data?.code === "VALIDATION_ERROR" ? (data.details as ValidationErrorDetail[]) : null
    };
  }

  // 4. Прочие ошибки приложения (JS Errors)
  // Используем проверку типа перед обращением к свойствам
  if (error instanceof Error) {
    return { 
      status: "App", 
      title: "Внутренняя ошибка", 
      desc: error.message, 
      debug: error.stack,
      validation: null
    };
  }

  // 5. Совсем крайний случай (если бросили строку или что-то странное)
  return {
    status: "Unknown",
    title: "Непредвиденная ошибка",
    desc: String(error),
    debug: null,
    validation: null
  };
};