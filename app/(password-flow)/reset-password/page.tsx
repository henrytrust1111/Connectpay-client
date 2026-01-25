import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = {
  title: "Forgot Password Page",
  description: "A forgot pasword inpiut form with email to reset password.",
};

export default function ResetPassword() {
  return <ResetPasswordForm />;
}
