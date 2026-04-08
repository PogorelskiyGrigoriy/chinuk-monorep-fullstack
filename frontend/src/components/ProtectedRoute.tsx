/**
 * @module ProtectedRoute
 * Защитник маршрутов для Chinook Explorer.
 * Обеспечивает безопасность на уровне страниц: проверяет наличие токена и соответствие роли.
 */

import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore, useIsAuthenticated } from "src/store/auth-store";
import { ROUTES } from "src/config/navigation";
import type { UserRole } from "@project/shared"; // Обновленный путь к типам

interface ProtectedRouteProps {
  children: React.ReactNode;
  readonly allowedRoles?: readonly UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthStore((state) => state.user);

  /**
   * 1. Проверка Аутентификации
   * Если токена нет, отправляем на страницу логина.
   * Сохраняем текущий путь в 'state.from', чтобы вернуть юзера сюда после входа.
   */
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={ROUTES.LOGIN} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  /**
   * 2. Проверка Авторизации (Роли)
   * Если маршрут требует определенных ролей, проверяем уровень доступа пользователя.
   */
  const hasAccess = !allowedRoles || (user && allowedRoles.includes(user.role));

  if (!hasAccess) {
    /**
     * Если юзер вошел, но пытается зайти туда, куда ему нельзя (например, SALE лезет в музыку),
     * отправляем его на главную страницу.
     */
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // 3. Все проверки пройдены: рендерим контент страницы
  return <>{children}</>;
};