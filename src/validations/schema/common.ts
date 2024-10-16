import { z } from "zod";

export const changePasswordSchema = z.object({
  body: z.object({
    old_password: z.string(),
    confirm_password: z.string(),
    password: z.string(),
  }),
});

export type ChangePassword = z.infer<typeof changePasswordSchema>;
