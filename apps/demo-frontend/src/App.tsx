import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "./components/layout/root-layout";
import { AppLayout } from "./components/layout/app-layout";
import { AuthGuard } from "./components/guards/auth-guard";
import { LoginPage } from "./pages/login";
import { TasksListPage } from "./pages/tasks/index";
import { TaskDetailPage } from "./pages/tasks/[id]";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthGuard />}>
            <Route element={<AppLayout />}>
              <Route path="/tasks" element={<TasksListPage />} />
              <Route path="/tasks/:id" element={<TaskDetailPage />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/tasks" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
