/**
 * @module DataStateWrapper
 * Централизованная обработка состояний API: Загрузка, Ошибка, Пустой список.
 * Интегрировано с темой Chinook и нашими хелперами ошибок.
 */
import { Center, Spinner, Text, VStack, Icon, Button, Box } from "@chakra-ui/react";
import { LuSearchX, LuCircleAlert, LuRefreshCw } from "react-icons/lu";
import { getErrorData } from "@/utils/error-helpers";

interface DataStateWrapperProps {
  children: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  error?: any;
  /** Условие для показа пустого состояния (например, data.length === 0) */
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  onRetry?: () => void;
}

export const DataStateWrapper = ({
  children,
  isLoading,
  isError,
  error,
  isEmpty,
  emptyMessage = "Записей не найдено",
  emptyDescription = "Попробуйте изменить фильтры или обновить страницу.",
  onRetry,
}: DataStateWrapperProps) => {
  
  // 1. СОСТОЯНИЕ ЗАГРУЗКИ
  if (isLoading) {
    return (
      <Center h="50vh">
        <VStack gap={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color="fg.muted" fontSize="sm" fontWeight="medium">
            Синхронизация с Chinook DB...
          </Text>
        </VStack>
      </Center>
    );
  }

  // 2. СОСТОЯНИЕ ОШИБКИ
  if (isError) {
    // Используем наш хелпер для извлечения данных об ошибке
    const { title, desc } = getErrorData(error);
    
    return (
      <Center h="50vh" p={8}>
        <VStack 
          gap={4} 
          p={8} 
          borderRadius="lg" 
          bg="red.500/5" 
          borderWidth="1px" 
          borderColor="red.500/20"
          maxW="md"
          textAlign="center"
        >
          <Icon color="red.500" size="xl">
            <LuCircleAlert />
          </Icon>
          <VStack gap={1}>
            <Text fontWeight="bold" color="red.500">{title || "Ошибка загрузки"}</Text>
            <Text fontSize="sm" color="fg.muted">{desc}</Text>
          </VStack>
          {onRetry && (
            <Button 
              size="sm" 
              variant="outline" 
              colorPalette="red" 
              onClick={onRetry}
              mt={2}
            >
              <LuRefreshCw /> Повторить попытку
            </Button>
          )}
        </VStack>
      </Center>
    );
  }

  // 3. ПУСТОЕ СОСТОЯНИЕ
  if (isEmpty) {
    return (
      <Center 
        h="300px" 
        borderWidth="1px" 
        borderStyle="dashed" 
        borderRadius="xl" 
        borderColor="border.subtle"
        bg="bg.panel"
        m="4"
      >
        <VStack gap={3}>
          <Box opacity={0.3} color="fg.muted">
            <LuSearchX size="48" />
          </Box>
          <VStack gap={1}>
            <Text fontWeight="bold" fontSize="lg">{emptyMessage}</Text>
            <Text color="fg.muted" fontSize="sm">{emptyDescription}</Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // 4. УСПЕХ: Рендерим саму таблицу или контент страницы
  return <>{children}</>;
};