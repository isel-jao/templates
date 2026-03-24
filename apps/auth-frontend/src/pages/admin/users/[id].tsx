import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser, useUpdateUser } from "../../../hooks/use-users";
import { useTenants } from "../../../hooks/use-tenants";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { mutate } from "swr";

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useUser(id!);
  const { data: tenants } = useTenants();
  const { trigger: updateUser, isMutating } = useUpdateUser(id!);

  const [name, setName] = useState("");
  const [role, setRole] = useState<"superadmin" | "admin" | "user">("user");
  const [tenantId, setTenantId] = useState<string>("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRole(user.role);
      setTenantId(user.tenantId ?? "");
    }
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    await updateUser({ name, role, tenantId: tenantId || null });
    await mutate(`/api/users/${id}`);
    await mutate((key: string) => typeof key === "string" && key.startsWith("/api/users"));
    setSuccess(true);
  }

  if (isLoading) return <p className="text-gray-500">Loading…</p>;
  if (!user) return <p className="text-red-600">User not found</p>;

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/users")}>← Back</Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
      </div>

      <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Email" value={user.email} disabled />
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Tenant</label>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">— No tenant —</option>
              {tenants?.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          {success && <p className="text-sm text-green-600">Saved</p>}
          <Button type="submit" disabled={isMutating}>
            {isMutating ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
