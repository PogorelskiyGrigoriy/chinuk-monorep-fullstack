/**
 * @module LoginDemoHints
 * Вспомогательный компонент для страницы логина.
 * Отображает учетные данные тестовых пользователей для разных ролей.
 */
import { 
  Stack, HStack, VStack, Text, Box, Icon, Flex, Separator, Center 
} from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";

/**
 * Описание одного блока с учетными данными
 */
interface CredentialBoxProps {
  label: string;
  email: string;
  role: string;
}

const CredentialBox = ({ label, email, role }: CredentialBoxProps) => (
  <Box 
    p="3" 
    bg="bg.muted/20" 
    borderRadius="xl" 
    borderWidth="1px" 
    borderColor="border.subtle" 
    _hover={{ bg: "bg.muted/40" }}
    transition="background 0.2s"
  >
    <Flex justify="space-between" align="center" mb="1">
      <Text fontSize="xs" fontWeight="bold" color="brand.500">{label}</Text>
      <Text fontSize="10px" color="fg.muted" fontStyle="italic">{role}</Text>
    </Flex>
    <Text fontSize="xs" color="fg.default" fontFamily="mono">{email}</Text>
  </Box>
);

export const LoginDemoHints = () => {
  return (
    <Stack gap="4" mt="10">
      {/* Заголовок-разделитель */}
      <HStack gap="4">
        <Separator flex="1" borderColor="border.subtle" />
        <HStack gap="1" color="fg.muted">
          <Icon size="xs"><LuInfo /></Icon>
          <Text fontSize="2xs" fontWeight="black" textTransform="uppercase" letterSpacing="widest">
            Тестовый доступ
          </Text>
        </HStack>
        <Separator flex="1" borderColor="border.subtle" />
      </HStack>
      
      {/* Список аккаунтов */}
      <VStack gap="2" align="stretch">
        <CredentialBox 
          label="Super User" 
          email="admin@chinook.com" 
          role="Админ (Все права)" 
        />
        <CredentialBox 
          label="Sale Agent" 
          email="sales@chinook.com" 
          role="CRM (Клиенты)" 
        />
        <CredentialBox 
          label="Regular User" 
          email="user@chinook.com" 
          role="Музыка (Альбомы)" 
        />
        
        <Center mt="1">
          <Text fontSize="10px" color="fg.muted">
            Пароль для всех: <Text as="span" fontWeight="bold" color="fg.default">password123</Text>
          </Text>
        </Center>
      </VStack>
    </Stack>
  );
};