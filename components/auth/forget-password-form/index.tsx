"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/validations/auth/forgetpassword";
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
import Link from "next/link";
import { UserForgotPassword } from "@/services/auth";
import toast from "react-hot-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { EAppRoutes } from "@/enums";

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordSchemaType) {
    // console.log("Password reset request for:", values.email);
    
    setLoading(true);
    
    try {
      const response = await UserForgotPassword(values.email);
      
      if (response.success) {
        // toast.success(response.message || "Password reset email sent successfully!");
        router.push(EAppRoutes.PASSWORD_RESET_MESSAGE);
      } else {
        toast.error(response.message || "Failed to send reset email. Please try again.");
      }
    } catch (error: unknown) {
      // console.error("Forgot password error:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Forgot Password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-white leading-relaxed">
          Enter the email address associated with your account. We&apos;ll send you
          an email to reset your password. <br className="hidden sm:block" />
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-primary font-bold underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-5 border border-gray-200 dark:border-dark-background-50 dark:bg-dark-background-100 rounded-[10px]"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormDescription className="text-black dark:text-white font-semibold">
                  Email address
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="admin@example.com"
                    {...field}
                    className={`w-full h-[50px] ${
                      fieldState.error ? "border-red-500" : ""
                    }`}
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-base sm:text-sm py-2 h-[52px] cursor-pointer font-[600] text-[14px] bg-[#4F46CA] hover:bg-[#4338CA] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Sending...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}