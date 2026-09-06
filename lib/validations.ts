import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(2, "Enter your full name"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });
export type SignupValues = z.infer<typeof signupSchema>;

export const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});
export type ForgotValues = z.infer<typeof forgotSchema>;

export const otpSchema = z.object({
  code: z.string().length(6, "Enter the 6-digit code"),
});
export type OtpValues = z.infer<typeof otpSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  role: z.string().min(2, "Enter your role"),
  location: z.string().optional(),
  bio: z.string().max(240, "Keep the bio under 240 characters").optional(),
});
export type ProfileValues = z.infer<typeof profileSchema>;
