import { Router } from "express";
import { MusicController } from "../controllers/music.controller.js";
import { services } from "../services/service.factory.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { auditRead } from "../middleware/audit.middleware.js";

const router = Router();

/**
 * Инициализируем контроллер через фабрику.
 */
const musicController = new MusicController(services.music);

/**
 * Гварды для разных типов контента (ТЗ 2.5.2 - 2.5.3)
 */
const userGuard = [protect, authorize("USER", "SUPER_USER")];
const saleGuard = [protect, authorize("SALE", "SUPER_USER")];

/**
 * --- АЛЬБОМЫ (ТЗ 1.2) ---
 */
router.get(
  "/albums", 
  ...userGuard, 
  auditRead("Albums List"), 
  musicController.getAlbums
);

router.get(
  "/albums/:id/tracks", 
  ...userGuard, 
  auditRead("Album Tracks"), 
  musicController.getAlbumTracks
);

/**
 * --- ПЛЕЙЛИСТЫ (ТЗ 1.3) ---
 */
router.get(
  "/playlists", 
  ...userGuard, 
  auditRead("Playlists List"), 
  musicController.getPlaylists
);

router.get(
  "/playlists/:id/tracks", 
  ...userGuard, 
  auditRead("Playlist Tracks"), 
  musicController.getPlaylistTracks
);

/**
 * --- ТРЕКИ ИНВОЙСОВ (ТЗ 1.1.1.2.1.1) ---
 * Доступно для SALE, так как это часть просмотра данных клиента.
 */
router.get(
  "/invoices/:id/tracks", 
  ...saleGuard, 
  auditRead("Invoice Tracks"), 
  musicController.getInvoiceTracks
);

export default router;