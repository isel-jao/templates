import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { demoApi } from "../lib/api";
import type { Task, TaskStatus, TaskPriority } from "../types/task";

const fetcher = (url: string) => demoApi.get<Task[]>(url).then((r) => r.data);
const fetchOne = (url: string) => demoApi.get<Task>(url).then((r) => r.data);

export function useTasks(filter?: { status?: TaskStatus; priority?: TaskPriority }) {
  const params = new URLSearchParams(
    Object.fromEntries(Object.entries(filter ?? {}).filter(([, v]) => v != null)) as Record<string, string>
  ).toString();
  const key = `/api/tasks${params ? `?${params}` : ""}`;
  return useSWR(key, fetcher);
}

export function useTask(id: string) {
  return useSWR(id ? `/api/tasks/${id}` : null, fetchOne);
}

export function useCreateTask() {
  return useSWRMutation("/api/tasks", (url, { arg }: { arg: unknown }) =>
    demoApi.post<Task>(url, arg).then((r) => r.data)
  );
}

export function useUpdateTask(id: string) {
  return useSWRMutation(`/api/tasks/${id}`, (url, { arg }: { arg: unknown }) =>
    demoApi.patch<Task>(url, arg).then((r) => r.data)
  );
}

export function useDeleteTask() {
  return useSWRMutation(
    "/api/tasks",
    (_url, { arg: id }: { arg: string }) =>
      demoApi.delete(`/api/tasks/${id}`).then((r) => r.data)
  );
}
