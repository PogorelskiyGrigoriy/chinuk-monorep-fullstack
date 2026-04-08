/**
 * @module MusicKnexService
 * Data access layer for the music catalog (Albums, Playlists, Tracks).
 * Implements complex joins to provide detailed track information.
 */
import { db } from '../../../infrastructure/db.js';
import { 
  AlbumWithArtistSchema, 
  TrackDetailSchema, 
  PlaylistSchema,
  type AlbumWithArtist, 
  type TrackDetail, 
  type Playlist 
} from '@project/shared';
import { MusicService } from '../../entities.service.js';
import logger from '../../../utils/pino-logger.js';

export class MusicKnexService implements MusicService {
  
  /**
   * Retrieves all albums with their respective artist names.
   */
  async getAlbums(): Promise<AlbumWithArtist[]> {
    const rows = await db('album')
      .join('artist', 'album.artist_id', 'artist.artist_id')
      .select('album.*', 'artist.name as artistName');
    
    return rows.map(row => {
      const res = AlbumWithArtistSchema.safeParse(row);
      if (!res.success) {
        logger.warn({ id: row.albumId }, 'Album data validation failed');
        return row as AlbumWithArtist;
      }
      return res.data;
    });
  }

  /**
   * Retrieves tracks for a specific album.
   */
  async getAlbumTracks(albumId: number): Promise<TrackDetail[]> {
    const rows = await this.getBaseTrackQuery().where('track.album_id', albumId);
    return rows.map(row => this.safeParseTrack(row));
  }

  /**
   * Retrieves all available playlists.
   */
  async getPlaylists(): Promise<Playlist[]> {
    const rows = await db('playlist').select('*');
    return rows.map(row => {
      const res = PlaylistSchema.safeParse(row);
      return res.success ? res.data : (row as Playlist);
    });
  }

  /**
   * Retrieves tracks contained within a specific playlist.
   */
  async getPlaylistTracks(playlistId: number): Promise<TrackDetail[]> {
    const rows = await this.getBaseTrackQuery()
      .join('playlist_track', 'track.track_id', 'playlist_track.track_id')
      .where('playlist_track.playlist_id', playlistId);

    return rows.map(row => this.safeParseTrack(row));
  }

  /**
   * Retrieves tracks associated with a specific invoice.
   */
  async getInvoiceTracks(invoiceId: number): Promise<TrackDetail[]> {
    const rows = await this.getBaseTrackQuery()
      .join('invoice_line', 'track.track_id', 'invoice_line.track_id')
      .where('invoice_line.invoice_id', invoiceId);

    return rows.map(row => this.safeParseTrack(row));
  }

  /**
   * Internal helper for standardized track queries with Genre and Media type joins.
   */
  private getBaseTrackQuery() {
    return db('track')
      .join('genre', 'track.genre_id', 'genre.genre_id')
      .join('media_type', 'track.media_type_id', 'media_type.media_type_id')
      .select(
        'track.*',
        'genre.name as genreName',
        'media_type.name as mediaTypeName'
      );
  }

  /**
   * Internal helper for safe track validation.
   */
  private safeParseTrack(row: any): TrackDetail {
    const res = TrackDetailSchema.safeParse(row);
    if (!res.success) {
      logger.debug({ trackId: row.trackId }, 'Track validation issues detected');
      return row as TrackDetail;
    }
    return res.data;
  }
}