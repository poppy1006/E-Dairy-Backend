import { z } from "zod";

export const updateAdminSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    role_id: z.string().uuid().optional(),
  }),
  params: z.object({
    admin_id: z.string({ required_error: "admin id is required" }).uuid(),
  }),
});

export const getAdminByIdSchema = z.object({
  params: z.object({
    admin_id: z.string({ required_error: "admin id is required" }).uuid(),
  }),
});

export type UpdateAdmin = z.infer<typeof updateAdminSchema>;
export type getAdminById = z.infer<typeof getAdminByIdSchema>;
