/**
 * @module AppPagination
 * Reusable pagination controls for table views.
 */
import { Group, Button, Text, Stack } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface AppPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const AppPagination = ({ 
  page, 
  totalPages, 
  totalItems, 
  onPageChange 
}: AppPaginationProps) => {
  // If there's only one page or no data, don't show controls
  if (totalPages <= 1) return null;

  return (
    <Stack 
      direction={{ base: "column", sm: "row" }} 
      justify="space-between" 
      align="center" 
      pt={4} 
      gap={4}
      borderTopWidth="1px"
    >
      <Text fontSize="sm" color="fg.muted">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong> 
        {" "}({totalItems} total items)
      </Text>
      
      <Group attached>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={page === 1} 
          onClick={() => onPageChange(page - 1)}
        >
          <LuChevronLeft /> Prev
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={page >= totalPages} 
          onClick={() => onPageChange(page + 1)}
        >
          Next <LuChevronRight />
        </Button>
      </Group>
    </Stack>
  );
};