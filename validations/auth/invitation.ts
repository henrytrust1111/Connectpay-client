import { z } from "zod";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]{8,}$/;

// Regex pattern: + followed by digits only, with optional spaces or dashes between digits
const PHONE_NUMBER_REGEX = /^\+\d+$/;

export const invitationSchema = z
  .object({
    organisationName: z.string().min(2, "Organisation name is required"),
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address")
      .transform((email) => email.trim().toLowerCase())
      .refine(
        (email) => {
          const [, domain] = email.split("@");
          const tld = domain?.split(".").pop();
          return tld && tld.length >= 2;
        },
        {
          message: "Invalid email domain",
        },
      ),
    phoneNumber: z
      .string()
      .regex(PHONE_NUMBER_REGEX, {
        message: "Phone number must start with '+' and contain only numbers",
      })
      .refine(
        (phone) => {
          const digitCount = phone.replace(/[^\d]/g, "").length;
          return digitCount >= 10; // Including country code
        },
        {
          message:
            "Phone number must have at least 10 digits (including country code)",
        },
      ),
    password: z.string().min(1, "Password is required").regex(PASSWORD_REGEX, {
      message:
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type InvitationSchemaType = z.infer<typeof invitationSchema>;
