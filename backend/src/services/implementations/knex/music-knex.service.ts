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
import { NotFoundError } from '../../../utils/app-errors.js';

export class MusicKnexService implements MusicService {
  
  /**
   * ТЗ 1.2: Получить альбомы с именами артистов
   */
  async getAlbums(): Promise<AlbumWithArtist[]> {
    const rows = await db('album')
      .join('artist', 'album.artist_id', 'artist.artist_id')
      .select(
        'album.*',
        'artist.name as artistName' // Маппим имя артиста
      );
    
    return rows.map(row => AlbumWithArtistSchema.parse(row));
  }

  /**
   * ТЗ 1.2.1.3: Треки конкретного альбома
   */
  async getAlbumTracks(albumId: number): Promise<TrackDetail[]> {
    const rows = await this.getBaseTrackQuery()
      .where('track.album_id', albumId);

    return rows.map(row => TrackDetailSchema.parse(row));
  }

  /**
   * ТЗ 1.3: Получить все плейлисты
   */
  async getPlaylists(): Promise<Playlist[]> {
    const rows = await db('playlist').select('*');
    return rows.map(row => PlaylistSchema.parse(row));
  }

  /**
   * ТЗ 1.3.1.3: Треки конкретного плейлиста
   */
  async getPlaylistTracks(playlistId: number): Promise<TrackDetail[]> {
    const rows = await this.getBaseTrackQuery()
      .join('playlist_track', 'track.track_id', 'playlist_track.track_id')
      .where('playlist_track.playlist_id', playlistId);

    return rows.map(row => TrackDetailSchema.parse(row));
  }

  /**
   * ТЗ 1.1.1.2.1.1: Треки из счета (инвойса)
   */
  async getInvoiceTracks(invoiceId: number): Promise<TrackDetail[]> {
    const rows = await this.getBaseTrackQuery()
      .join('invoice_line', 'track.track_id', 'invoice_line.track_id')
      .where('invoice_line.invoice_id', invoiceId);

    return rows.map(row => TrackDetailSchema.parse(row));
  }

  /**
   * Вспомогательный метод для базового запроса треков (ТЗ 1.1.1.2.1.1)
   * Соединяет треки с жанрами и типами медиа.
   */
  private getBaseTrackQuery() {
    return db('track')
      .join('genre', 'track.genre_id', 'genre.genre_id')
      .join('media_type', 'track.media_type_id', 'media_type.media_type_id')
      .select(
        'track.*',
        'genre.name as genreName',       // Для TrackDetailSchema
        'media_type.name as mediaTypeName' // Для TrackDetailSchema
      );
  }
}