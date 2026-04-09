/**
 * @module AdaptiveDialog
 * Универсальный компонент-обертка. 
 * Desktop (md+) -> Центрированное модальное окно.
 * Mobile (base, sm) -> Выезжающая снизу шторка (Drawer).
 */
import { 
  useBreakpointValue,
  Portal
} from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogBackdrop,
} from "@/components/chakra-ui/dialog"; // Путь к вашим сниппетам Chakra v3

interface AdaptiveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
}

export const AdaptiveDialog = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md"
}: AdaptiveDialogProps) => {
  
  // Определяем режим отображения на основе ширины экрана
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={(e) => !e.open && onClose()}
      // На мобилках прижимаем к низу, на десктопе — по центру
      placement={isMobile ? "bottom" : "center"}
      size={isMobile ? "full" : size}
      scrollBehavior="inside"
    >
      <Portal>
        <DialogBackdrop />
        <DialogContent 
          // Стилизация под Drawer для мобилок
          borderTopRadius={isMobile ? "2xl" : "xl"} 
          borderBottomRadius={isMobile ? "0" : "xl"}
          maxH={isMobile ? "90vh" : "85vh"}
          bg="bg.panel"
          boxShadow="2xl"
        >
          {/* Хедер с заголовком */}
          <DialogHeader borderBottomWidth="1px" borderColor="border.subtle" py={4}>
            <DialogTitle fontSize="lg" fontWeight="bold">
              {title}
            </DialogTitle>
            <DialogCloseTrigger />
          </DialogHeader>

          {/* Основной контент */}
          <DialogBody py={6}>
            {children}
          </DialogBody>

          {/* Футер (если передан) */}
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