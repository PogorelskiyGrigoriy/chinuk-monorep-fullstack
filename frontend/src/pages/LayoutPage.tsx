/**
 * @module LayoutPage
 * Основной каркас приложения.
 * Содержит навигацию и область для динамического контента страниц.
 */
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/navbar/NavBar";

export const LayoutPage = () => {
  return (
    <Flex 
      direction="column"
      minH="100vh" 
      bg="bg.canvas" // Глубокий Zinc 950 из нашей темы
      color="fg.default"
      transition="background-color 0.3s ease"
    >
      {/* Глобальная навигация (Шапка) */}
      <Navbar />

      {/* Основная рабочая область:
          Используем 'as="main"' для доступности (A11y).
          flex="1" заставляет этот блок занимать всё свободное место.
      */}
      <Box 
        as="main"
        w="full"
        flex="1"
        display="flex"
        flexDirection="column"
        position="relative"
      >
        {/* Здесь будут рендериться наши страницы: Customers, Albums и т.д. */}
        <Outlet />
      </Box>

      {/* Если в будущем понадобится футер, он встанет здесь */}
    </Flex>
  );
};