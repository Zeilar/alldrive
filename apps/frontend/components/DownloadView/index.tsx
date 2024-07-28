"use client";

import { ArrowBackIcon, DownloadIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { Button, Heading, Stack } from "@chakra-ui/react";

interface DownloadViewProps {
  fileUrl: string;
}

export function DownloadView({ fileUrl }: DownloadViewProps) {
  return (
    <Stack spacing={4} alignItems="center" m="auto">
      <Heading as="h3" textAlign="center">
        Your file is ready for download!
      </Heading>
      <Stack spacing={4} w={300}>
        <a href={fileUrl}>
          <Button w="100%" leftIcon={<DownloadIcon />}>
            Download
          </Button>
        </a>
        <Link href="/" _hover={{ textDecor: "none" }}>
          <Button w="100%" leftIcon={<ArrowBackIcon />}>
            Upload more
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
}
