import { useUsers } from "../../hooks/use-users";
import { useTenants } from "../../hooks/use-tenants";

export function DashboardPage() {
  const { data: users } = useUsers();
  const { data: tenants } = useTenants();

  const stats = [
    { label: "Total Users", value: users?.length ?? "…" },
    { label: "Total Tenants", value: tenants?.length ?? "…" },
    { label: "Admins", value: users?.filter((u) => u.role === "admin" || u.role === "superadmin").length ?? "…" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
