import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";
import type { Task, TaskStatus, TaskPriority } from "../models/task.js";

interface DBSchema {
  tasks: Task[];
}

const defaultData: DBSchema = { tasks: [] };

export class TaskRepository {
  private db!: Low<DBSchema>;

  constructor(private filePath: string) {}

  async connect() {
    mkdirSync(dirname(this.filePath), { recursive: true });

    const adapter = new JSONFile<DBSchema>(this.filePath);
    this.db = new Low<DBSchema>(adapter, defaultData);
    await this.db.read();
  }

  async findAll(filter: {
    userId: string;
    status?: string;
    priority?: string;
  }): Promise<Task[]> {
    let tasks = this.db.data.tasks.filter((t) => t.userId === filter.userId);
    if (filter.status) tasks = tasks.filter((t) => t.status === filter.status);
    if (filter.priority) tasks = tasks.filter((t) => t.priority === filter.priority);
    return tasks;
  }

  async findById(id: string): Promise<Task | null> {
    return this.db.data.tasks.find((t) => t.id === id) ?? null;
  }

  async create(data: {
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    userId: string;
    tenantId: string | null;
  }): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = { ...data, id: nanoid(), createdAt: now, updatedAt: now };
    this.db.data.tasks.push(task);
    await this.db.write();
    return task;
  }

  async update(id: string, data: Partial<Omit<Task, "id" | "userId" | "createdAt">>): Promise<Task | null> {
    const idx = this.db.data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.db.data.tasks[idx] = {
      ...this.db.data.tasks[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await this.db.write();
    return this.db.data.tasks[idx];
  }

  async delete(id: string): Promise<boolean> {
    const before = this.db.data.tasks.length;
    this.db.data.tasks = this.db.data.tasks.filter((t) => t.id !== id);
    await this.db.write();
    return this.db.data.tasks.length < before;
  }

  async disconnect() {
    await this.db.write();
  }
}
