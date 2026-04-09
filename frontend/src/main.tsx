/**
 * @module EntryPoint
 * Главная точка входа приложения Chinook Explorer.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";

// Провайдеры и компоненты UI
import { Provider as ChakraProvider } from "@/components/chakra-ui/provider";
import { Toaster } from './components/chakra-ui/toaster';

// Конфигурация приложения
import { appRouter } from "./router/app-router";
import { AppInitializer } from "./components/auth/AppInitializer";

/**
 * Инициализация QueryClient.
 * Оптимизировано под CRM: данные живут 5 минут, 
 * лишние перезапросы при потере фокуса отключены.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Не спамим бэкенд при переключении вкладок
      retry: 1,                   // Одна попытка при сбое сети
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
    {/* 1. Слой данных: TanStack Query */}
    <QueryClientProvider client={queryClient}>
      
      {/* 2. Слой интерфейса: Chakra UI */}
      <ChakraProvider> 
        
        {/* 3. Слой логики сессии: Проверяет токен перед запуском приложения */}
        <AppInitializer>
          
          {/* 4. Слой навигации: React Router */}
          <RouterProvider router={appRouter} />
          
        </AppInitializer>
        
        {/* Глобальные уведомления */}
        <Toaster /> 
        
      </ChakraProvider>

      {/* Инструменты разработчика (автоматически скрываются в продакшене) */}
      <ReactQueryDevtools initialIsOpen={false} />
      
    </QueryClientProvider>
  </StrictMode>
);