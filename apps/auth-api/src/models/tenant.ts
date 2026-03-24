import { z } from "zod";

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Tenant = z.infer<typeof TenantSchema>;

export const CreateTenantBodySchema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
});
export type CreateTenantBody = z.infer<typeof CreateTenantBodySchema>;

export const UpdateTenantBodySchema = CreateTenantBodySchema.partial();
export type UpdateTenantBody = z.infer<typeof UpdateTenantBodySchema>;
