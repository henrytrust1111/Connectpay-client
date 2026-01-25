import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]{8,}$/;

export const organizationNameSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
});

export const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const phoneSchema = z.object({
  phone: z.string().min(10, "Enter a valid phone number"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(PASSWORD_REGEX, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)"
      }),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

export const domainSchema = z.object({
  title: z.string().min(2, "Domain title is required"),
  url: z
    .string()
    .min(1, "Domain URL is required")
    .transform((url) => {
      let cleaned = url.trim();
      // Remove protocol and trailing slash
      cleaned = cleaned.replace(/^(https?:\/\/)/, '');
      cleaned = cleaned.replace(/\/$/, '');
      return cleaned;
    })
    .refine((url) => {
      // Check basic domain format
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;
      return domainRegex.test(url);
    }, {
      message: "Enter a valid domain (e.g., example.com)"
    })
    .refine((url) => {
      // Additional validation from signup schema
      return !['localhost', 'example', 'test'].some(
        blocked => url.includes(blocked)
      ) && url.length >= 4;
    }, {
      message: "Please enter a valid public domain name"
    })
});

export type OrganizationNameSchemaType = z.infer<typeof organizationNameSchema>;
export type EmailSchemaType = z.infer<typeof emailSchema>;
export type PhoneSchemaType = z.infer<typeof phoneSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type DomainSchemaType = z.infer<typeof domainSchema>;