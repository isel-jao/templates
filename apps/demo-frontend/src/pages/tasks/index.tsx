import { useState } from "react";
import { useTasks, useCreateTask } from "../../hooks/use-tasks";
import { TaskCard } from "../../components/ui/task-card";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import { Input } from "../../components/ui/input";
import type { TaskStatus, TaskPriority } from "../../types/task";
import { mutate } from "swr";

const COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export function TasksListPage() {
  const { data: tasks, isLoading } = useTasks();
  const { trigger: createTask, isMutating } = useCreateTask();

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    await createTask({ title, description: description || null, priority });
    await mutate("/api/tasks");
    setShowCreate(false);
    setTitle("");
    setDescription("");
    setPriority("medium");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <Button onClick={() => setShowCreate(true)}>New task</Button>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {COLUMNS.map((col) => (
            <div key={col.key}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="font-semibold text-gray-700">{col.label}</h2>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                  {tasks?.filter((t) => t.status === col.key).length ?? 0}
                </span>
              </div>
              <div className="space-y-3">
                {tasks
                  ?.filter((t) => t.status === col.key)
                  .map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="New Task" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
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
                rows={3}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isMutating}>
                {isMutating ? "Creating…" : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
