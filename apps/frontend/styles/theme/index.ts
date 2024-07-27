import { type ThemeConfig, extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  config: { initialColorMode: "dark" } satisfies ThemeConfig,
  fonts: {
    heading: `'Roboto', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  styles: {
    global: {
      main: {
        height: "100svh",
        display: "flex",
        flexDirection: "column",
      },
    },
  },
});
