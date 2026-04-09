/**
 * @module EmptyState
 * Презентационный компонент для пустых состояний.
 */
import { VStack, Icon, Text, Box, Button } from "@chakra-ui/react";
import { LuSearchX } from "react-icons/lu";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const EmptyState = ({ 
  title = "Ничего не найдено", 
  description = "Попробуйте изменить параметры поиска или фильтры.",
  onAction,
  actionLabel
}: EmptyStateProps) => {
  return (
    <VStack gap={4} py={12} textAlign="center" w="full">
      <Box p={4} borderRadius="full" bg="bg.muted">
        <Icon size="xl" color="fg.muted">
          <LuSearchX />
        </Icon>
      </Box>
      <VStack gap={1}>
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
        <Text color="fg.muted" fontSize="sm" maxW="xs">
          {description}
        </Text>
      </VStack>
      {onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </VStack>
  );
};