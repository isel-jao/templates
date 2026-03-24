import type { User } from "../../models/user.js";
import type { Tenant } from "../../models/tenant.js";
import type { Session } from "../../models/session.js";

export interface DBSchema {
  users: User[];
  tenants: Tenant[];
  sessions: Session[];
}

export const defaultData: DBSchema = {
  users: [],
  tenants: [],
  sessions: [],
};
