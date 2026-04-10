/**
 * @module UserMenu
 * Displays the user profile dropdown, role, and logout functionality.
 * Optimized for Chakra UI v3 positioning using MenuPositioner and Portal.
 */
import { Box, Text, VStack, HStack, Icon, Separator, Portal } from "@chakra-ui/react";
import { MenuRoot, MenuTrigger, MenuPositioner, MenuContent, MenuItem } from "@chakra-ui/react"; 
import { LuUser, LuLogOut, LuChevronDown } from "react-icons/lu";

import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/services/hooks/auth/use-logout";

export const UserMenu = () => {
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();

  return (
    <MenuRoot positioning={{ placement: "bottom-end", flip: false, gutter: 8 }}>
      <MenuTrigger asChild>
        {/* Fixed-width trigger prevents layout shifts during menu state changes */}
        <HStack 
          as="button" 
          w="140px"
          justify="space-between"
          px="3" 
          py="2" 
          borderRadius="md" 
          _hover={{ bg: "bg.subtle" }}
          _expanded={{ bg: "bg.subtle" }}
          transition="background 0.2s"
          cursor="pointer"
          flexShrink={0}
        >
          <HStack gap="2" overflow="hidden">
            <Icon as={LuUser} color="fg.muted" flexShrink={0} />
            <Text fontWeight="bold" fontSize="xs" color="fg.emphasized" hideBelow="md" truncate>
              {user?.role || "USER"}
            </Text>
          </HStack>
          <Icon as={LuChevronDown} size="xs" opacity={0.5} flexShrink={0} />
        </HStack>
      </MenuTrigger>

      <Portal>
        {/* MenuPositioner handles the complex coordinate math for the fixed strategy */}
        <MenuPositioner>
          <MenuContent 
            bg="bg.panel" 
            borderColor="border.subtle" 
            borderWidth="1px"
            shadow="2xl" 
            zIndex="popover" 
            minW="210px"
          >
            <Box px="4" py="3">
              <VStack align="start" gap={0}>
                <Text fontWeight="bold" fontSize="sm" color="fg.emphasized">
                  {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
                </Text>
                <Text fontSize="xs" color="fg.muted" truncate maxW="180px">
                  {user?.email || "No email provided"}
                </Text>
              </VStack>
            </Box>
            
            <Separator borderColor="border.subtle" />
            
            <MenuItem 
              value="logout" 
              color="red.400" 
              onClick={() => logout()} 
              cursor="pointer" 
              _hover={{ bg: "red.500/10", color: "red.300" }}
              p="3"
            >
              <HStack gap="2">
                <Icon as={LuLogOut} />
                <Text fontWeight="medium">Sign Out</Text>
              </HStack>
            </MenuItem>
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
};