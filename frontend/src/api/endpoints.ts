/**
 * @module ApiEndpoints
 * Централизованная конфигурация путей API.
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
    SALES_AGENT: (id: number) => `/customers/${id}/sales-agent`, 
  },

  MUSIC: {
    ALBUMS: "/music/albums",
    ALBUM_TRACKS: (id: number) => `/music/albums/${id}/tracks`,
    
    PLAYLISTS: "/music/playlists",
    PLAYLIST_TRACKS: (id: number) => `/music/playlists/${id}/tracks`,
    
    INVOICE_TRACKS: (id: number) => `/music/invoices/${id}/tracks`,
  },

  ADMIN: {
    LOGS: "/admin/logs",
  },
} as const;