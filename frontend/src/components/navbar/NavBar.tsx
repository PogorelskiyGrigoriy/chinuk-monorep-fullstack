/**
 * @module Navbar
 * Main application header.
 * Synchronizes navigation links and user session controls.
 */
import { Container, HStack, Box } from "@chakra-ui/react";
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
      top="0" 
      zIndex="sticky"
      w="full"
    >
      <Container maxW="container.xl" px={{ base: "4", md: "8" }}>
        {/* flex justify="space-between" keeps nav left and user profile right */}
        <HStack justify="space-between" h="16" align="center">
          
          {/* Main Navigation Section */}
          <HStack gap={{ base: 2, md: 4 }}>
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

          {/* User Profile Section */}
          <UserMenu />

        </HStack>
      </Container>
    </Box>
  );
};