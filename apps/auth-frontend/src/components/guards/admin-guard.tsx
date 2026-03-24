import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";

export function AdminGuard() {
  const { user } = useAuthStore();

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
