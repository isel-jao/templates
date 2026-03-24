import { useState } from "react";
import { Link } from "react-router-dom";
import { useUsers, useDeleteUser } from "../../../hooks/use-users";
import { Button } from "../../../components/ui/button";
import { RoleBadge } from "../../../components/ui/badge";
import { mutate } from "swr";

export function UsersListPage() {
  const { data: users, isLoading } = useUsers();
  const { trigger: deleteUser } = useDeleteUser();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    setDeletingId(id);
    try {
      await deleteUser(id);
      await mutate((key: string) => typeof key === "string" && key.startsWith("/api/users"));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="rounded-lg bg-white border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Email", "Role", "Tenant", "Created", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.tenantId ?? "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link to={`/admin/users/${user.id}`}>
                      <Button size="sm" variant="secondary">Edit</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
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
    </div>
  );
}
