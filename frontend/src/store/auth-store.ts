/**
 * @module useAuthStore
 * Глобальное управление состоянием аутентификации.
 * Использует persist для синхронизации с localStorage.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User } from '@project/shared'; // Используем наш актуальный тип

interface AuthState {
  user: User | null;
  token: string | null;
  isInitialized: boolean;
  
  // Действия
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setInitialized: (val: boolean) => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isInitialized: false,

      // Установка данных при входе
      setAuth: (user, token) => set({ 
        user, 
        token, 
        isInitialized: true 
      }),

      // Очистка при выходе
      logout: () => set({ 
        user: null, 
        token: null, 
        isInitialized: true 
      }),

      setInitialized: (isInitialized) => set({ isInitialized }),

      updateUser: (newData) => set((state) => ({
        user: state.user ? { ...state.user, ...newData } : null
      })),
    }),
    { 
      name: 'chinook-auth-storage', // Уникальное имя для localStorage
      // Частичное сохранение: храним и юзера, и токен
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);

/**
 * СЕЛЕКТОРЫ (Для оптимизации рендеринга)
 */

// Проверка: залогинен ли пользователь
export const useIsAuthenticated = () => useAuthStore((state) => !!state.token);

// Получение роли (SALE, USER, SUPER_USER) для RBAC
export const useUserRole = () => useAuthStore((state) => state.user?.role);

// Получение данных самого пользователя
export const useCurrentUser = () => useAuthStore((state) => state.user);