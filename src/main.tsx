import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

fetch("/config.json")
  .then((res) => res.json())
  .then((config) => {
    (window as any)._env_ = config; // store config globally
    createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  })
  .catch((err) => console.error("Failed to load config.json", err));
