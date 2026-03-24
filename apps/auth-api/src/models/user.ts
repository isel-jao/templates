import { z } from "zod";

export const UserRoleSchema = z.enum(["superadmin", "admin", "user"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  passwordHash: z.string(),
  role: UserRoleSchema,
  tenantId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

export const CreateUserBodySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
  role: UserRoleSchema.optional().default("user"),
  tenantId: z.string().nullable().optional(),
});
export type CreateUserBody = z.infer<typeof CreateUserBodySchema>;

export const UpdateUserBodySchema = z.object({
  name: z.string().min(1).optional(),
  role: UserRoleSchema.optional(),
  tenantId: z.string().nullable().optional(),
});
export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>;

export const LoginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type LoginBody = z.infer<typeof LoginBodySchema>;

export const UpdateMeBodySchema = z.object({
  name: z.string().min(1).optional(),
  password: z.string().min(8).optional(),
});
export type UpdateMeBody = z.infer<typeof UpdateMeBodySchema>;

export function toSafeUser(user: User): Omit<User, "passwordHash"> {
  const { passwordHash: _, ...safe } = user;
  return safe;
}
