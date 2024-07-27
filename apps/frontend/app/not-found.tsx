"use client";

import { Box, Heading } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Box m="auto">
      <Heading as="h1">
        The file you&apos;re looking for could not be found.
      </Heading>
    </Box>
  );
}
