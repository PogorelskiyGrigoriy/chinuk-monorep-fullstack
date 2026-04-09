/**
 * @module Router
 * Central routing configuration for Chinook Explorer.
 * Implements nested layouts and strict Role-Based Access Control (RBAC).
 */

import { createBrowserRouter, Navigate } from "react-router-dom";

// Глобальные константы путей (создадим их в следующем шаге)
import { ROUTES } from "src/config/navigation";
import { ProtectedRoute } from "src/components/ProtectedRoute";

// Импорт страниц (используем наши заглушки)
import { LayoutPage } from "@/pages/LayoutPage";
import { LoginPage } from "@/pages/LoginPage";
import { CustomersPage } from "@/pages/CustomersPage";
import { AlbumsPage } from "@/pages/AlbumsPage";
import { PlaylistsPage } from "@/pages/PlaylistsPage";
import { AuditPage } from "@/pages/AuditPage";
import { ErrorPage } from "@/pages/ErrorPage";
import { useAuthStore } from "@/store/auth-store";

const RootRedirect = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role === "SALE") return <Navigate to={ROUTES.CUSTOMERS} replace />;
  return <Navigate to={ROUTES.ALBUMS} replace />;
};

export const appRouter = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      // --- Публичные маршруты ---
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />
      },

      // --- Защищенные маршруты (Требуется логин) ---
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <LayoutPage />
          </ProtectedRoute>
        ),
        children: [
          // Редирект с корня на подходящую страницу по умолчанию
          {            
            index: true,
            element: <RootRedirect />
          },

      // Сектор CRM (Доступ: SALE, SUPER_USER)
      {
        path: ROUTES.CUSTOMERS,
        element: (
          <ProtectedRoute allowedRoles={["SALE", "SUPER_USER"]}>
            <CustomersPage />
          </ProtectedRoute>
        )
      },

      // Музыкальный сектор (Доступ: USER, SUPER_USER)
      {
        path: ROUTES.ALBUMS,
        element: (
          <ProtectedRoute allowedRoles={["USER", "SUPER_USER"]}>
            <AlbumsPage />
          </ProtectedRoute>
        )
      },
      {
        path: ROUTES.PLAYLISTS,
        element: (
          <ProtectedRoute allowedRoles={["USER", "SUPER_USER"]}>
            <PlaylistsPage />
          </ProtectedRoute>
        )
      },

      // Сектор администрирования (Доступ: Только SUPER_USER)
      {
        path: ROUTES.AUDIT,
        element: (
          <ProtectedRoute allowedRoles={["SUPER_USER"]}>
            <AuditPage />
          </ProtectedRoute>
        )
      },
    ],
  },
],
  },
]);