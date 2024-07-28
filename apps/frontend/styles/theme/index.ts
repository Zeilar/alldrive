import { type ThemeConfig, extendTheme, defineStyleConfig } from "@chakra-ui/react";

export const theme = extendTheme({
  components: {
    Button: defineStyleConfig({
      defaultProps: { colorScheme: "green", variant: "outline" },
    }),
  },
  config: { initialColorMode: "dark" } satisfies ThemeConfig,
  fonts: {
    heading: `"Roboto", sans-serif`,
    body: `"Roboto", sans-serif`,
  },
  styles: {
    global: {
      main: {
        height: "100svh",
        display: "flex",
        flexDirection: "column",
      },
      "::selection": {
        bgColor: "green.500",
        color: "white",
      },
      "::placeholder": {
        userSelect: "none",
      },
    },
  },
});
