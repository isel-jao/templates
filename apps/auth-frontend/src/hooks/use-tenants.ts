import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { api } from "../lib/api";
import type { Tenant } from "../types/user";

const fetcher = (url: string) => api.get<Tenant[]>(url).then((r) => r.data);
const fetchOne = (url: string) => api.get<Tenant>(url).then((r) => r.data);

export function useTenants() {
  return useSWR("/api/tenants", fetcher);
}

export function useTenant(id: string) {
  return useSWR(id ? `/api/tenants/${id}` : null, fetchOne);
}

export function useCreateTenant() {
  return useSWRMutation("/api/tenants", (url, { arg }: { arg: unknown }) =>
    api.post<Tenant>(url, arg).then((r) => r.data)
  );
}

export function useUpdateTenant(id: string) {
  return useSWRMutation(`/api/tenants/${id}`, (url, { arg }: { arg: unknown }) =>
    api.patch<Tenant>(url, arg).then((r) => r.data)
  );
}

export function useDeleteTenant() {
  return useSWRMutation(
    "/api/tenants",
    (_url, { arg: id }: { arg: string }) =>
      api.delete(`/api/tenants/${id}`).then((r) => r.data)
  );
}
