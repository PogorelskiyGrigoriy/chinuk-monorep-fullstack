/**
 * @module MusicController
 * Handles requests for albums, playlists, and track details.
 */
import type { Request, Response, NextFunction } from 'express';
import { type MusicService } from '../services/entities.service.js';
import { NotFoundError } from '../utils/app-errors.js';

export class MusicController {
  /**
   * Зависит от MusicService (реализация MusicKnexService).
   */
  constructor(private musicService: MusicService) {}

  /**
   * ТЗ 1.2: Список всех альбомов с именами артистов.
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
   * ТЗ 1.2.1.3: Список треков конкретного альбома.
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
   * ТЗ 1.3: Список всех плейлистов.
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
   * ТЗ 1.3.1.3: Список треков конкретного плейлиста.
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
   * ТЗ 1.1.1.2.1.1: Список треков для конкретного счета (инвойса).
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