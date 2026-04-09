/**
 * @module UserMenu
 * Выпадающее меню профиля пользователя в навигационной панели.
 * Использует хук useLogout для безопасного выхода из системы.
 */
import { 
  MenuRoot, MenuTrigger, MenuContent, MenuItem, 
  Button, Box, Text, VStack, HStack, Icon 
} from "@chakra-ui/react";
import { LuUser, LuLogOut, LuChevronDown } from "react-icons/lu";

import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/services/hooks/use-logout";

export const UserMenu = () => {
  // 1. Получаем данные пользователя из стора для отображения в шапке и меню
  const user = useAuthStore((state) => state.user);
  
  // 2. Подключаем хук логаута (API + очистка стора + редирект на /login)
  const { logout } = useLogout();

  return (
    <MenuRoot positioning={{ placement: "bottom-end" }}>
      {/* Кнопка-триггер меню */}
      <MenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          px={{ base: 1, md: 3 }}
          _hover={{ bg: "bg.muted" }}
        >
          <Icon size="md">
            <LuUser />
          </Icon>
          
          {/* Роль видна только на десктопе, добавляем небольшой отступ слева */}
          <Text 
            display={{ base: "none", md: "inline" }} 
            fontWeight="bold" 
            fontSize="xs"
            ml="2"
          >
            {user?.role}
          </Text>
          
          <Icon size="sm" ml="1" opacity={0.5}>
            <LuChevronDown />
          </Icon>
        </Button>
      </MenuTrigger>
      
      {/* Содержимое выпадающего списка */}
      <MenuContent minW="220px" borderRadius="xl" p={2} shadow="xl">
        
        {/* Секция с информацией о пользователе */}
        <Box px={4} py={3}>
          <VStack align="start" gap={0}>
            <Text fontWeight="bold" fontSize="sm" color="fg.default">
              {user ? `${user.firstName} ${user.lastName}` : "Анонимный пользователь"}
            </Text>
            <Text fontSize="xs" color="fg.muted">
              {user?.email || "Email не указан"}
            </Text>
          </VStack>
        </Box>
        
        <Box borderTopWidth="1px" my={2} borderColor="border.subtle" />
        
        {/* Секция действий */}
        <MenuItem 
          value="logout" 
          color="red.500" 
          onClick={logout} // Используем функцию из хука
          cursor="pointer"
          _hover={{ bg: "red.500/5" }}
          p={3}
          borderRadius="lg"
        >
          <HStack gap={3} w="full">
            <Icon size="sm">
              <LuLogOut />
            </Icon>
            <Text fontWeight="semibold" fontSize="sm">
              Выйти из системы
            </Text>
          </HStack>
        </MenuItem>

      </MenuContent>
    </MenuRoot>
  );
};