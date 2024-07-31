import "@/styles/globals.css";
import { AppContextProvider } from "../contexts/AppContext"
import React, { useEffect, useState } from 'react';
import 'keen-slider/keen-slider.min.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function App({ Component, pageProps }) {
  return (
  <AppContextProvider>
    <ToastContainer
          theme="light"
          position="top-right"
          autoClose={4000}
          closeOnClick
          pauseOnHover={false}
        /> 
    <Component {...pageProps} />
  </AppContextProvider>
  );
}
