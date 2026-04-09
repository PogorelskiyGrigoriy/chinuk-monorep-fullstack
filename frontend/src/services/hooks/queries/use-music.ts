import { useQuery } from "@tanstack/react-query";
import { musicService } from "@/services/music.implementation";
import { type Pagination, type SortParams } from "@project/shared";

/** Список альбомов с пагинацией (ТЗ 1.2) */
export const useAlbums = (params: Pagination & SortParams) => {
  return useQuery({
    queryKey: ["albums", params],
    queryFn: () => musicService.getAlbums(params),
    staleTime: 1000 * 60 * 10, // Альбомы меняются редко
  });
};

/** Список плейлистов (ТЗ 1.3) */
export const usePlaylists = () => {
  return useQuery({
    queryKey: ["playlists"],
    queryFn: () => musicService.getPlaylists(),
    staleTime: 1000 * 60 * 30,
  });
};

/**
 * Универсальный хук для треков (ТЗ 1.1.1, 1.2.1, 1.3.1)
 * Автоматически выбирает нужный метод сервиса в зависимости от контекста
 */
export const useTracks = (type: "album" | "playlist" | "invoice", id: number | null) => {
  return useQuery({
    queryKey: ["tracks", type, id],
    queryFn: () => {
      if (type === "album") return musicService.getAlbumTracks(id!);
      if (type === "playlist") return musicService.getPlaylistTracks(id!);
      return musicService.getInvoiceTracks(id!);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};