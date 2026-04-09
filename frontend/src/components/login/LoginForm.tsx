/**
 * @module LoginForm
 * Центральный компонент аутентификации. 
 * Инкапсулирует логику валидации (RHF + Zod) и отправки данных (useLogin).
 */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Button, Input, Stack, Heading, 
  Alert, Fieldset, Text 
} from "@chakra-ui/react";
import { LuLogIn } from "react-icons/lu";

import { Field } from "../chakra-ui/field";
import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { LoginDemoHints } from "./LoginDemoHints";
import { useLogin } from "@/services/hooks/auth/use-login";
import { loginSchema, type LoginData } from "@project/shared";
import { getErrorData } from "@/utils/error-helpers";

export const LoginForm = () => {
  // 1. Логика авторизации через кастомный хук
  const { mutate, isPending, isError, error, reset: resetMutation } = useLogin();
  
  // 2. Настройка формы
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isValid, isDirty } 
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" }
  });

  const [email, password] = watch(["email", "password"]);
  
  // Очистка серверной ошибки при изменении полей ввода
  useEffect(() => {
    if (isError) resetMutation();
  }, [email, password, isError, resetMutation]);

  const handleLogin = (data: LoginData) => mutate(data);

  // Обработка текста ошибки через хелпер
  const { desc: serverErrorMessage } = getErrorData(error);

  return (
    <AppPanel maxW="420px" mx="auto" p={{ base: "8", md: "10" }} shadow="2xl">
      <form onSubmit={handleSubmit(handleLogin)}>
        <Fieldset.Root disabled={isPending}>
          <Stack gap="8">
            
            {/* Заголовок */}
            <Stack gap="2" textAlign="center">
              <Heading size="2xl" letterSpacing="tight" fontWeight="black">
                Chinook Explorer
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                Войдите, чтобы управлять музыкальной коллекцией
              </Text>
            </Stack>

            {/* Сообщение об ошибке от сервера */}
            {isError && (
              <Alert.Root status="error" variant="subtle" borderRadius="xl">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title fontSize="xs">{serverErrorMessage}</Alert.Title>
                </Alert.Content>
              </Alert.Root>
            )}

            {/* Поля ввода */}
            <Stack gap="5">
              <Field 
                label="Email" 
                invalid={!!errors.email} 
                errorText={errors.email?.message}
              >
                <Input
                  variant="subtle"
                  placeholder="name@example.com"
                  size="lg"
                  {...register("email")}
                />
              </Field>

              <Field 
                label="Пароль" 
                invalid={!!errors.password} 
                errorText={errors.password?.message}
              >
                <Input
                  type="password"
                  variant="subtle"
                  placeholder="••••••••"
                  size="lg"
                  {...register("password")}
                />
              </Field>
            </Stack>

            {/* Кнопка отправки */}
            <Button 
              type="submit" 
              colorPalette="brand" 
              loading={isPending} 
              disabled={!isValid || !isDirty}
              width="full"
              size="xl"
              mt="2"
            >
              <LuLogIn /> Войти
            </Button>
          </Stack>
        </Fieldset.Root>
      </form>

      {/* Подсказки для тестового доступа */}
      <LoginDemoHints />
      
    </AppPanel>
  );
};