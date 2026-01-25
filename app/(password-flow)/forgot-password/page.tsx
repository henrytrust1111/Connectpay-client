import { ForgotPasswordForm } from "@/components/auth/forget-password-form";

export const metadata = {
  title: "Forgot Password Page",
  description: "A forgot pasword inpiut form with email to reset password.",
};

export default function ForgotPassword() {
  return <ForgotPasswordForm />;
}
