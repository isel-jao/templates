import { z } from "zod";

export const SessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  tenantId: z.string().nullable(),
  userRole: z.string(),
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});
export type Session = z.infer<typeof SessionSchema>;
