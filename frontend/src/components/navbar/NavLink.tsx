import { Link, useLocation } from "react-router-dom";
import { Button, Text, Icon } from "@chakra-ui/react";
import { RBACGuard } from "../shared/moleculas/RBACGuard";
import { type UserRole } from "@project/shared";

interface NavLinkProps {
  to: string;
  label: string;
  icon: React.ElementType;
  roles: readonly UserRole[];
}

export const NavLink = ({ to, label, icon: IconComponent, roles }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <RBACGuard allowedRoles={roles}>
      <Button
        as={Link}
        to={to}
        variant="ghost"
        // Меняем цвет и фон, если страница активна
        bg={isActive ? "brand.500/10" : "transparent"}
        color={isActive ? "brand.500" : "fg.muted"}
        _hover={{ bg: "bg.muted", color: "fg.default" }}
        size="sm"
        px={{ base: 2, md: 4 }}
      >
        <Icon size="md">
           <IconComponent />
        </Icon>
        {/* Текст скрывается на мобильных устройствах */}
        <Text display={{ base: "none", md: "inline" }} fontWeight="semibold">
          {label}
        </Text>
      </Button>
    </RBACGuard>
  );
};