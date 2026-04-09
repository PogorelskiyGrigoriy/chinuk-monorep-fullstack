/**
 * @module PlaylistsPage
 * Страница управления плейлистами (ТЗ 1.3).
 * Роли: USER, SUPER_USER.
 */
import { useState } from "react";
import { Heading, VStack, useDisclosure } from "@chakra-ui/react";
import { LuMusic } from "react-icons/lu";

import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper";
import { AppTable, type AppTableColumn } from "@/components/shared/organisms/AppTable";
import { AdaptiveDialog } from "@/components/shared/molecules/AdaptiveDialog";
import { TrackListTable } from "@/components/shared/organisms/TrackListTable";
import { ActionIconButton } from "@/components/shared/atoms/ActionIconButton";

import { usePlaylists, useTracks } from "@/services/hooks/queries/use-music";
import { type Playlist } from "@project/shared";

export const PlaylistsPage = () => {
  // 1. Загрузка данных
  // Плейлистов обычно немного, поэтому в нашем хуке usePlaylists пагинация не предусмотрена
  const { data: playlists, isLoading, isError, refetch } = usePlaylists();

  // 2. Состояние модального окна
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // 3. Конфигурация колонок (ТЗ 1.3.1.1 - 1.3.1.3)
  const columns: AppTableColumn<Playlist>[] = [
    { 
      header: "ID", 
      accessor: "playlistId", 
      isPriority: true 
    },
    { 
      header: "Название", 
      accessor: "name", 
      isPriority: true 
    },
    {
      header: "Действия",
      accessor: (playlist) => (
        <ActionIconButton 
          icon={LuMusic} 
          label="Details" 
          onClick={() => handleOpenPlaylist(playlist)} 
        />
      ),
    },
  ];

  // 4. Обработчики
  const handleOpenPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    onOpen();
  };

  return (
    <VStack gap={6} align="stretch" w="full">
      <Heading size="xl" fontWeight="black" letterSpacing="tight">
        PLAYLISTS
      </Heading>

      <AppPanel>
        <DataStateWrapper 
          isLoading={isLoading} 
          isError={isError} 
          isEmpty={playlists?.length === 0}
          onRetry={refetch}
        >
          <AppTable 
            data={playlists || []} 
            columns={columns} 
            keyExtractor={(p) => p.playlistId}
            onDetailClick={handleOpenPlaylist}
          />
        </DataStateWrapper>
      </AppPanel>

      {/* Модальное окно №5: Состав плейлиста */}
      <AdaptiveDialog 
        isOpen={open} 
        onClose={onClose} 
        title={selectedPlaylist ? `Playlist: ${selectedPlaylist.name}` : "Tracks"}
        size="lg"
      >
        {selectedPlaylist && (
          <PlaylistTracksView playlistId={selectedPlaylist.playlistId} />
        )}
      </AdaptiveDialog>
    </VStack>
  );
};

/**
 * Вспомогательный компонент для загрузки треков плейлиста.
 */
const PlaylistTracksView = ({ playlistId }: { playlistId: number }) => {
  const { data, isLoading, isError, refetch } = useTracks("playlist", playlistId);
  
  return (
    <TrackListTable 
      tracks={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  );
};