import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import { logout } from "../hooks/use-auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { RoleBadge } from "../components/ui/badge";
import { mutate } from "swr";

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(8).optional().or(z.literal("")),
});

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name ?? "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; password?: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const updates: Record<string, string> = {};
    if (name !== user?.name) updates.name = name;
    if (password) updates.password = password;

    const result = UpdateSchema.safeParse(updates);
    if (!result.success) {
      const fe = result.error.flatten().fieldErrors;
      setErrors({ name: fe.name?.[0], password: fe.password?.[0] });
      return;
    }

    if (Object.keys(updates).length === 0) return;

    setLoading(true);
    try {
      await api.patch("/api/auth/me", updates);
      await mutate("/api/auth/me");
      setPassword("");
      setSuccess(true);
    } catch {
      setErrors({ name: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="mx-auto mt-12 w-full max-w-md px-4">
        <div className="rounded-lg bg-white p-8 shadow-sm border border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <div className="flex items-center gap-3">
              <RoleBadge role={user.role} />
              {(user.role === "admin" || user.role === "superadmin") && (
                <Link to="/admin/dashboard" className="text-sm text-blue-600 hover:underline">
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Input
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Leave blank to keep current"
            />
            {success && <p className="text-sm text-green-600">Profile updated</p>}
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving…" : "Save changes"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => logout()}>
                Sign out
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
