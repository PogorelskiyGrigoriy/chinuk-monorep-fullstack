/**
 * @module EntityDetailGrid
 * Компонент для отображения данных в формате "Метка: Значение".
 * Автоматически переключается между 1 и 2 колонками.
 */
import { 
  SimpleGrid, 
  Stack, 
  Text, 
  Box, 
  Skeleton, 
  VStack 
} from "@chakra-ui/react";

interface DetailField {
  label: string;
  value: React.ReactNode | string | number | null | undefined;
  /** Позволяет полю занимать всю ширину (обе колонки) */
  fullWidth?: boolean;
}

interface EntityDetailGridProps {
  fields: DetailField[];
  isLoading?: boolean;
  /** Количество колонок на десктопе (по умолчанию 2) */
  columns?: number;
}

export const EntityDetailGrid = ({ 
  fields, 
  isLoading, 
  columns = 2 
}: EntityDetailGridProps) => {

  // Состояние загрузки (Skeletons)
  if (isLoading) {
    return (
      <SimpleGrid columns={{ base: 1, md: columns }} gap={6}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Stack key={i} gap={2}>
            <Skeleton height="12px" width="40%" />
            <Skeleton height="20px" width="80%" />
          </Stack>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid 
      columns={{ base: 1, md: columns }} 
      columnGap={10} 
      rowGap={6}
    >
      {fields.map((field, index) => (
        <Box 
          key={index} 
          gridColumn={{ 
            md: field.fullWidth ? `span ${columns}` : "auto" 
          }}
        >
          <VStack align="start" gap={1}>
            <Text 
              fontSize="xs" 
              fontWeight="black" 
              color="fg.muted" 
              textTransform="uppercase" 
              letterSpacing="wider"
            >
              {field.label}
            </Text>
            <Text fontSize="sm" fontWeight="medium" color="fg.default">
              {field.value || "—"}
            </Text>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
};