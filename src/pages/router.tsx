import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import LoadingPage from "@/pages/loading";
import { env } from "@/config/env";

const GlobalLayout = lazy(() => import("@/pages/layout"));
const LoginPage = lazy(() => import("@/pages/public/login"));
const HomePage = lazy(() => import("@/pages/private/home"));
const PrivateLayout = lazy(() => import("@/pages/private/layout"));
const NotFoundPage = lazy(() => import("@/pages/public/not-found"));
const DevPage = lazy(() => import("@/pages/public/dev"));

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route element={<GlobalLayout />}>
            <Route element={<PrivateLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
            {env.VITE_NODE_ENV === "development" && (
              <Route path="/dev" element={<DevPage />} />
            )}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
