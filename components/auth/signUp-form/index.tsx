"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupSchemaType } from "@/validations/auth/signup";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Link from "next/link";
import { Input } from "@/components/common-elements/input";
import { Button } from "@/components/common-elements/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/common-elements/form";
import { useRouter } from "next/navigation";
import { EAppRoutes } from "@/enums";
import AuthLogo from "../auth-logo";
import { authUserSignup } from "@/services/auth";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { useSession } from "@/hooks";

export function SignUpForm() {
  const router = useRouter();
  const { setSession } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: SignupSchemaType) {
    setLoading(true);

    try {
      const response = await authUserSignup(
        values.name,
        values.email,
        values.phone,
        values.password
      );

      if (response.success && response?.data) {
        const { token, userId, name, email, phone } = response.data;
        const decodedToken = jwtDecode(token);
        const expires = Number(decodedToken.exp) * 1000;
        const user = { id: userId, name, email, phone, imageUrl: null };
        await setSession({ token, user, expires });

        toast.success("Account created successfully!");
        router.push(EAppRoutes.DASHBOARD);
      } else {
        toast.error(response.message || "Signup failed. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full bg-[#FAFAFA] dark:bg-dark-background-200">
      <div className="w-full pl-10 pt-4 md:hidden bg-white dark:bg-dark-background-200 border-b border-b-neutral-200">
        <AuthLogo />
      </div>
      <div className="w-full h-[calc(100%-54px)] md:h-full px-4 flex flex-col justify-around max-w-[536px] mx-auto">
        <AuthLogo className="hidden md:block" />

        {/* Header */}
        <div className="space-y-11 pb-1.5 md:pb-0">
          <div className="sm:text-left">
            <h2 className="text-xl sm:text-[2rem] font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-white leading-relaxed">
              Let&apos;s get started by setting up your admin account. Provide
              the details below. Already have an account?{" "}
              <Link
                href={EAppRoutes.LOGIN}
                className="text-primary font-bold underline"
              >
                Login
              </Link>
            </p>
          </div>

          {/* Form Container */}
          <div className="w-full border border-gray-200 dark:border-dark-border rounded-[10px] mt-5 p-5 sm:p-6 md:p-5 mb-10 bg-[#FAFAFA] dark:bg-dark-background-100">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormDescription className="text-black dark:text-white font-semibold">
                        Full name
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className={`h-[50px] rounded-[8px] ${
                            fieldState.error ? "border-red-500" : ""
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
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
                          placeholder="john@example.com"
                          {...field}
                          className={`h-[50px] rounded-[8px] ${
                            fieldState.error ? "border-red-500" : ""
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormDescription className="text-black dark:text-white font-semibold">
                        Phone number
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          {...field}
                          className={`h-[50px] rounded-[8px] ${
                            fieldState.error ? "border-red-500" : ""
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormDescription className="text-black dark:text-white font-semibold">
                        Password
                      </FormDescription>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            className={`h-[50px] rounded-[8px] pr-10 ${
                              fieldState.error ? "border-red-500" : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormDescription className="text-black dark:text-white font-semibold">
                        Confirm password
                      </FormDescription>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                            className={`h-[50px] rounded-[8px] pr-10 ${
                              fieldState.error ? "border-red-500" : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] text-base sm:text-lg font-medium bg-[#4F46CA] hover:bg-[#4338CA] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div />
      </div>
    </div>
  );
}
