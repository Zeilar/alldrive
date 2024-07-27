"use client";

import { API_GLOBAL_PREFIX } from "@alldrive/config";
import { DownloadIcon, LockIcon } from "@chakra-ui/icons";
import { Button, Heading, Input, Stack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-query";

interface FileViewProps {
  externalId: string;
  apiHost: string;
  initialIsLocked: boolean;
}

export function FileView({ externalId, apiHost, initialIsLocked }: FileViewProps) {
  const toast = useToast({
    position: "top",
    variant: "top-accent",
  });
  const [isLocked, setIsLocked] = useState<boolean>(initialIsLocked);
  const [password, setPassword] = useState<string>("");
  const queryBasePath = `${apiHost}/${API_GLOBAL_PREFIX}/files/${externalId}`;
  const unlockMutation = useMutation<unknown, unknown, { password: string }>(
    `file-unlock-${externalId}-${password}`,
    async ({ password }) => {
      try {
        const response = await fetch(`${queryBasePath}/unlock?password=${password}`);
        if (!response.ok) {
          toast({
            title: "Incorrect password",
            status: "error",
          });
        }
        setIsLocked(!response.ok);
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          status: "error",
        });
      }
    }
  );

  return (
    <Stack spacing={4} alignItems="center">
      <Heading as="h3" textAlign="center">
        {!isLocked ? "Your file is ready for download!" : "The file is password protected"}
      </Heading>
      <Stack spacing={2} w={300}>
        {isLocked && (
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        )}
        <Button
          _disabled={{ pointerEvents: "none", opacity: 0.65 }}
          isDisabled={isLocked && !password}
          isLoading={unlockMutation.isLoading}
          onClick={isLocked ? () => unlockMutation.mutate({ password }) : undefined}
          leftIcon={!isLocked ? <DownloadIcon /> : <LockIcon />}
        >
          {!isLocked ? <a href={`${queryBasePath}?password=${password}`}>Download</a> : "Unlock"}
        </Button>
      </Stack>
    </Stack>
  );
}
