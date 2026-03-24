import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import type { Task } from "../../types/task";

const priorityColors = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Link to={`/tasks/${task.id}`}>
      <div className="rounded-lg bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer space-y-2">
        <p className="font-medium text-gray-900 text-sm leading-snug">{task.title}</p>
        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
        )}
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            priorityColors[task.priority]
          )}
        >
          {task.priority}
        </span>
      </div>
    </Link>
  );
}
