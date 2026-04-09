/**
 * @module RBACGuard
 * Компонент-предохранитель. Рендерит дочерние элементы только если
 * роль пользователя совпадает с разрешенными.
 */
import React from "react";
import { useAuthStore } from "@/store/auth-store";
import { type UserRole } from "@project/shared";

interface RBACGuardProps {
  /** Массив ролей, которым разрешен доступ */
  allowedRoles: readonly UserRole[]; 
  /** Контент для отображения */
  children: React.ReactNode;
  /** Что показать, если доступа нет (по умолчанию ничего) */
  fallback?: React.ReactNode;
}

export const RBACGuard = ({ allowedRoles, children, fallback = null }: RBACGuardProps) => {
  // Вытаскиваем текущую роль из нашего Zustand-стора
  const user = useAuthStore((state) => state.user);
  
  const hasAccess = user && allowedRoles.includes(user.role);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};