import { Box, BoxProps } from "@chakra-ui/react";

export const AppPanel = (props: BoxProps) => (
  <Box
    bg="bg.panel" // Из нашей темы Zinc
    borderWidth="1px"
    borderColor="border.subtle"
    borderRadius="2xl"
    shadow="sm"
    {...props}
  />
);