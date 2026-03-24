import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootLayout } from "./components/layout/root-layout";
import { AdminLayout } from "./components/layout/admin-layout";
import { AuthGuard } from "./components/guards/auth-guard";
import { AdminGuard } from "./components/guards/admin-guard";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { ProfilePage } from "./pages/profile";
import { DashboardPage } from "./pages/admin/dashboard";
import { UsersListPage } from "./pages/admin/users/index";
import { UserDetailPage } from "./pages/admin/users/[id]";
import { TenantsListPage } from "./pages/admin/tenants/index";
import { TenantDetailPage } from "./pages/admin/tenants/[id]";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<AuthGuard />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route element={<AdminGuard />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="users" element={<UsersListPage />} />
                <Route path="users/:id" element={<UserDetailPage />} />
                <Route path="tenants" element={<TenantsListPage />} />
                <Route path="tenants/:id" element={<TenantDetailPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
