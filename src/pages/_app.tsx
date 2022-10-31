// src/pages/_app.tsx
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import type { AppRouter } from "../server/router";
import "../styles/globals.css";
import "../styles/base.css";
import { RecoilRoot, useRecoilState } from "recoil";
import Layout from "./Components/Layout";
import { userState } from "../libs/atoms";
import React, { useEffect } from "react";

const Wrapper = ({children}: React.PropsWithChildren) => {
  const [, setUser] = useRecoilState(userState);

  const fetchUser = async () => {
    const request = await fetch("/api/auth/user", {
      method: "POST"
    });

    const response = await request.json();

    setUser(() =>response.user);
  }

  useEffect(() => {
    fetchUser();
  });
  return <Layout>{children}</Layout>
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return <RecoilRoot><Wrapper><Component {...pageProps} /></Wrapper></RecoilRoot>
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({ url }),
      ],
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
