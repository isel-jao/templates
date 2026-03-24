import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTask, useUpdateTask, useDeleteTask } from "../../hooks/use-tasks";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import type { TaskStatus, TaskPriority } from "../../types/task";
import { mutate } from "swr";
import { cn } from "../../lib/utils";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const priorityColors = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading } = useTask(id!);
  const { trigger: updateTask, isMutating } = useUpdateTask(id!);
  const { trigger: deleteTask } = useDeleteTask();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function startEdit() {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description ?? "");
    setEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await updateTask({ title, description: description || null });
    await mutate(`/api/tasks/${id}`);
    await mutate("/api/tasks");
    setEditing(false);
  }

  async function handleStatusChange(status: TaskStatus) {
    await updateTask({ status });
    await mutate(`/api/tasks/${id}`);
    await mutate("/api/tasks");
  }

  async function handleDelete() {
    if (!confirm("Delete this task?")) return;
    await deleteTask(id!);
    await mutate("/api/tasks");
    navigate("/tasks");
  }

  if (isLoading) return <p className="text-gray-500">Loading…</p>;
  if (!task) return <p className="text-red-600">Task not found</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate("/tasks")}>← Back</Button>
      </div>

      <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isMutating}>{isMutating ? "Saving…" : "Save"}</Button>
              <Button variant="secondary" type="button" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={startEdit}>Edit</Button>
                <Button size="sm" variant="danger" onClick={handleDelete}>Delete</Button>
              </div>
            </div>
            {task.description && (
              <p className="text-gray-600 text-sm">{task.description}</p>
            )}
            <div className="flex items-center gap-3">
              <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", priorityColors[task.priority])}>
                {task.priority}
              </span>
              <span className="text-xs text-gray-400">{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </>
        )}

        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                disabled={task.status === opt.value}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  task.status === opt.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
