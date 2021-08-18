import type { AppProps } from "next/app";
import Head from "next/head";
import { ContractKitProvider } from "@celo-tools/use-contractkit";
import { createClient, Provider } from "urql";
import * as Fathom from "fathom-client";

import "tailwindcss/tailwind.css";
import "@celo-tools/use-contractkit/lib/styles.css";
import "../style/global.css";
import { useRouter } from "next/router";
import { useEffect } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "churrofi-widgets-xs": any;
      "churrofi-widgets-sm": any;
      "churrofi-widgets-md": any;
      "churrofi-widgets-lg": any;
      "churrofi-widgets-xl": any;
    }
  }
}

const client = createClient({
  url: "https://celo-tool-backend.onrender.com/query",
});

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    Fathom.load(process.env.NEXT_PUBLIC_FATHOM_ID, {
      includedDomains: ["churrofi.app"],
      url: "https://wildcat.churrofi.app/script.js",
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, []);
  return (
    <div>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Jost:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/churrofi-logo.png" />
        <title>ChurroFi - Investing CELO made easy</title>
      </Head>
      <ContractKitProvider
        dapp={{
          name: "ChurroFi",
          description: "Stake your CELO",
          url: "https://churrofi.onrender.com",
        }}
      >
        <Provider value={client}>
          <div suppressHydrationWarning className="antialiased">
            {typeof window === "undefined" ? null : (
              <>
                <Component {...pageProps} />
              </>
            )}
          </div>
        </Provider>
      </ContractKitProvider>
    </div>
  );
}
export default App;
