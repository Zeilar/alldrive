"use client";

import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { Button, Heading, Stack } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Stack m="auto" spacing={4} alignItems="center">
      <Heading as="h1">The file you&apos;re looking for could not be found.</Heading>
      <Link href="/" _hover={{ textDecor: "none" }}>
        <Button width="fit-content" leftIcon={<ArrowBackIcon />}>
          Return to home
        </Button>
      </Link>
    </Stack>
  );
}
