import useSWR, { mutate } from "swr";
import { demoApi, authApi } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import type { User } from "../types/task";

const fetcher = (url: string) => demoApi.get<User>(url).then((r) => r.data);

export function useMe() {
  const { setUser } = useAuthStore();
  const { data, error, isLoading } = useSWR("/api/me", fetcher, {
    onSuccess: (data) => setUser(data),
    onError: () => setUser(null),
    revalidateOnFocus: false,
  });

  return { user: data, error, isLoading };
}

export async function login(email: string, password: string) {
  await authApi.post("/api/auth/login", { email, password });
  const { data } = await demoApi.get<User>("/api/me");
  await mutate("/api/me", data);
  return data;
}

export async function logout() {
  await authApi.post("/api/auth/logout");
  await mutate("/api/me", null);
  useAuthStore.getState().logout();
}
