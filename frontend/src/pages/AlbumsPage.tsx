/**
 * @module AlbumsPage
 * Страница музыкальных альбомов (ТЗ 1.2).
 * Роли: USER, SUPER_USER.
 */
import { useState } from "react";
import { Heading, VStack, useDisclosure } from "@chakra-ui/react";
import { LuListMusic } from "react-icons/lu";

import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper";
import { AppTable, type AppTableColumn } from "@/components/shared/organisms/AppTable";
import { AdaptiveDialog } from "@/components/shared/molecules/AdaptiveDialog";
import { TrackListTable } from "@/components/shared/organisms/TrackListTable";
import { ActionIconButton } from "@/components/shared/atoms/ActionIconButton";

import { useAlbums, useTracks } from "@/services/hooks/queries/use-music";
import { type AlbumWithArtist } from "@project/shared";

export const AlbumsPage = () => {
  // 1. Состояние данных и пагинации
  const [params] = useState({ page: 1, limit: 12 });
  const { data: albums, isLoading, isError, refetch } = useAlbums(params);

  // 2. Состояние модального окна
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithArtist | null>(null);

  // 3. Конфигурация колонок (ТЗ 1.2.1.1 - 1.2.1.3)
  const columns: AppTableColumn<AlbumWithArtist>[] = [
    { 
      header: "Альбом", 
      accessor: "title", 
      isPriority: true // Видно на мобилках
    },
    { 
      header: "Артист", 
      accessor: "artistName", 
      isPriority: true 
    },
    {
      header: "Действия",
      accessor: (album) => (
        <ActionIconButton 
          icon={LuListMusic} 
          label="Details" 
          onClick={() => handleOpenTracks(album)} 
        />
      ),
    },
  ];

  // 4. Обработчики
  const handleOpenTracks = (album: AlbumWithArtist) => {
    setSelectedAlbum(album);
    onOpen();
  };

  return (
    <VStack gap={6} align="stretch" w="full">
      <Heading size="xl" fontWeight="black" letterSpacing="tight">
        ALBUMS
      </Heading>

      <AppPanel>
        <DataStateWrapper 
          isLoading={isLoading} 
          isError={isError} 
          isEmpty={albums?.length === 0}
          onRetry={refetch}
        >
          <AppTable 
            data={albums || []} 
            columns={columns} 
            keyExtractor={(a) => a.albumId}
            onDetailClick={handleOpenTracks} // Мобильный тап по карточке
          />
        </DataStateWrapper>
      </AppPanel>

      {/* Модальное окно №4: Список треков альбома */}
      <AdaptiveDialog 
        isOpen={open} 
        onClose={onClose} 
        title={selectedAlbum ? `Tracks: ${selectedAlbum.title}` : "Tracks"}
        size="lg"
      >
        {selectedAlbum && (
          <AlbumTracksView albumId={selectedAlbum.albumId} />
        )}
      </AdaptiveDialog>
    </VStack>
  );
};

/**
 * Вспомогательный компонент для загрузки треков альбома.
 * Вынесен отдельно для корректной работы хуков.
 */
const AlbumTracksView = ({ albumId }: { albumId: number }) => {
  const { data, isLoading, isError, refetch } = useTracks("album", albumId);
  
  return (
    <TrackListTable 
      tracks={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  );
};