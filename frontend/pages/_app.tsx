import React from "react";
import { AppProps } from "next/app";

import "../styles/index.css";
import Layout from "components/Layout";
import Nav from "components/Nav/Nav";
import Footer from "components/Footer/Footer";
import { AppProvider } from "contexts/AppProvider";
import theme from "utils/theme";
import { ThemeProvider } from "@mui/material/styles";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Layout title="Food Recommender | Study TU Graz">
          <Nav />
          <Component {...pageProps} />
          <Footer />
        </Layout>
      </AppProvider>
    </ThemeProvider>
  );
}

export default MyApp;
