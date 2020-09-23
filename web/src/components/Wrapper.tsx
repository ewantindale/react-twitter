import { Box } from "@chakra-ui/core";
import React from "react";

interface Props {
  children: any;
}

export default function Wrapper({ children }: Props) {
  return (
    <Box maxW="1200px" mx="auto" mt={4} p={[0, 0, 4, 4]}>
      {children}
    </Box>
  );
}
