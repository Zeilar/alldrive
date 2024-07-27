"use client";

import { API_GLOBAL_PREFIX, MAX_DB_SIZE, MAX_EXPIRATION } from "@alldrive/config";
import {
  Box,
  type BoxProps,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  useToast,
  type StackProps,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "react-query";
import z from "zod";
import axios from "axios";
import humanizeDuration from "humanize-duration";
import { CheckIcon, DownloadIcon, NotAllowedIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { sizeFormatter } from "human-readable";

interface DropzoneProps {
  apiHost: string;
}

const formatSize = sizeFormatter();

const fileBoxProps: BoxProps = {
  wordBreak: "break-word",
  rounded: "md",
  px: 4,
  py: 2,
  gap: 2,
  border: "2px solid",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const fileBoxContainerProps: StackProps = {
  spacing: 2,
  maxH: "calc(350px - var(--chakra-space-8))",
  overflowY: "auto",
};

export function Dropzone({ apiHost }: DropzoneProps) {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [expires, setExpires] = useState<number>(MAX_EXPIRATION / 2);
  const [progress, setProgress] = useState<number | null>(null);
  const toast = useToast({ position: "top", variant: "top-accent" });
  const { push } = useRouter();
  const [password, setPassword] = useState<string>("");
  const { getRootProps, getInputProps, acceptedFiles, fileRejections, isDragAccept, isDragReject } =
    useDropzone({
      maxSize: MAX_DB_SIZE / 5, // No file can be larger than 1/5 of the maximum allowed database size.
    });
  const borderColor = useMemo<BoxProps["borderColor"]>(() => {
    switch (true) {
      case acceptedFiles.length > 0:
      case isDragAccept:
        return "green.500";
      case isDragReject:
        return "red.500";
      default:
        return "gray.500";
    }
  }, [isDragAccept, isDragReject, acceptedFiles.length]);
  const uploadMutation = useMutation("upload", async () => {
    if (acceptedFiles.length === 0) {
      return;
    }
    const formData = new FormData();
    acceptedFiles.forEach((acceptedFile) => {
      formData.append("files[]", acceptedFile);
    });
    formData.append("expires", `${expires}`);
    if (password) {
      formData.append("password", password);
    }
    try {
      const { data } = await axios.post(`${apiHost}/${API_GLOBAL_PREFIX}/files`, formData, {
        onUploadProgress: ({ loaded, total, lengthComputable }) => {
          if (!total || !lengthComputable) {
            setProgress(null);
            return;
          }
          setProgress((loaded / total) * 100);
        },
      });
      const { externalId } = z.object({ externalId: z.string().min(1) }).parse(data);
      let newUrl = `/${externalId}`;
      if (password) {
        newUrl = `${newUrl}?password=${password}`;
      }
      push(newUrl);
    } catch (error) {
      console.error(error);
      toast({ status: "error", title: "Upload failed" });
    }
  });

  if (uploadMutation.isLoading) {
    return (
      <Stack spacing={4}>
        <Heading as="h1">Preparing your files</Heading>
        <Progress
          isIndeterminate={progress == null}
          colorScheme="green"
          value={progress ?? undefined}
          hasStripe
          isAnimated
        />
      </Stack>
    );
  }

  return (
    <Stack spacing={4} width={600}>
      <Stack spacing={2} textAlign="center" mb={4}>
        <Heading as="h1" color="green.300">
          AllDrive
        </Heading>
        <Heading as="h5" size="md" lineHeight={1.35}>
          Your temporary cloud, forget email complications!
          <br />
          Free of charge, no caveats attached!
        </Heading>
      </Stack>
      <Alert status="info" rounded="md" border="1px solid" borderColor="var(--alert-fg)">
        <AlertIcon />
        <Text>
          Each file cannot be larger than {String(formatSize(MAX_DB_SIZE / 5))}, and the combined
          size cannot exceed {String(formatSize(MAX_DB_SIZE))}.
        </Text>
      </Alert>
      <Flex
        {...getRootProps()}
        cursor={acceptedFiles.length === 0 && fileRejections.length === 0 ? "pointer" : "auto"}
        justifyContent="center"
        alignItems="center"
        border="2px dashed"
        borderColor={borderColor}
        height={350}
        mb={4}
      >
        <input {...getInputProps()} />
        {acceptedFiles.length === 0 && fileRejections.length === 0 && (
          <Heading as="h5" m="auto">
            Drop your files here
          </Heading>
        )}
        {(acceptedFiles.length > 0 || fileRejections.length > 0) && (
          <Grid
            gap={2}
            gridTemplateColumns="1fr 1px 1fr"
            h="100%"
            w="100%"
            alignItems="flex-start"
            p={4}
          >
            <Stack
              {...fileBoxContainerProps}
              pr={2}
              sx={{
                scrollbarWidth: "thin",
                scrollbarColor: "var(--chakra-colors-green-500) var(--chakra-colors-gray-700)",
              }}
            >
              {acceptedFiles.map(({ name }, i) => (
                <Box
                  key={`${name}-${i}`}
                  {...fileBoxProps}
                  bgColor="green.700"
                  borderColor="green.500"
                >
                  <Text>{name}</Text>
                  <CheckIcon color="green.200" />
                </Box>
              ))}
            </Stack>
            <Box h="100%" w="1px" bgColor="var(--chakra-colors-chakra-border-color)" />
            <Stack
              {...fileBoxContainerProps}
              ml={2}
              pr={2}
              mr={-2}
              sx={{
                scrollbarWidth: "thin",
                scrollbarColor: "var(--chakra-colors-red-500) var(--chakra-colors-gray-700)",
              }}
            >
              {fileRejections.map(({ file }, i) => (
                <Box
                  key={`${file.name}-${i}`}
                  {...fileBoxProps}
                  bgColor="red.700"
                  borderColor="red.500"
                >
                  <Text>{file.name}</Text>
                  <NotAllowedIcon color="red.200" />
                </Box>
              ))}
            </Stack>
          </Grid>
        )}
      </Flex>
      <Box>
        <Box textAlign="center" w={200} m="auto">
          {humanizeDuration(expires)}
        </Box>
        <Slider
          colorScheme="green"
          value={expires}
          min={MAX_EXPIRATION / 30}
          max={MAX_EXPIRATION}
          step={MAX_EXPIRATION / 30}
          onChange={setExpires}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
      <InputGroup>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
          placeholder="Password (optional)"
          type={!passwordVisible ? "password" : "text"}
        />
        <InputRightElement>
          <Button onClick={() => setPasswordVisible((p) => !p)} variant="unstyled">
            {!passwordVisible ? <ViewIcon /> : <ViewOffIcon />}
          </Button>
        </InputRightElement>
      </InputGroup>
      <Button
        onClick={() => uploadMutation.mutate()}
        isLoading={uploadMutation.isLoading}
        leftIcon={<DownloadIcon style={{ rotate: "180deg" }} />} // For some reason only style tag works for rotation
      >
        Upload
      </Button>
    </Stack>
  );
}
