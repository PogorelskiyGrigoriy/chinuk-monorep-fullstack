/**
 * @module MusicServiceRest
 */
import { api } from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { 
  AlbumWithArtistSchema, 
  TrackDetailSchema, 
  PlaylistSchema,
  type AlbumWithArtist, 
  type TrackDetail, 
  type Playlist,
  type Pagination,
  type SortParams
} from "@project/shared";
import type { MusicService } from "./music.service";

class MusicServiceRest implements MusicService {
  
  async getAlbums(params?: Pagination & SortParams): Promise<AlbumWithArtist[]> {
    const { data } = await api.get<AlbumWithArtist[]>(API_ENDPOINTS.MUSIC.ALBUMS, { params });
    return data.map(item => AlbumWithArtistSchema.parse(item));
  }

  async getAlbumTracks(albumId: number): Promise<TrackDetail[]> {
    const { data } = await api.get<TrackDetail[]>(API_ENDPOINTS.MUSIC.ALBUM_TRACKS(albumId));
    return data.map(item => TrackDetailSchema.parse(item));
  }

  async getPlaylists(): Promise<Playlist[]> {
    const { data } = await api.get<Playlist[]>(API_ENDPOINTS.MUSIC.PLAYLISTS);
    return data.map(item => PlaylistSchema.parse(item));
  }

  async getPlaylistTracks(playlistId: number): Promise<TrackDetail[]> {
    const { data } = await api.get<TrackDetail[]>(API_ENDPOINTS.MUSIC.PLAYLIST_TRACKS(playlistId));
    return data.map(item => TrackDetailSchema.parse(item));
  }

  async getInvoiceTracks(invoiceId: number): Promise<TrackDetail[]> {
    const { data } = await api.get<TrackDetail[]>(API_ENDPOINTS.MUSIC.INVOICE_TRACKS(invoiceId));
    return data.map(item => TrackDetailSchema.parse(item));
  }
}

export const musicService: MusicService = new MusicServiceRest();