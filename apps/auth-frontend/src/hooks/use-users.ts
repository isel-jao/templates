import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { api } from "../lib/api";
import type { User } from "../types/user";

const fetcher = (url: string) => api.get<User[]>(url).then((r) => r.data);
const fetchOne = (url: string) => api.get<User>(url).then((r) => r.data);

export function useUsers(filter?: { tenantId?: string; role?: string }) {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filter ?? {}).filter(([, v]) => v != null)) as Record<string, string>
  ).toString();
  const key = `/api/users${params ? `?${params}` : ""}`;
  return useSWR(key, fetcher);
}

export function useUser(id: string) {
  return useSWR(id ? `/api/users/${id}` : null, fetchOne);
}

export function useCreateUser() {
  return useSWRMutation("/api/users", (url, { arg }: { arg: unknown }) =>
    api.post<User>(url, arg).then((r) => r.data)
  );
}

export function useUpdateUser(id: string) {
  return useSWRMutation(`/api/users/${id}`, (url, { arg }: { arg: unknown }) =>
    api.patch<User>(url, arg).then((r) => r.data)
  );
}

export function useDeleteUser() {
  return useSWRMutation(
    "/api/users",
    (_url, { arg: id }: { arg: string }) =>
      api.delete(`/api/users/${id}`).then((r) => r.data)
  );
}
