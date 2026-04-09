import { Container, Flex, HStack, Box } from "@chakra-ui/react";
import { MAIN_NAV_LINKS, ADMIN_NAV_LINKS } from "@/config/navigation";
import { NavLink } from "./NavLink";
import { UserMenu } from "./UserMenu";

export const Navbar = () => {
  return (
    <Box 
      as="nav" 
      bg="bg.panel" 
      borderBottomWidth="1px" 
      borderColor="border.subtle" 
      position="sticky" 
      top={0} 
      zIndex="sticky"
    >
      <Container maxW="container.xl">
        <Flex h="16" align="center" justify="space-between">
          
          {/* СЛЕВА: Основные ссылки */}
          <HStack gap={{ base: 2, md: 4 }}>
            {/* Рендерим все ссылки из конфига */}
            {[...MAIN_NAV_LINKS, ...ADMIN_NAV_LINKS].map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                label={link.label} 
                icon={link.icon} 
                roles={link.roles} 
              />
            ))}
          </HStack>

          {/* СПРАВА: Профиль */}
          <UserMenu />

        </Flex>
      </Container>
    </Box>
  );
};