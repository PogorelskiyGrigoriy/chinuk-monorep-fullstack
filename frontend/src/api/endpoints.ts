/**
 * @module ApiEndpoints
 * Централизованная конфигурация путей API.
 * Исключает использование "магических строк" в сервисах и хуках.
 */

export const API_ENDPOINTS = {
  // Аутентификация и профиль (ТЗ 2.4)
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  // Работа с клиентами (ТЗ 1.1)
  CUSTOMERS: {
    BASE: "/customers",
    BY_ID: (id: number) => `/customers/${id}`,
    // Детализация: инвойсы клиента (ТЗ 1.1.1.2.1)
    INVOICES: (id: number) => `/customers/${id}/invoices`,
  },

  // Музыкальный каталог (ТЗ 1.2, 1.3)
  MUSIC: {
    ALBUMS: "/music/albums",
    // Треки альбома (ТЗ 1.2.1.3)
    ALBUM_TRACKS: (id: number) => `/music/albums/${id}/tracks`,
    
    PLAYLISTS: "/music/playlists",
    // Треки плейлиста (ТЗ 1.3.1.3)
    PLAYLIST_TRACKS: (id: number) => `/music/playlists/${id}/tracks`,
    
    // Треки конкретного инвойса (ТЗ 1.1.1.2.1.1)
    INVOICE_TRACKS: (id: number) => `/music/invoices/${id}/tracks`,
  },

  // Сотрудники (Sales Agents) (ТЗ 1.1.1.2.2)
  EMPLOYEES: {
    BY_ID: (id: number) => `/employees/${id}`,
  },

  // Администрирование и аудит (ТЗ 2.2)
  ADMIN: {
    LOGS: "/admin/logs",
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;