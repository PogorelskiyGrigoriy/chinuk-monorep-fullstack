/**
 * @module AxiosInstance
 * Централизованный API-клиент. 
 * Реализует логику AAA: инъекция токена и строгая обработка 401/403 ошибок.
 */

import axios, { AxiosError } from 'axios';
import { toaster } from 'src/components/chakra-ui/toaster-config';
import { useAuthStore } from 'src/store/auth-store';
import { appRouter } from 'src/router/app-router';
import { ROUTES } from 'src/config/navigation';
import type { ApiErrorResponse } from "@project/shared"; // Наш актуальный путь

export const api = axios.create({
  // Используем относительный путь для работы через Vite Proxy
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor: Инъекция JWT токена
 */
api.interceptors.request.use(
  (config) => {
    // Получаем токен из Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor: Типизированная обработка ошибок
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = error.response?.status;
    const errorData = error.response?.data;

    // СЛУЧАЙ A: Ошибка аутентификации (401 / Сессия протухла)
    if (status === 401 || errorData?.code === 'AUTH_REQUIRED') {
      useAuthStore.getState().logout(); // Сбрасываем стейт
      appRouter.navigate(ROUTES.LOGIN); // Редирект на вход

      toaster.create({
        title: "Сессия истекла",
        description: errorData?.error || "Пожалуйста, войдите снова.",
        type: "error",
      });
      return Promise.reject(error);
    }

    // СЛУЧАЙ B: Ошибка авторизации (403 / Нет прав) - RBAC защита
    if (status === 403 || errorData?.code === 'FORBIDDEN') {
      toaster.create({
        title: "Доступ запрещен", 
        description: errorData?.error || "У вас недостаточно прав для этого действия.",
        type: "error",
      });
      // Accounting: попытка зафиксирована на бэкенде, фронт просто блокирует действие
      return Promise.reject(error);
    }

    // СЛУЧАЙ C: Ресурс не найден (404)
    if (status === 404 || errorData?.code === 'NOT_FOUND') {
      toaster.create({
        title: "Не найдено",
        description: errorData?.error || "Запрошенный ресурс не существует.",
        type: "info",
      });
      return Promise.reject(error);
    }

    // СЛУЧАЙ D: Ошибка валидации (400)
    if (status === 400 || errorData?.code === 'VALIDATION_ERROR') {
      // Пробрасываем для обработки в формах (React Hook Form)
      return Promise.reject(error);
    }

    // СЛУЧАЙ E: Глобальный сбой (500, сеть и т.д.)
    toaster.create({
      title: errorData?.code || "Ошибка системы",
      description: errorData?.error || error.message || "Произошла непредвиденная ошибка.",
      type: "error",
    });

    return Promise.reject(error);
  }
);