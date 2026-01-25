import { z } from "zod";

export const fundWalletSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .email("Email address must be a valid email")
    .min(1, "Email is required"),
  amount: z
    .number()
    .min(5, "Minimum amount is $5")
    .max(999999.99, "Maximum amount is $999,999.99"),
});

export const createCheckoutSessionSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .email("Email address must be a valid email")
    .min(1, "Email is required"),
  amount: z
    .number()
    .min(5, "Minimum amount is $5")
    .max(999999.99, "Maximum amount is $999,999.99"),
  platform: z.string().default("stripe"),
});

export const estimateCostSchema = z.object({
  assessmentSetting: z.enum(["ai-only", "ai-facial"]),
  candidates: z.number().min(1, "Number of candidates must be at least 1"),
});
