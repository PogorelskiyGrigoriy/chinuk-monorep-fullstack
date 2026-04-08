/**
 * @module AppInitializer
 * Синхронизирует состояние сессии при загрузке или обновлении страницы.
 * Оптимизировано для React 19 и Chakra UI 3.x.
 */
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from 'src/store/auth-store';
import { Center, Spinner, Text, VStack } from '@chakra-ui/react';
import { api } from 'src/api/axios-instance';
import type { User } from '@project/shared';

export const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, setAuth, logout, isInitialized, setInitialized } = useAuthStore();

  // Запрашиваем данные пользователя только если в localStorage есть токен
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await api.get<User>('/auth/me');
      return response.data;
    },
    enabled: !!token, 
    retry: false,
    staleTime: Infinity, // Данные профиля не протухают сами по себе
  });

  useEffect(() => {
    // 1. Если токена нет вообще — инициализация завершена (юзер гость)
    if (!token) {
      setInitialized(true);
      return;
    }

    // 2. Если данные успешно получены — обновляем стор
    if (isSuccess && data) {
      setAuth(data, token);
      setInitialized(true);
    }

    // 3. Если произошла ошибка (например, токен истек) — очищаем всё
    if (isError) {
      logout();
      setInitialized(true);
    }
  }, [token, isSuccess, isError, data, setAuth, logout, setInitialized]);

  // Показываем лоадер только когда у нас есть токен, но мы еще не получили ответ от сервера
  const showLoader = !isInitialized && !!token && isLoading;

  if (showLoader) {
    return (
      <Center h="100vh" bg="bg.canvas">
        <VStack gap={5}>
          <Spinner 
            size="xl" 
            color="indigo.500" 
            borderWidth="3px"
          />
          <VStack gap={1} textAlign="center">
            <Text color="fg.emphasized" fontWeight="bold">
              Восстановление сессии
            </Text>
            <Text color="fg.muted" fontSize="sm">
              Проверяем данные доступа, подождите...
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return <>{children}</>;
};