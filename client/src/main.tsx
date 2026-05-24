import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./lib/theme";

import { AuthProvider } from "./pages/signin/lib/auth"; // to be changed

import { JobsProvider } from "../src/pages/jobs/services/job-context"; // to be changed
import App from "./App";
import { ToastProvider } from "./hooks/useToast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <JobsProvider>
            <ToastProvider>
            <App />
            </ToastProvider>
          </JobsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
