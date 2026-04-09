/**
 * @module AppBadge
 * Универсальный бейдж для ролей и категорий.
 */
import { Badge, type BadgeProps } from "@chakra-ui/react";

interface AppBadgeProps extends BadgeProps {
  type?: "role" | "genre" | "default";
  value: string;
}

// Маппинг цветов для ролей (ТЗ 2.5.1)
const ROLE_COLORS: Record<string, string> = {
  SUPER_USER: "red",
  SALE: "blue",
  USER: "green",
};

export const AppBadge = ({ type = "default", value, ...props }: AppBadgeProps) => {
  let colorPalette = "gray";

  if (type === "role") {
    colorPalette = ROLE_COLORS[value] || "gray";
  } else if (type === "genre") {
    colorPalette = "purple"; // Все жанры в одной гамме для стиля
  }

  return (
    <Badge 
      variant="subtle" 
      colorPalette={colorPalette} 
      borderRadius="full" 
      px={2}
      textTransform="uppercase"
      fontSize="10px"
      fontWeight="bold"
      {...props}
    >
      {value}
    </Badge>
  );
};