/**
 * @module ApiEndpoints
 * Централизованная конфигурация путей API.
 * Исправлено: маршруты синхронизированы с Express-роутами бэкенда.
 */

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  CUSTOMERS: {
    BASE: "/customers",
    BY_ID: (id: number) => `/customers/${id}`,
    INVOICES: (id: number) => `/customers/${id}/invoices`,
    // Исправлено: соответствует backend/src/routes/customer.routes.ts
    SALES_AGENT: (id: number) => `/customers/${id}/sales-agent`, 
  },

  MUSIC: {
    ALBUMS: "/music/albums",
    ALBUM_TRACKS: (id: number) => `/music/albums/${id}/tracks`,
    
    PLAYLISTS: "/music/playlists",
    PLAYLIST_TRACKS: (id: number) => `/music/playlists/${id}/tracks`,
    
    // Соответствует backend/src/routes/music.routes.ts
    INVOICE_TRACKS: (id: number) => `/music/invoices/${id}/tracks`,
  },

  ADMIN: {
    // Соответствует backend/src/routes/audit.routes.ts (предполагаем префикс /admin)
    LOGS: "/admin/logs",
  },
} as const;