/**
 * @module TrackListTable
 * Специализированный компонент для отображения списка треков.
 * Используется в Модальных окнах №3, №4, №5.
 */
import { type TrackDetail } from "@project/shared";
import { AppTable, type AppTableColumn } from "./AppTable";
import { DataStateWrapper } from "./DataStateWrapper";
import { LuMusic } from "react-icons/lu";
import { Icon } from "@chakra-ui/react";

interface TrackListTableProps {
  tracks?: TrackDetail[];
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
}

// Конфигурация колонок согласно ТЗ (1.1.1.2.1.1.1 - 3)
const columns: AppTableColumn<TrackDetail>[] = [
  { 
    header: "Название", 
    accessor: (t) => (
      <span>
        <Icon mr={2} color="brand.500" mb={1}><LuMusic /></Icon>
        {t.name}
      </span>
    ),
    isPriority: true // Видно на мобилках
  },
  { 
    header: "Жанр", 
    accessor: "genreName",
    isPriority: true // Жанр тоже важен для контекста
  },
  { 
    header: "Медиа-тип", 
    accessor: "mediaTypeName" 
  },
];

export const TrackListTable = ({ 
  tracks = [], 
  isLoading, 
  isError, 
  onRetry 
}: TrackListTableProps) => {
  return (
    <DataStateWrapper
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      isEmpty={tracks.length === 0}
      emptyMessage="В этом списке пока нет треков"
    >
      <AppTable
        data={tracks}
        columns={columns}
        keyExtractor={(t) => t.trackId}
      />
    </DataStateWrapper>
  );
};