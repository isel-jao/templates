import { useState } from "react";
import { Link } from "react-router-dom";
import { useTenants, useCreateTenant, useDeleteTenant } from "../../../hooks/use-tenants";
import { Button } from "../../../components/ui/button";
import { Modal } from "../../../components/ui/modal";
import { Input } from "../../../components/ui/input";
import { mutate } from "swr";

export function TenantsListPage() {
  const { data: tenants, isLoading } = useTenants();
  const { trigger: createTenant, isMutating: isCreating } = useCreateTenant();
  const { trigger: deleteTenant } = useDeleteTenant();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createTenant({ name: newName, slug: newSlug });
    await mutate("/api/tenants");
    setShowCreate(false);
    setNewName("");
    setNewSlug("");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tenant?")) return;
    setDeletingId(id);
    try {
      await deleteTenant(id);
      await mutate("/api/tenants");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
        <Button onClick={() => setShowCreate(true)}>New tenant</Button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Slug", "Created", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tenants?.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{tenant.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{tenant.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(tenant.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link to={`/admin/tenants/${tenant.id}`}>
                      <Button size="sm" variant="secondary">Edit</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(tenant.id)}
                      disabled={deletingId === tenant.id}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <Modal title="New Tenant" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Input
              label="Slug"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="my-tenant"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit" disabled={isCreating}>{isCreating ? "Creating…" : "Create"}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
