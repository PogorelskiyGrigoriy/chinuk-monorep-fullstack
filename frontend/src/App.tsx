import { Button, Center, Heading, VStack } from "@chakra-ui/react"

function App() {
  return (
    <Center h="100vh" bg="gray.50">
      <VStack gap={4}>
        <Heading size="2xl" color="teal.600">Chinook Explorer</Heading>
        <Button colorScheme="teal" onClick={() => alert('Chakra is working!')}>
          Проверить Chakra
        </Button>
      </VStack>
    </Center>
  )
}

export default App