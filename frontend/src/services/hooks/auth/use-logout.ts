/**
 * @module useLogout
 * Улучшенная версия с очисткой кэша TanStack Query.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.implementation";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/config/navigation";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((state) => state.logout);

  const mutation = useMutation({
    mutationFn: () => authService.logout(),
    // Используем onSettled, чтобы выполнить очистку ДАЖЕ если запрос к API упал
    onSettled: () => {
      // 1. Очищаем глобальный стейт Zustand
      logoutStore();
      
      // 2. КРИТИЧНО: Полностью стираем кэш TanStack Query (все данные из всех таблиц)
      queryClient.clear();
      
      // 3. Редирект на логин
      navigate(ROUTES.LOGIN, { replace: true });
    }
  });

  return { 
    logout: mutation.mutate,
    isPending: mutation.isPending 
  };
};