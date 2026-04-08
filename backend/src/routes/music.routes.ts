/**
 * @module MusicRoutes
 * Routes for music catalog exploration.
 * Access is controlled by role-based guards (USER, SALE, SUPER_USER).
 */
import { Router } from "express";
import { MusicController } from "../controllers/music.controller.js";
import { services } from "../services/service.factory.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { auditRead } from "../middleware/audit.middleware.js";

const router = Router();
const musicController = new MusicController(services.music);

// Guards for different user roles
const userGuard = [protect, authorize("USER", "SUPER_USER")];
const saleGuard = [protect, authorize("SALE", "SUPER_USER")];

// --- Albums ---
router.get("/albums", ...userGuard, auditRead("Albums List"), musicController.getAlbums);
router.get("/albums/:id/tracks", ...userGuard, auditRead("Album Tracks"), musicController.getAlbumTracks);

// --- Playlists ---
router.get("/playlists", ...userGuard, auditRead("Playlists List"), musicController.getPlaylists);
router.get("/playlists/:id/tracks", ...userGuard, auditRead("Playlist Tracks"), musicController.getPlaylistTracks);

// --- Invoice Content ---
// Accessible to SALE role as part of customer data review
router.get("/invoices/:id/tracks", ...saleGuard, auditRead("Invoice Tracks"), musicController.getInvoiceTracks);

export default router;