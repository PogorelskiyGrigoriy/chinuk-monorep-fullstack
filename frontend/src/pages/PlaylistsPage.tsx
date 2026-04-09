/**
 * @module PlaylistsPage
 * Playlist management page (Requirement 1.3).
 * Roles: USER, SUPER_USER.
 * Implements server-side pagination and track list drawer.
 */
import { useState } from "react";
import { Heading, VStack, useDisclosure } from "@chakra-ui/react";
import { LuMusic } from "react-icons/lu";

// Shared UI Components
import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper";
import { AppTable, type AppTableColumn } from "@/components/shared/organisms/AppTable";
import { AdaptiveDialog } from "@/components/shared/molecules/AdaptiveDialog";
import { TrackListTable } from "@/components/shared/organisms/TrackListTable";
import { ActionIconButton } from "@/components/shared/atoms/ActionIconButton";
import { AppPagination } from "@/components/shared/molecules/AppPagination";

// Hooks & Types
import { usePlaylists, useTracks } from "@/services/hooks/queries/use-music";
import { type Playlist } from "@project/shared";

export const PlaylistsPage = () => {
  // 1. Pagination and Data State
  const [params, setParams] = useState({ page: 1, limit: 10 });
  
  // Now fetching paginated response { data: Playlist[], meta: ... }
  const { data: response, isLoading, isError, refetch } = usePlaylists(params);

  // 2. Dialog state
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // 3. Table Column Configuration (Requirement 1.3.1.1 - 1.3.1.3)
  const columns: AppTableColumn<Playlist>[] = [
    { 
      header: "ID", 
      accessor: "playlistId", 
      isPriority: true 
    },
    { 
      header: "Name", 
      accessor: "name", 
      isPriority: true 
    },
    {
      header: "Actions",
      accessor: (playlist) => (
        <ActionIconButton 
          icon={LuMusic} 
          label="Tracks" 
          onClick={() => handleOpenPlaylist(playlist)} 
        />
      ),
    },
  ];

  // 4. Handlers
  const handleOpenPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    onOpen();
  };

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
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
          isEmpty={response?.data.length === 0}
          onRetry={refetch}
        >
          <VStack align="stretch" gap={4}>
            <AppTable 
              data={response?.data || []} 
              columns={columns} 
              keyExtractor={(p) => p.playlistId}
              onDetailClick={handleOpenPlaylist}
            />

            {/* Reusable Pagination Control */}
            {response?.meta && (
              <AppPagination 
                page={response.meta.page}
                totalPages={response.meta.totalPages}
                totalItems={response.meta.total}
                onPageChange={handlePageChange}
              />
            )}
          </VStack>
        </DataStateWrapper>
      </AppPanel>

      {/* Modal #5: Playlist Tracks Content */}
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
 * Helper component for fetching tracks of a specific playlist.
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