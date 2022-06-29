import "../styles/globals.css";
import "../extends";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Layout } from "../components";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Flemik - Software de análisis clínicos</title>
        <meta
          name="description"
          content="Flemik - Software de análisis clínicos"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
