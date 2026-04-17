import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SnackbarProvider } from "notistack"; // Dodaj to
import { SWRConfig } from "swr";
import { fetcher } from "./api/core";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <SWRConfig value={{
        fetcher,
        revalidateOnFocus: false,
        shouldRetryOnError: false
      }}>
        <App />
      </SWRConfig>
    </SnackbarProvider>
  </React.StrictMode>
);