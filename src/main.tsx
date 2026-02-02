import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import Router from "@/pages/router.tsx";
import { env } from "./config/env";

if (env.VITE_NODE_ENV === "development") {
  import("react-scan").then(({ scan }) => {
    scan();
  });
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
