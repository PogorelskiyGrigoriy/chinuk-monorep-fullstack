/**
 * @module MusicQueries
 * TanStack Query hooks for music catalog data.
 * Supports paginated albums and playlists, and contextual track lists.
 */
import { useQuery } from "@tanstack/react-query";
import { musicService } from "@/services/music.implementation";
import { type Pagination, type SortParams } from "@project/shared";

/** * Fetches paginated list of albums (Requirement 1.2).
 * queryKey includes params to ensure automatic refetch on page change.
 */
export const useAlbums = (params: Pagination & SortParams) => {
  return useQuery({
    queryKey: ["music", "albums", params],
    queryFn: () => musicService.getAlbums(params),
    staleTime: 1000 * 60 * 10, // Albums data is relatively static
  });
};

/** * Fetches paginated list of playlists (Requirement 1.3).
 * UPDATED: Now accepts pagination params and includes them in queryKey.
 */
export const usePlaylists = (params: Pagination) => {
  return useQuery({
    queryKey: ["music", "playlists", params],
    queryFn: () => musicService.getPlaylists(params),
    staleTime: 1000 * 60 * 30, // Playlists change very rarely
  });
};

/**
 * Universal hook for track lists (Requirements 1.1.1, 1.2.1, 1.3.1).
 * Routes to specific service methods based on the source type.
 */
export const useTracks = (type: "album" | "playlist" | "invoice", id: number | null) => {
  return useQuery({
    queryKey: ["music", "tracks", type, id],
    queryFn: () => {
      if (type === "album") return musicService.getAlbumTracks(id!);
      if (type === "playlist") return musicService.getPlaylistTracks(id!);
      return musicService.getInvoiceTracks(id!);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};