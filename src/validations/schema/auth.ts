import { z } from "zod";

// AUTH VALIDATORS //
export const emailValidator = z
  .string({
    required_error: "Email is required",
    invalid_type_error: "Email should be a string",
  })
  .email("Invalid email");

const passwordValidator = z.string();
// .min(8, "Password must contain a minimum of 8 characters")
// .max(20, "Password should not contain more than 20 characters");

const otpValidator = z.string().min(1, "Enter the otp");

// AUTH SCHEMAS //
export const signInSchema = z.object({
  body: z.object({
    email: emailValidator,
    password: passwordValidator,
  }),
});

export const signUpSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: emailValidator,
    password: passwordValidator.optional(),
    confirm_password: passwordValidator.optional(),
    role_id: z.string().uuid().optional(),
  }),
});

export const verifyAccountSchema = z.object({
  body: z.object({
    email: emailValidator,
    otp: otpValidator,
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: emailValidator,
    password: passwordValidator,
    otp: otpValidator,
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({ email: emailValidator }),
});

export const verifyOTPSchema = z.object({
  body: z.object({ email: emailValidator, otp: otpValidator }),
});

// TYPES //
export type SignUp = z.infer<typeof signUpSchema>;
export type SignIn = z.infer<typeof signInSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type VerifyOTP = z.infer<typeof verifyOTPSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type VerifyAccount = z.infer<typeof verifyAccountSchema>;
