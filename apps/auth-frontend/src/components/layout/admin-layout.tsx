import { NavLink, Outlet } from "react-router-dom";
import { logout } from "../../hooks/use-auth";
import { useAuthStore } from "../../store/auth.store";

const navLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/tenants", label: "Tenants" },
];

export function AdminLayout() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 bg-white shadow-sm flex flex-col">
        <div className="px-6 py-5 border-b">
          <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t">
          <button
            onClick={() => logout()}
            className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
