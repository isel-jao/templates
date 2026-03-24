import useSWR, { mutate } from "swr";
import { api } from "../lib/api";
import { useAuthStore } from "../store/auth.store";
import type { User } from "../types/user";

const fetcher = (url: string) => api.get<User>(url).then((r) => r.data);

export function useMe() {
  const { setUser } = useAuthStore();
  const { data, error, isLoading } = useSWR("/api/auth/me", fetcher, {
    onSuccess: (data) => setUser(data),
    onError: () => setUser(null),
    revalidateOnFocus: false,
  });

  return { user: data, error, isLoading };
}

export async function login(email: string, password: string) {
  const { data } = await api.post<{ user: User }>("/api/auth/login", { email, password });
  await mutate("/api/auth/me", data.user);
  return data.user;
}

export async function logout() {
  await api.post("/api/auth/logout");
  await mutate("/api/auth/me", null);
  useAuthStore.getState().logout();
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<User>("/api/auth/register", { name, email, password });
  return data;
}
