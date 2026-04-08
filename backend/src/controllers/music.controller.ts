/**
 * @module MusicController
 * Controller for managing music-related API requests.
 */
import type { Request, Response, NextFunction } from 'express';
import { type MusicService } from '../services/entities.service.js';

export class MusicController {
  constructor(private musicService: MusicService) {}

  /**
   * GET /api/albums - Returns all albums.
   */
  getAlbums = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const albums = await this.musicService.getAlbums();
      res.json(albums);
    } catch (e) {
      next(e);
    }
  };

  /**
   * GET /api/albums/:id/tracks - Returns tracks for a specific album.
   */
  getAlbumTracks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const albumId = Number(req.params.id);
      const tracks = await this.musicService.getAlbumTracks(albumId);
      res.json(tracks);
    } catch (e) {
      next(e);
    }
  };

  /**
   * GET /api/playlists - Returns all playlists.
   */
  getPlaylists = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const playlists = await this.musicService.getPlaylists();
      res.json(playlists);
    } catch (e) {
      next(e);
    }
  };

  /**
   * GET /api/playlists/:id/tracks - Returns tracks for a specific playlist.
   */
  getPlaylistTracks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playlistId = Number(req.params.id);
      const tracks = await this.musicService.getPlaylistTracks(playlistId);
      res.json(tracks);
    } catch (e) {
      next(e);
    }
  };

  /**
   * GET /api/invoices/:id/tracks - Returns items from a specific invoice.
   */
  getInvoiceTracks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoiceId = Number(req.params.id);
      const tracks = await this.musicService.getInvoiceTracks(invoiceId);
      res.json(tracks);
    } catch (e) {
      next(e);
    }
  };
}