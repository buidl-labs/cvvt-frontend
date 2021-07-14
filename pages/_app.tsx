import type { AppProps } from "next/app";
import Head from "next/head";
import { ContractKitProvider } from "@celo-tools/use-contractkit";
import { createClient, Provider } from "urql";
import "tailwindcss/tailwind.css";
import "@celo-tools/use-contractkit/lib/styles.css";
import "../style/global.css";

const client = createClient({
  url: "https://celo-tool-backend.onrender.com/query",
});

function MyApp({ Component, pageProps }: AppProps) {
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
      </Head>
      <ContractKitProvider
        dapp={{
          name: "ChurroFi",
          description: "Stake your CELO",
          url: "https://churrofi.onrender.com",
        }}
      >
        <Provider value={client}>
          <div suppressHydrationWarning>
            {typeof window === "undefined" ? null : (
              <Component {...pageProps} />
            )}
          </div>
        </Provider>
      </ContractKitProvider>
    </div>
  );
}
export default MyApp;
