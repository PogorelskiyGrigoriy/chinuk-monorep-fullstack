/**
 * @module useLogout
 * Хук для управления процессом выхода из системы.
 * Инкапсулирует вызов API, очистку стора и навигацию.
 */
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.implementation";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/config/navigation";

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);

  const logout = async () => {
    try {
      // 1. Пытаемся уведомить бэкенд
      await authService.logout();
    } catch (error) {
      console.error("Ошибка при уведомлении бэкенда о выходе:", error);
    } finally {
      // 2. В любом случае очищаем локальные данные
      logoutStore();
      
      // 3. Отправляем пользователя на страницу входа
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return { logout };
};