/**
 * @module ActionIconButton
 */
import { Button, type ButtonProps, Icon, Span } from "@chakra-ui/react";

interface ActionIconButtonProps extends ButtonProps {
  icon: React.ElementType;
  label: string;
}

export const ActionIconButton = ({ 
  icon: IconAs,
  label, 
  colorPalette = "brand", 
  ...props 
}: ActionIconButtonProps) => {
  return (
    <Button 
      size="sm" 
      variant="subtle" 
      colorPalette={colorPalette}
      minW={{ base: "36px", md: "auto" }}
      px={{ base: 0, md: 3 }}
      {...props}
    >
      <Icon fontSize="md">
        {/* Теперь React понимает, что это компонент, а не HTML-тег */}
        <IconAs />
      </Icon>
      
      <Span 
        display={{ base: "none", md: "inline" }} 
        ml={2}
      >
        {label}
      </Span>
    </Button>
  );
};