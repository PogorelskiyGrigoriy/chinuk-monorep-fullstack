/**
 * @module EntryPoint
 * Главная точка входа приложения.
 * Здесь собираются все провайдеры: Query (данные), Chakra (UI), Initializer (сессия) и Router.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

// Провайдеры и компоненты UI
import { Provider as ChakraProvider } from "src/components/chakra-ui/provider";
import { Toaster } from './components/chakra-ui/toaster';

// Конфигурация приложения
import { appRouter } from "./router/app-router";
import { AppInitializer } from "./components/auth/AppInitializer";

// Глобальные стили (включая Tailwind, если используется)
import './index.css';

/**
 * Настройка TanStack Query.
 * Мы отключаем автоматическое обновление при смене окна, чтобы не спамить бэкенд.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Не перезапрашивать при возврате в браузер
      retry: 1,                   // Одна попытка при ошибке сети
      staleTime: 1000 * 60 * 5,    // Данные считаются свежими 5 минут
    },
  },
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Не удалось найти элемент #root. Проверьте index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    {/* 1. Слой кэширования данных */}
    <QueryClientProvider client={queryClient}>
      
      {/* 2. Слой интерфейса и стилей */}
      <ChakraProvider> 
        
        {/* 3. Слой восстановления сессии (проверка токена) */}
        <AppInitializer>
          
          {/* 4. Слой навигации (управляет страницами) */}
          <RouterProvider router={appRouter} />
          
        </AppInitializer>
        
        {/* Компонент для системных уведомлений (вызывается из axios) */}
        <Toaster /> 
        
      </ChakraProvider>
      
    </QueryClientProvider>
  </StrictMode>
);