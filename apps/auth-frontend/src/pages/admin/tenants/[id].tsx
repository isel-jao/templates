import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTenant, useUpdateTenant } from "../../../hooks/use-tenants";
import { useUsers } from "../../../hooks/use-users";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { RoleBadge } from "../../../components/ui/badge";
import { mutate } from "swr";

export function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tenant, isLoading } = useTenant(id!);
  const { data: tenantUsers } = useUsers({ tenantId: id });
  const { trigger: updateTenant, isMutating } = useUpdateTenant(id!);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name);
      setSlug(tenant.slug);
    }
  }, [tenant]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    await updateTenant({ name, slug });
    await mutate(`/api/tenants/${id}`);
    await mutate("/api/tenants");
    setSuccess(true);
  }

  if (isLoading) return <p className="text-gray-500">Loading…</p>;
  if (!tenant) return <p className="text-red-600">Tenant not found</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/admin/tenants")}>← Back</Button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Tenant</h1>
      </div>

      <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
          />
          {success && <p className="text-sm text-green-600">Saved</p>}
          <Button type="submit" disabled={isMutating}>
            {isMutating ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </div>

      <div className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-900">Users in this tenant</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Email", "Role"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tenantUsers?.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
