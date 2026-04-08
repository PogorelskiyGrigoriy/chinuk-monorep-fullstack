/**
 * @module ErrorPage
 * Страница обработки ошибок роутинга и системных сбоев.
 * Полностью синхронизирована с кастомной темой Zinc/Indigo.
 */
import { useRouteError, useNavigate } from "react-router-dom";
import {
  Center, VStack, Heading, Text, Button, Code,
  Box, IconButton, HStack, List, Badge, Clipboard
} from "@chakra-ui/react";
import {
  LuHouse, LuRefreshCw, LuCopy, LuCheck,
  LuCircleAlert, LuTriangleAlert
} from "react-icons/lu";

// Использование алиаса @/ для консистентности
import { getErrorData, formatValidationErrors } from "@/utils/error-helpers";

export const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  const { status, title, desc, debug, validation } = getErrorData(error);
  const validationMessages = validation ? formatValidationErrors(validation) : [];

  return (
    <Center h="100vh" p="6" bg="bg.canvas" color="fg.default">
      <VStack gap="8" maxW="xl" w="full">

        {/* Иконка ошибки с эффектом свечения */}
        <Box color="red.500" filter="drop-shadow(0 0 10px rgba(239, 68, 68, 0.2))">
          <LuCircleAlert size="64" />
        </Box>

        {/* Заголовок и статус */}
        <VStack gap="2" textAlign="center">
          <HStack gap="3" justify="center">
            <Badge colorPalette="red" variant="solid" size="lg">
              {status}
            </Badge>
            <Heading size="3xl" letterSpacing="tight" color="fg.emphasized">
              {title}
            </Heading>
          </HStack>
          <Text color="fg.muted" fontSize="lg">
            {desc}
          </Text>
        </VStack>

        {/* Блок ошибок валидации */}
        {validationMessages.length > 0 && (
          <Box
            w="full"
            borderWidth="1px"
            borderColor="orange.500/30"
            bg="orange.500/5"
            p="4"
            borderRadius="md"
          >
            <HStack color="orange.500" mb="3">
              <LuTriangleAlert />
              <Text fontWeight="bold" fontSize="sm">Ошибки валидации:</Text>
            </HStack>
            <List.Root fontSize="sm" color="fg.muted" variant="marker">
              {validationMessages.map((m, i) => (
                <List.Item key={i}>{m}</List.Item>
              ))}
            </List.Root>
          </Box>
        )}

        {/* Основные действия */}
        <HStack gap="4">
          <Button
            onClick={() => navigate("/")}
            colorPalette="brand" // Используем наш настроенный Indigo через токен brand
            size="lg"
            px="8"
          >
            <LuHouse /> На главную
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            borderColor="border.emphasized" // Используем токен границы из темы
            size="lg"
          >
            <LuRefreshCw /> Повторить попытку
          </Button>
        </HStack>

        {/* Технические подробности */}
        <Box w="full" mt="4">
          <Clipboard.Root value={debug || String(status)}>
            <HStack justify="center" mb="3">
              <Text fontSize="2xs" fontWeight="black" color="fg.muted" letterSpacing="widest">
                ТЕХНИЧЕСКИЕ ПОДРОБНОСТИ
              </Text>

              <Clipboard.Trigger asChild>
                <IconButton
                  size="xs"
                  variant="ghost"
                  aria-label="copy technical details"
                >
                  <Clipboard.Indicator>
                    <LuCopy />
                    <LuCheck color="green.500" /> 
                  </Clipboard.Indicator>
                </IconButton>
              </Clipboard.Trigger>
            </HStack>

            <Box
              p="3"
              bg="bg.muted" // Используем наш Zinc 800 из темы
              borderWidth="1px"
              borderColor="border.subtle"
              borderRadius="sm"
              overflow="hidden"
            >
              <Code
                display="block"
                bg="transparent"
                color="fg.muted"
                fontSize="xs"
                textAlign="left"
                maxH="150px"
                overflowY="auto"
                whiteSpace="pre-wrap"
              >
                {debug}
              </Code>
            </Box>
          </Clipboard.Root>
        </Box>
      </VStack>
    </Center>
  );
};