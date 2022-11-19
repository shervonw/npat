import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { AppContextProvider } from "../src/app.context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Name, Place, Animal, Thing | Online Multiplayer Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </AppContextProvider>
  );
}

export default MyApp;
