import { Link, useLocation } from "react-router-dom";
import { Button, Text, Icon } from "@chakra-ui/react";
import { RBACGuard } from "../shared/organisms/RBACGuard"; // Оставил твой путь
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
      {/* Добавляем asChild. 
        Теперь Button работает как "обертка стилей", а реальным элементом будет Link.
      */}
      <Button
        asChild
        variant="ghost"
        bg={isActive ? "brand.500/10" : "transparent"}
        color={isActive ? "brand.500" : "fg.muted"}
        _hover={{ bg: "bg.muted", color: "fg.default" }}
        size="sm"
        px={{ base: 2, md: 4 }}
      >
        <Link to={to}>
          <Icon size="md">
            <IconComponent />
          </Icon>
          {/* Текст скрывается на мобильных устройствах */}
          <Text display={{ base: "none", md: "inline" }} fontWeight="semibold">
            {label}
          </Text>
        </Link>
      </Button>
    </RBACGuard>
  );
};