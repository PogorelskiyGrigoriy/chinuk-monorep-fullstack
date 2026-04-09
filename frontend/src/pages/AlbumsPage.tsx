/**
 * @module AlbumsPage
 * Music albums catalog page (Requirement 1.2).
 * Implements paginated view and track details drawer.
 */
import { useState } from "react";
import { Heading, VStack, useDisclosure } from "@chakra-ui/react";
import { LuListMusic } from "react-icons/lu";

// Shared UI Components
import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper";
import { AppTable, type AppTableColumn } from "@/components/shared/organisms/AppTable";
import { AdaptiveDialog } from "@/components/shared/molecules/AdaptiveDialog";
import { TrackListTable } from "@/components/shared/organisms/TrackListTable";
import { ActionIconButton } from "@/components/shared/atoms/ActionIconButton";
import { AppPagination } from "@/components/shared/molecules/AppPagination"; // New import

// Hooks & Types
import { useAlbums, useTracks } from "@/services/hooks/queries/use-music";
import { type AlbumWithArtist } from "@project/shared";

export const AlbumsPage = () => {
  // 1. Data and Pagination state
  const [params, setParams] = useState({ page: 1, limit: 12 });
  const { data: response, isLoading, isError, refetch } = useAlbums(params);

  // 2. Modal state
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithArtist | null>(null);

  // 3. Columns configuration
  const columns: AppTableColumn<AlbumWithArtist>[] = [
    { 
      header: "Album", 
      accessor: "title", 
      isPriority: true 
    },
    { 
      header: "Artist", 
      accessor: "artistName", 
      isPriority: true 
    },
    {
      header: "Actions",
      accessor: (album) => (
        <ActionIconButton 
          icon={LuListMusic} 
          label="Tracks" 
          onClick={() => handleOpenTracks(album)} 
        />
      ),
    },
  ];

  // 4. Handlers
  const handleOpenTracks = (album: AlbumWithArtist) => {
    setSelectedAlbum(album);
    onOpen();
  };

  const handlePageChange = (newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
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
          isEmpty={response?.data.length === 0}
          onRetry={refetch}
        >
          <VStack align="stretch" gap={4}>
            <AppTable 
              data={response?.data || []} 
              columns={columns} 
              keyExtractor={(a) => a.albumId}
              onDetailClick={handleOpenTracks}
            />

            {/* Reusable Pagination Component */}
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
 * Helper component for loading album tracks.
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