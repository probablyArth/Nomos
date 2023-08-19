import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        fontFamily: "sans-serif",
        /** Put your mantine theme override here */
        colorScheme: "light",
        primaryColor: "dark",
      }}
    >
      <Notifications />
      <SessionProvider session={session}>
        <ReactQueryDevtools />
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>
  );
};

export default api.withTRPC(MyApp);
