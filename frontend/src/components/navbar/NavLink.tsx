/**
 * @module NavLink
 * Navigation link component with Active State and RBAC protection.
 * Responsive design: Hides labels on mobile devices.
 */
import { Link, useLocation } from "react-router-dom";
import { Button, Text, Icon } from "@chakra-ui/react";
import { RBACGuard } from "../shared/organisms/RBACGuard";
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
        asChild
        variant="ghost"
        // Semantic coloring based on active route
        bg={isActive ? "brand.500/10" : "transparent"}
        color={isActive ? "brand.500" : "fg.muted"}
        _hover={{ bg: "bg.muted", color: "fg.default" }}
        size="sm"
        px={{ base: 2, md: 4 }}
      >
        <Link to={to}>
          <Icon as={IconComponent} boxSize="4" />
          {/* Label automatically hides on mobile viewports */}
          <Text hideBelow="md" fontWeight="semibold">
            {label}
          </Text>
        </Link>
      </Button>
    </RBACGuard>
  );
};