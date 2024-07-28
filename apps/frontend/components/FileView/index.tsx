"use client";

import { API_GLOBAL_PREFIX } from "@alldrive/config";
import { ArrowBackIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutation } from "react-query";
import { DownloadView } from "../DownloadView";
import { Link } from "@chakra-ui/next-js";

interface FileViewProps {
  externalId: string;
  apiHost: string;
  initialIsLocked: boolean;
}

export function FileView({ externalId, apiHost, initialIsLocked }: FileViewProps) {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const toast = useToast({
    position: "top",
    variant: "top-accent",
  });
  const [isLocked, setIsLocked] = useState<boolean>(initialIsLocked);
  const searchParams = useSearchParams();
  const [password, setPassword] = useState<string>(searchParams.get("password") ?? "");
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

  if (!isLocked) {
    return <DownloadView fileUrl={queryBasePath} />;
  }

  return (
    <Stack spacing={4} alignItems="center">
      <Heading as="h3" textAlign="center">
        The file is password protected
      </Heading>
      <Stack spacing={4} w={300}>
        <InputGroup>
          <Input
            focusBorderColor="green.200"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            placeholder="Password"
            type={!passwordVisible ? "password" : "text"}
          />
          <InputRightElement>
            <Button onClick={() => setPasswordVisible((p) => !p)} variant="unstyled">
              {!passwordVisible ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button
          isDisabled={!password}
          isLoading={unlockMutation.isLoading}
          onClick={() => unlockMutation.mutate({ password })}
          leftIcon={<LockIcon />}
        >
          Unlock
        </Button>
        <Link href="/" _hover={{ textDecor: "none" }}>
          <Button w="100%" leftIcon={<ArrowBackIcon />}>
            Go back
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
}
