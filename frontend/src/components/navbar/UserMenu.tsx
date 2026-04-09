import { 
  MenuRoot, MenuTrigger, MenuContent, MenuItem, 
  Button, Box, Text, VStack, HStack 
} from "@chakra-ui/react";
import { LuUser, LuLogOut, LuChevronDown } from "react-icons/lu";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "@/services/auth.implementation";

export const UserMenu = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="ghost" size="sm" px={2}>
          <LuUser />
          {/* Роль видна только на десктопе */}
          <Text display={{ base: "none", md: "inline" }} fontWeight="bold" fontSize="xs">
            {user?.role}
          </Text>
          <LuChevronDown />
        </Button>
      </MenuTrigger>
      
      <MenuContent minW="200px" borderRadius="xl" p={2}>
        {/* Данные пользователя */}
        <Box px={4} py={3}>
          <VStack align="start" gap={0}>
            <Text fontWeight="bold" fontSize="sm">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              {user?.email}
            </Text>
          </VStack>
        </Box>
        
        <Box borderTopWidth="1px" my={2} borderColor="border.subtle" />
        
        {/* Кнопка логаута */}
        <MenuItem 
          value="logout" 
          color="red.500" 
          onClick={() => authService.logout()}
          cursor="pointer"
        >
          <HStack gap={2}>
            <LuLogOut />
            <Text fontWeight="medium">Выйти из системы</Text>
          </HStack>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};