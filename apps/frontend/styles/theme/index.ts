import { type ThemeConfig, extendTheme, defineStyleConfig } from "@chakra-ui/react";
import svg from "../../assets/svg/stacked-waves.svg";

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
        bgImg: `url(${svg})`,
        bgSize: "cover",
        bgRepeat: "no-repeat",
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
