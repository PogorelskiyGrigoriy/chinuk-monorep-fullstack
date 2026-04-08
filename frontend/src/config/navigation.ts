/**
 * @module NavigationConfig
 * Централизованный конфиг маршрутов и настроек доступа (RBAC).
 */
import { 
  LuUsers,         // Для клиентов
  LuDisc,          // Для альбомов
  LuMusic,         // Для плейлистов
  LuShieldAlert,   // Для аудита
  LuLayoutDashboard,
  LuLogOut
} from "react-icons/lu";
import type { UserRole } from "@project/shared";

/**
 * Список всех путей приложения (константы для исключения опечаток)
 */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CUSTOMERS: "/customers",
  ALBUMS: "/albums",
  PLAYLISTS: "/playlists",
  AUDIT: "/audit",
} as const;

/**
 * Интерфейс для элемента навигации
 */
export interface NavItemConfig {
  readonly to: string;
  readonly label: string;
  readonly roles: readonly UserRole[];
  readonly icon: React.ElementType;
}

/**
 * Основные ссылки (видимы в боковом меню или шапке)
 */
export const MAIN_NAV_LINKS: readonly NavItemConfig[] = [
  {
    to: ROUTES.CUSTOMERS,
    label: "Клиенты",
    roles: ["SALE", "SUPER_USER"],
    icon: LuUsers
  },
  {
    to: ROUTES.ALBUMS,
    label: "Альбомы",
    roles: ["USER", "SUPER_USER"],
    icon: LuDisc
  },
  {
    to: ROUTES.PLAYLISTS,
    label: "Плейлисты",
    roles: ["USER", "SUPER_USER"],
    icon: LuMusic
  },
];

/**
 * Админские ссылки (видны только SUPER_USER)
 */
export const ADMIN_NAV_LINKS: readonly NavItemConfig[] = [
  {
    to: ROUTES.AUDIT,
    label: "Журнал Аудита",
    roles: ["SUPER_USER"],
    icon: LuShieldAlert
  },
];