"use client";

import { Button, Heading, Stack } from "@chakra-ui/react";
import { Link } from "@chakra-ui/next-js";
import { ArrowBackIcon } from "@chakra-ui/icons";

interface Props {
  error: unknown;
}

export default function Error({ error }: Props) {
  console.error(error);
  return (
    <Stack m="auto" spacing={4} alignItems="center">
      <Heading as="h1">An unexpected error occurred</Heading>
      <Link href="/" _hover={{ textDecor: "none" }}>
        <Button width="fit-content" leftIcon={<ArrowBackIcon />}>
          Go back
        </Button>
      </Link>
    </Stack>
  );
}
