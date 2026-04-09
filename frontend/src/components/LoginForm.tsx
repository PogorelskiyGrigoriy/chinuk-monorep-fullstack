/**
 * @module LoginForm
 * Точка входа в систему Chinook Explorer.
 */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Button, Input, Stack, HStack, Heading, 
  Alert, Fieldset, Text, VStack, Separator, Icon 
} from "@chakra-ui/react";
import { LuLogIn, LuInfo } from "react-icons/lu";

import { Field } from "@/components/ui/field";
import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { useLogin } from "@/hooks/use-login";
import { loginSchema, type LoginData } from "@project/shared";
import { getErrorData } from "@/utils/error-helpers";

export const LoginForm = () => {
  const { mutate, isPending, isError, error, reset: resetMutation } = useLogin();
  
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
  
  // Сбрасываем ошибку сервера, когда пользователь начинает заново вводить данные
  useEffect(() => {
    if (isError) resetMutation();
  }, [email, password, isError, resetMutation]);

  const handleLogin = (data: LoginData) => mutate(data);

  // Используем наш хелпер для красивого вывода ошибки
  const { desc: serverErrorMessage } = getErrorData(error);

  return (
    <AppPanel maxW="420px" mx="auto" p={{ base: "8", md: "10" }} shadow="2xl">
      <form onSubmit={handleSubmit(handleLogin)}>
        <Fieldset.Root disabled={isPending}>
          <Stack gap="8">
            <Stack gap="2" textAlign="center">
              <Heading size="2xl" letterSpacing="tight" fontWeight="black">
                Chinook Explorer
              </Heading>
              <Text fontSize="sm" color="fg.muted">
                Войдите, чтобы управлять музыкальной коллекцией
              </Text>
            </Stack>

            {isError && (
              <Alert.Root status="error" variant="subtle" borderRadius="xl">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title fontSize="xs">{serverErrorMessage}</Alert.Title>
                </Alert.Content>
              </Alert.Root>
            )}

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

      <Stack gap="5" mt="10">
        <HStack gap="4">
          <Separator flex="1" />
          <HStack gap="1" color="fg.muted">
            <Icon as={LuInfo} boxSize="3" />
            <Text fontSize="2xs" fontWeight="black" textTransform="uppercase" letterSpacing="widest">
              Демо-доступ
            </Text>
          </HStack>
          <Separator flex="1" />
        </HStack>
        
        <VStack gap="2" align="stretch">
          <CredentialBox label="Admin" value="admin@chinook.com / password" />
          <CredentialBox label="Manager" value="sale@chinook.com / password" />
        </VStack>
      </Stack>
    </AppPanel>
  );
};

const CredentialBox = ({ label, value }: { label: string, value: string }) => (
  <HStack 
    p="3" bg="bg.muted/30" borderRadius="xl" 
    borderWidth="1px" borderColor="border.subtle" justify="space-between"
  >
    <Text fontSize="xs" color="fg.muted">{label}</Text>
    <Text fontSize="xs" fontWeight="bold">{value}</Text>
  </HStack>
);