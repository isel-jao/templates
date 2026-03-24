import bcrypt from "bcryptjs";
import { createDatabase } from "./db/factory.js";

const db = createDatabase();

async function seed() {
  await db.connect();

  const tenant = await db.tenants.findBySlug("acme");
  const existingTenant =
    tenant ?? (await db.tenants.create({ name: "Acme Corp", slug: "acme" }));

  const users = [
    {
      email: "superadmin@example.com",
      name: "Super Admin",
      password: "password",
      role: "superadmin" as const,
      tenantId: null,
    },
    {
      email: "admin@example.com",
      name: "Admin",
      password: "password",
      role: "admin" as const,
      tenantId: existingTenant.id,
    },
    {
      email: "user@example.com",
      name: "Regular User",
      password: "password",
      role: "user" as const,
      tenantId: existingTenant.id,
    },
  ];

  for (const { email, name, password, role, tenantId } of users) {
    const existing = await db.users.findByEmail(email);
    if (existing) {
      console.log(`  skip  ${email} (already exists)`);
      continue;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await db.users.create({ email, name, passwordHash, role, tenantId });
    console.log(`  created ${role.padEnd(12)} ${email}`);
  }

  await db.disconnect();
  console.log("Seed complete.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
