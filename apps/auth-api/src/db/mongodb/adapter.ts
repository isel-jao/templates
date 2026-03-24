import { MongoClient, type Collection } from "mongodb";
import { nanoid } from "nanoid";
import type {
  IDatabase,
  IUserRepository,
  ITenantRepository,
  ISessionRepository,
} from "../interface.js";
import type { User } from "../../models/user.js";
import type { Tenant } from "../../models/tenant.js";
import type { Session } from "../../models/session.js";

function toEntity<T extends { id: string }>(doc: Record<string, unknown>): T {
  const { _id, ...rest } = doc;
  return { id: _id as string, ...rest } as T;
}

class MongoUserRepository implements IUserRepository {
  constructor(private col: Collection) {}

  async findById(id: string) {
    const doc = await this.col.findOne({ _id: id as never });
    return doc ? toEntity<User>(doc as Record<string, unknown>) : null;
  }

  async findByEmail(email: string) {
    const doc = await this.col.findOne({ email });
    return doc ? toEntity<User>(doc as Record<string, unknown>) : null;
  }

  async findAll(filter?: { tenantId?: string; role?: string }) {
    const query: Record<string, string> = {};
    if (filter?.tenantId) query["tenantId"] = filter.tenantId;
    if (filter?.role) query["role"] = filter.role;
    const docs = await this.col.find(query).toArray();
    return docs.map((d) => toEntity<User>(d as Record<string, unknown>));
  }

  async create(data: Omit<User, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const id = nanoid();
    await this.col.insertOne({ _id: id as never, ...data, createdAt: now, updatedAt: now });
    return { id, ...data, createdAt: now, updatedAt: now } as User;
  }

  async update(id: string, data: Partial<Omit<User, "id" | "createdAt">>) {
    const now = new Date().toISOString();
    const result = await this.col.findOneAndUpdate(
      { _id: id as never },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: "after" }
    );
    return result ? toEntity<User>(result as Record<string, unknown>) : null;
  }

  async delete(id: string) {
    const result = await this.col.deleteOne({ _id: id as never });
    return result.deletedCount > 0;
  }
}

class MongoTenantRepository implements ITenantRepository {
  constructor(private col: Collection) {}

  async findById(id: string) {
    const doc = await this.col.findOne({ _id: id as never });
    return doc ? toEntity<Tenant>(doc as Record<string, unknown>) : null;
  }

  async findBySlug(slug: string) {
    const doc = await this.col.findOne({ slug });
    return doc ? toEntity<Tenant>(doc as Record<string, unknown>) : null;
  }

  async findAll() {
    const docs = await this.col.find({}).toArray();
    return docs.map((d) => toEntity<Tenant>(d as Record<string, unknown>));
  }

  async create(data: Omit<Tenant, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const id = nanoid();
    await this.col.insertOne({ _id: id as never, ...data, createdAt: now, updatedAt: now });
    return { id, ...data, createdAt: now, updatedAt: now } as Tenant;
  }

  async update(id: string, data: Partial<Omit<Tenant, "id" | "createdAt">>) {
    const now = new Date().toISOString();
    const result = await this.col.findOneAndUpdate(
      { _id: id as never },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: "after" }
    );
    return result ? toEntity<Tenant>(result as Record<string, unknown>) : null;
  }

  async delete(id: string) {
    const result = await this.col.deleteOne({ _id: id as never });
    return result.deletedCount > 0;
  }
}

class MongoSessionRepository implements ISessionRepository {
  constructor(private col: Collection) {}

  async findById(id: string) {
    const doc = await this.col.findOne({ _id: id as never });
    return doc ? toEntity<Session>(doc as Record<string, unknown>) : null;
  }

  async create(data: Omit<Session, "id" | "createdAt">) {
    const now = new Date().toISOString();
    const id = nanoid();
    await this.col.insertOne({ _id: id as never, ...data, createdAt: now });
    return { id, ...data, createdAt: now } as Session;
  }

  async delete(id: string) {
    const result = await this.col.deleteOne({ _id: id as never });
    return result.deletedCount > 0;
  }

  async deleteAllForUser(userId: string) {
    await this.col.deleteMany({ userId });
  }

  async deleteExpired() {
    await this.col.deleteMany({
      expiresAt: { $lt: new Date().toISOString() },
    });
  }
}

export class MongoDBAdapter implements IDatabase {
  private client!: MongoClient;
  users!: IUserRepository;
  tenants!: ITenantRepository;
  sessions!: ISessionRepository;

  constructor(
    private uri: string,
    private dbName: string
  ) {}

  async connect() {
    this.client = new MongoClient(this.uri);
    await this.client.connect();
    const db = this.client.db(this.dbName);
    this.users = new MongoUserRepository(db.collection("users"));
    this.tenants = new MongoTenantRepository(db.collection("tenants"));
    this.sessions = new MongoSessionRepository(db.collection("sessions"));
  }

  async disconnect() {
    await this.client.close();
  }
}
