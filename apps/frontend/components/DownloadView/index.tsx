"use client";

import { DownloadIcon } from "@chakra-ui/icons";
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
      <a href={fileUrl}>
        <Button leftIcon={<DownloadIcon />}>Download</Button>
      </a>
    </Stack>
  );
}
