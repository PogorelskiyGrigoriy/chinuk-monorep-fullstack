/**
 * @module MusicService
 * Интерфейс для работы с музыкальным каталогом (Альбомы, Плейлисты, Треки).
 */
import { 
  type AlbumWithArtist, 
  type TrackDetail, 
  type Playlist 
} from "@project/shared";

export interface MusicService {
  /** Получить все альбомы с именами артистов (ТЗ 1.2) */
  getAlbums(): Promise<AlbumWithArtist[]>;
  
  /** Получить треки конкретного альбома (ТЗ 1.2.1.3) */
  getAlbumTracks(albumId: number): Promise<TrackDetail[]>;
  
  /** Получить все плейлисты (ТЗ 1.3) */
  getPlaylists(): Promise<Playlist[]>;
  
  /** Получить треки конкретного плейлиста (ТЗ 1.3.1.3) */
  getPlaylistTracks(playlistId: number): Promise<TrackDetail[]>;
  
  /** Получить треки из конкретного инвойса (ТЗ 1.1.1.2.1.1) */
  getInvoiceTracks(invoiceId: number): Promise<TrackDetail[]>;
}