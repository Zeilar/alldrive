"use client";

import type { PropsWithChildren } from "react";
import { ChakraProvider, cookieStorageManager } from "@chakra-ui/react";
import { theme } from "../../styles";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export function Providers({ children }: PropsWithChildren) {
  return (
    <ChakraProvider theme={theme} colorModeManager={cookieStorageManager}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ChakraProvider>
  );
}
