import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/authContext.tsx";
import { BrowserRouter } from "react-router-dom";
import { CarProvider } from "./context/carContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CarProvider>
          <App />
        </CarProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
