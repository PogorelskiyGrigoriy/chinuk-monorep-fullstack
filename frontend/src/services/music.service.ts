/**
 * @module MusicService
 * Interface for interacting with the music catalog.
 */
import { 
  type AlbumWithArtist, 
  type TrackDetail, 
  type Playlist,
  type Pagination,
  type SortParams,
  type PaginatedResponse
} from "@project/shared";

export interface MusicService {
  // Retrieves albums with artist info and pagination support
  getAlbums(params?: Pagination & SortParams): Promise<PaginatedResponse<AlbumWithArtist>>;
  
  // Retrieves tracks for a specific album (Req 1.2.1.3)
  getAlbumTracks(albumId: number): Promise<TrackDetail[]>;
  
  // Retrieves all playlists with pagination support
  getPlaylists(params?: Pagination): Promise<PaginatedResponse<Playlist>>;
  
  // Retrieves tracks for a specific playlist
  getPlaylistTracks(playlistId: number): Promise<TrackDetail[]>;
  
  // Retrieves tracks from a specific invoice
  getInvoiceTracks(invoiceId: number): Promise<TrackDetail[]>;
}