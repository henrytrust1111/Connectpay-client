import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]{8,}$/;

// Regex pattern: + followed by digits only, with optional spaces or dashes between digits
const PHONE_NUMBER_REGEX = /^\+\d+$/;

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address")
      .transform((email) => email.trim().toLowerCase()),
    
    phone: z
      .string()
      .min(1, "Phone number is required"),
    
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(PASSWORD_REGEX, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;