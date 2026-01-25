"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/validations/auth/resetPassword";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/common-elements/form";
import { Input } from "@/components/common-elements/input";
import { Button } from "@/components/common-elements/button";
import { useRouter, useSearchParams } from "next/navigation";
import { UserResetPassword } from "@/services/auth";
import { useState, useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

export function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const token = isClient ? searchParams.get("token") : null;

  const form = useForm<ResetPasswordSchemaType>({
    mode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordSchemaType) {
    console.log("Reset password values:", values);
    
    if (!token) {
      toast.error("Invalid or missing reset token. Please use the link from your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await UserResetPassword(token, values.password);
      
      if (response.success) {
        toast.success(response.message || "Password reset successfully!");
        router.push("/login");
      } else {
        toast.error(response.message || "Failed to reset password. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (!isClient) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <>
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-white leading-relaxed">
          Please enter a new password and confirm it to reset your password.
          {!token && (
            <span className="text-red-600 block mt-1">
              Missing reset token. Please use the link from your email.
            </span>
          )}
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-6 mb-7 rounded-[10px] shadow-sm border border-gray-200 dark:border-dark-background-50 dark:bg-dark-background-200"
        >
          {/* Password Field*/}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormDescription className="text-black dark:text-white font-semibold">
                  New Password
                </FormDescription>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      {...field}
                      className={`h-[50px] pr-10 ${
                        fieldState.error ? "border-red-500" : ""
                      }`}
                      disabled={loading || !token}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormDescription className="text-black dark:text-white font-semibold">
                  Confirm Password
                </FormDescription>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      {...field}
                      className={`h-[50px] pr-10 ${
                        fieldState.error ? "border-red-500" : ""
                      }`}
                      disabled={loading || !token}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !token || !form.formState.isValid}
            className="w-full py-2 h-[52px] bg-[#4F46CA] hover:bg-[#4338CA] text-white font-semibold rounded-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="text-primary font-bold underline hover:text-primary/80"
            >
              Back to Login
            </button>
          </div>
        </form>
      </Form>
    </>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin" size={24} />
          <span className="ml-2">Loading...</span>
        </div>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}