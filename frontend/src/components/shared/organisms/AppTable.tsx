/**
 * @module AppTable
 * Адаптивное ядро для отображения списков.
 * Переключается между Table (Desktop) и Card List (Mobile).
 */
import { 
  Table, 
  Stack, 
  Box, 
  Text, 
  HStack, 
  Button, 
  Icon, 
  useBreakpointValue,
  Flex
} from "@chakra-ui/react";
import { LuChevronRight, LuInfo } from "react-icons/lu";
import { AppPanel } from "../atoms/AppPanel";

export interface AppTableColumn<T> {
  header: string;
  /** Ключ в объекте или функция, возвращающая React-ноду */
  accessor: keyof T | ((item: T) => React.ReactNode);
  /** Приоритетные данные для заголовка мобильной карточки */
  isPriority?: boolean;
  /** Выравнивание контента */
  textAlign?: "left" | "center" | "right";
}

interface AppTableProps<T> {
  columns: AppTableColumn<T>[];
  data: T[];
  /** Уникальный ключ для каждой строки (например, 'customerId') */
  keyExtractor: (item: T) => string | number;
  /** Колбэк при клике на мобильную кнопку "Детали" */
  onDetailClick?: (item: T) => void;
  isLoading?: boolean;
}

export function AppTable<T>({ 
  columns, 
  data, 
  keyExtractor, 
  onDetailClick 
}: AppTableProps<T>) {
  
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Вспомогательная функция для рендера значения ячейки
  const renderCell = (item: T, column: AppTableColumn<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }
    return String(item[column.accessor] ?? "");
  };

  // --- ВАРИАНТ 1: DESKTOP TABLE ---
  if (!isMobile) {
    return (
      <AppPanel overflow="hidden">
        <Table.Root size="sm" variant="line">
          <Table.Header bg="bg.muted/50">
            <Table.Row>
              {columns.map((col, idx) => (
                <Table.ColumnHeader key={idx} textAlign={col.textAlign}>
                  {col.header}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item) => (
              <Table.Row key={keyExtractor(item)} _hover={{ bg: "bg.muted/30" }}>
                {columns.map((col, idx) => (
                  <Table.Cell key={idx} textAlign={col.textAlign} py={4}>
                    {renderCell(item, col)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </AppPanel>
    );
  }

  // --- ВАРИАНТ 2: MOBILE CARD LIST ---
  return (
    <Stack gap={4} w="full">
      {data.map((item) => (
        <AppPanel key={keyExtractor(item)} p={4}>
          <Flex justify="space-between" align="flex-start">
            <Stack gap={1} flex="1">
              {/* Рендерим только приоритетные поля в заголовке карточки */}
              {columns.filter(c => c.isPriority).map((col, idx) => (
                <Box key={idx}>
                  <Text fontSize="xs" color="fg.muted" fontWeight="medium" textTransform="uppercase">
                    {col.header}
                  </Text>
                  <Text fontWeight="bold" fontSize="md">
                    {renderCell(item, col)}
                  </Text>
                </Box>
              ))}
            </Stack>
            
            {onDetailClick && (
              <Button 
                variant="subtle" 
                size="sm" 
                colorPalette="brand"
                onClick={() => onDetailClick(item)}
              >
                <LuInfo /> Детали
              </Button>
            )}
          </Flex>
          
          {/* Можно добавить краткий список остальных полей, если нужно */}
          <HStack mt={4} pt={3} borderTopWidth="1px" borderColor="border.subtle" justify="space-between">
             <Text fontSize="xs" color="fg.muted">ID: {keyExtractor(item)}</Text>
             <Icon color="brand.500"><LuChevronRight /></Icon>
          </HStack>
        </AppPanel>
      ))}
    </Stack>
  );
}