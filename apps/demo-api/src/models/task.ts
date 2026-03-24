import { z } from "zod";

export const TaskStatusSchema = z.enum(["todo", "in_progress", "done"]);
export const TaskPrioritySchema = z.enum(["low", "medium", "high"]);

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  userId: z.string(),
  tenantId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Task = z.infer<typeof TaskSchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;

export const CreateTaskBodySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().nullable().optional().default(null),
  status: TaskStatusSchema.optional().default("todo"),
  priority: TaskPrioritySchema.optional().default("medium"),
});
export type CreateTaskBody = z.infer<typeof CreateTaskBodySchema>;

export const UpdateTaskBodySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
});
export type UpdateTaskBody = z.infer<typeof UpdateTaskBodySchema>;
