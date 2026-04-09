/**
 * @module LoginPage
 * Шлюз аутентификации.
 */
import { Container, Center } from "@chakra-ui/react";
import { LoginForm } from "@/components/login/LoginForm";

export const LoginPage = () => {
  return (
    <Center 
      minH="100vh" 
      bg="bg.canvas" 
      p={4}
      backgroundImage="radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent 40%)"
    >
      <Container maxW="md">
        <LoginForm />
      </Container>
    </Center>
  );
};

export default LoginPage;