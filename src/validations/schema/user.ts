import { z } from "zod";
import { emailValidator } from "./auth";

export const createEndUserSchema = z.object({
  body: z.object({
    name: z.string(),
    referer_vendor: z.string().uuid().optional(),
    email: emailValidator,
    country: z.string(),
    // tags: z.array(z.string()),
  }),
});

export const getSingleEndUserSchema = z.object({
  params: z.object({
    end_user_id: z.string().uuid(),
  }),
});

export const listAllEndUserSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    status: z.string().optional(),
  }),
});

export const setEndUserStatusSchema = z.object({
  params: z.object({
    end_user_id: z.string().uuid(),
  }),
});

export const updateEndUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: emailValidator.optional(),
    country: z.string().optional(),
    referer_vendor: z.string().uuid().optional(),
    preferred_root_tags: z.array(z.string()).optional(),
  }),
  params: z.object({
    end_user_id: z.string().uuid(),
  }),
});

export type CreateEndUser = z.infer<typeof createEndUserSchema>;
export type UpdateEndUser = z.infer<typeof updateEndUserSchema>;
export type EndUserStatus = z.infer<typeof setEndUserStatusSchema>;
export type SingleEndUser = z.infer<typeof getSingleEndUserSchema>;
export type EndUsers = z.infer<typeof listAllEndUserSchema>;
