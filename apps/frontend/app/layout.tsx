import type { PropsWithChildren } from "react";
import { Providers } from "../components";
import { roboto } from "../styles";

export const metadata = {
  title: "Welcome to alldrive",
  description: "Generated by create-nx-workspace",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={roboto.variable}
      data-theme="dark"
      style={{ colorScheme: "dark" }}
    >
      <body>
        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
