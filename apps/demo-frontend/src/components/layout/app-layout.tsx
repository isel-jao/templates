import { Outlet } from "react-router-dom";
import { logout } from "../../hooks/use-auth";
import { useAuthStore } from "../../store/auth.store";

export function AppLayout() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Tasks</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <button
            onClick={() => logout()}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="px-6 py-8 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
