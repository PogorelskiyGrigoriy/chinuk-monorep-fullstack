/**
 * @module AdaptiveDialog
 * Оптимизирован для многоэтапной навигации (Stage Management).
 */
import { 
  useBreakpointValue,
  Portal,
  HStack,
  IconButton
} from "@chakra-ui/react";
import { LuChevronLeft } from "react-icons/lu";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogBackdrop,
} from "@/components/chakra-ui/dialog";

interface AdaptiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  /** НОВОЕ: Колбэк для кнопки назад. Если передан — кнопка появится в хедере */
  onBack?: () => void; 
}

export const AdaptiveDialog = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  onBack
}: AdaptiveDialogProps) => {
  
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={(e) => !e.open && onClose()}
      placement={isMobile ? "bottom" : "center"}
      size={isMobile ? "full" : size}
      // Это важно для длинных списков инвойсов
      scrollBehavior="inside" 
    >
      <Portal>
        <DialogBackdrop />
        <DialogContent 
          borderTopRadius={isMobile ? "2xl" : "xl"} 
          borderBottomRadius={isMobile ? "0" : "xl"}
          maxH={isMobile ? "90vh" : "85vh"}
          bg="bg.panel"
          boxShadow="2xl"
        >
          <DialogHeader borderBottomWidth="1px" borderColor="border.subtle" py={4}>
            <HStack gap={3}>
              {/* НОВОЕ: Кнопка назад в хедере */}
              {onBack && (
                <IconButton
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  aria-label="Назад"
                >
                  <LuChevronLeft />
                </IconButton>
              )}
              
              <DialogTitle fontSize="lg" fontWeight="bold">
                {title}
              </DialogTitle>
            </HStack>
            <DialogCloseTrigger />
          </DialogHeader>

          <DialogBody py={6}>
            {/* Контент будет меняться здесь. 
              Благодаря scrollBehavior="inside", хедер и футер всегда на месте. 
            */}
            {children}
          </DialogBody>

          {footer && (
            <DialogFooter borderTopWidth="1px" borderColor="border.subtle" gap={3}>
              {footer}
            </DialogFooter>
          )}
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};