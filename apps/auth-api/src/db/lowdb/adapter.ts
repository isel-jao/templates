import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";
import type {
  IDatabase,
  IUserRepository,
  ITenantRepository,
  ISessionRepository,
} from "../interface.js";
import { defaultData, type DBSchema } from "./schema.js";
import type { User } from "../../models/user.js";
import type { Tenant } from "../../models/tenant.js";
import type { Session } from "../../models/session.js";

class LowDBUserRepository implements IUserRepository {
  constructor(private db: Low<DBSchema>) {}

  async findById(id: string) {
    return this.db.data.users.find((u) => u.id === id) ?? null;
  }

  async findByEmail(email: string) {
    return this.db.data.users.find((u) => u.email === email) ?? null;
  }

  async findAll(filter?: { tenantId?: string; role?: string }) {
    let users = [...this.db.data.users];
    if (filter?.tenantId) users = users.filter((u) => u.tenantId === filter.tenantId);
    if (filter?.role) users = users.filter((u) => u.role === filter.role);
    return users;
  }

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const user: User = { ...data, id: nanoid(), createdAt: now, updatedAt: now };
    this.db.data.users.push(user);
    await this.db.write();
    return user;
  }

  async update(id: string, data: Partial<Omit<User, "id" | "createdAt">>) {
    const idx = this.db.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.db.data.users[idx] = {
      ...this.db.data.users[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await this.db.write();
    return this.db.data.users[idx];
  }

  async delete(id: string) {
    const before = this.db.data.users.length;
    this.db.data.users = this.db.data.users.filter((u) => u.id !== id);
    await this.db.write();
    return this.db.data.users.length < before;
  }
}

class LowDBTenantRepository implements ITenantRepository {
  constructor(private db: Low<DBSchema>) {}

  async findById(id: string) {
    return this.db.data.tenants.find((t) => t.id === id) ?? null;
  }

  async findBySlug(slug: string) {
    return this.db.data.tenants.find((t) => t.slug === slug) ?? null;
  }

  async findAll() {
    return [...this.db.data.tenants];
  }

  async create(data: Omit<Tenant, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const tenant: Tenant = { ...data, id: nanoid(), createdAt: now, updatedAt: now };
    this.db.data.tenants.push(tenant);
    await this.db.write();
    return tenant;
  }

  async update(id: string, data: Partial<Omit<Tenant, "id" | "createdAt">>) {
    const idx = this.db.data.tenants.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.db.data.tenants[idx] = {
      ...this.db.data.tenants[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await this.db.write();
    return this.db.data.tenants[idx];
  }

  async delete(id: string) {
    const before = this.db.data.tenants.length;
    this.db.data.tenants = this.db.data.tenants.filter((t) => t.id !== id);
    await this.db.write();
    return this.db.data.tenants.length < before;
  }
}

class LowDBSessionRepository implements ISessionRepository {
  constructor(private db: Low<DBSchema>) {}

  async findById(id: string) {
    return this.db.data.sessions.find((s) => s.id === id) ?? null;
  }

  async create(data: Omit<Session, "id" | "createdAt">) {
    const now = new Date().toISOString();
    const session: Session = { ...data, id: nanoid(), createdAt: now };
    this.db.data.sessions.push(session);
    await this.db.write();
    return session;
  }

  async delete(id: string) {
    const before = this.db.data.sessions.length;
    this.db.data.sessions = this.db.data.sessions.filter((s) => s.id !== id);
    await this.db.write();
    return this.db.data.sessions.length < before;
  }

  async deleteAllForUser(userId: string) {
    this.db.data.sessions = this.db.data.sessions.filter(
      (s) => s.userId !== userId
    );
    await this.db.write();
  }

  async deleteExpired() {
    const now = new Date();
    this.db.data.sessions = this.db.data.sessions.filter(
      (s) => new Date(s.expiresAt) > now
    );
    await this.db.write();
  }
}

export class LowDBAdapter implements IDatabase {
  private db!: Low<DBSchema>;
  users!: IUserRepository;
  tenants!: ITenantRepository;
  sessions!: ISessionRepository;

  constructor(private filePath: string) {}

  async connect() {
    mkdirSync(dirname(this.filePath), { recursive: true });

    const adapter = new JSONFile<DBSchema>(this.filePath);
    this.db = new Low<DBSchema>(adapter, defaultData);
    await this.db.read();

    this.users = new LowDBUserRepository(this.db);
    this.tenants = new LowDBTenantRepository(this.db);
    this.sessions = new LowDBSessionRepository(this.db);
  }

  async disconnect() {
    await this.db.write();
  }
}
