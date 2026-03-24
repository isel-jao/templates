import type { User } from "../models/user.js";
import type { Tenant } from "../models/tenant.js";
import type { Session } from "../models/session.js";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filter?: { tenantId?: string; role?: string }): Promise<User[]>;
  create(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  update(
    id: string,
    data: Partial<Omit<User, "id" | "createdAt">>
  ): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

export interface ITenantRepository {
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  findAll(): Promise<Tenant[]>;
  create(data: Omit<Tenant, "id" | "createdAt" | "updatedAt">): Promise<Tenant>;
  update(
    id: string,
    data: Partial<Omit<Tenant, "id" | "createdAt">>
  ): Promise<Tenant | null>;
  delete(id: string): Promise<boolean>;
}

export interface ISessionRepository {
  findById(id: string): Promise<Session | null>;
  create(data: Omit<Session, "id" | "createdAt">): Promise<Session>;
  delete(id: string): Promise<boolean>;
  deleteAllForUser(userId: string): Promise<void>;
  deleteExpired(): Promise<void>;
}

export interface IDatabase {
  users: IUserRepository;
  tenants: ITenantRepository;
  sessions: ISessionRepository;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
