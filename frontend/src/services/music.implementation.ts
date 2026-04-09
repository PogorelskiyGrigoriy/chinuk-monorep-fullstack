/**
 * @module MusicServiceRest
 * REST implementation of the MusicService using Axios and Zod validation.
 */
import { api } from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { 
  AlbumWithArtistSchema, 
  TrackDetailSchema, 
  PlaylistSchema,
  createPaginatedResponseSchema,
  type AlbumWithArtist, 
  type TrackDetail, 
  type Playlist,
  type Pagination,
  type SortParams,
  type PaginatedResponse
} from "@project/shared";
import type { MusicService } from "./music.service";

class MusicServiceRest implements MusicService {
  
  /**
   * Fetches paginated albums.
   */
  async getAlbums(params?: Pagination & SortParams): Promise<PaginatedResponse<AlbumWithArtist>> {
    const { data } = await api.get<PaginatedResponse<AlbumWithArtist>>(
      API_ENDPOINTS.MUSIC.ALBUMS, 
      { params }
    );
    
    const schema = createPaginatedResponseSchema(AlbumWithArtistSchema);
    const result = schema.safeParse(data);
    
    if (!result.success) {
      console.error("❌ Music (Albums) Pagination Validation Error:", result.error.format());
      return data;
    }
    return result.data;
  }

  /**
   * Fetches tracks for a specific album. No pagination required per current specs.
   */
  async getAlbumTracks(albumId: number): Promise<TrackDetail[]> {
    const { data } = await api.get<TrackDetail[]>(API_ENDPOINTS.MUSIC.ALBUM_TRACKS(albumId));
    // Using safeParse for each item for resilience
    return data.map(item => {
      const res = TrackDetailSchema.safeParse(item);
      return res.success ? res.data : (item as TrackDetail);
    });
  }

  /**
   * Fetches paginated playlists.
   */
  async getPlaylists(params?: Pagination): Promise<PaginatedResponse<Playlist>> {
    const { data } = await api.get<PaginatedResponse<Playlist>>(
      API_ENDPOINTS.MUSIC.PLAYLISTS, 
      { params }
    );
    
    const schema = createPaginatedResponseSchema(PlaylistSchema);
    const result = schema.safeParse(data);

    if (!result.success) {
      console.error("❌ Music (Playlists) Pagination Validation Error:", result.error.format());
      return data;
    }
    return result.data;
  }

  async getPlaylistTracks(playlistId: number): Promise<TrackDetail[]> {
    const { data } = await api.get<TrackDetail[]>(API_ENDPOINTS.MUSIC.PLAYLIST_TRACKS(playlistId));
    return data.map(item => {
      const res = TrackDetailSchema.safeParse(item);
      return res.success ? res.data : (item as TrackDetail);
    });
  }

  async getInvoiceTracks(invoiceId: number): Promise<TrackDetail[]> {
    const { data } = await api.get<TrackDetail[]>(API_ENDPOINTS.MUSIC.INVOICE_TRACKS(invoiceId));
    return data.map(item => {
      const res = TrackDetailSchema.safeParse(item);
      return res.success ? res.data : (item as TrackDetail);
    });
  }
}

export const musicService: MusicService = new MusicServiceRest();