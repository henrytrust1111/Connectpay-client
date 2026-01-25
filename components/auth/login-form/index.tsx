"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/common-elements/form";
import { loginSchema, LoginSchemaType } from "@/validations/auth/login";
// import { LoginSchemaType } from "@/validations/auth/login";
import { Input } from "@/components/common-elements/input";
import { Button } from "@/components/common-elements/button";
import Link from "next/link";
import { authUserLogin } from "@/services/auth";
import { useRouter } from "next/navigation";
import { EAppQueryParamsKey, EAppRoutes } from "@/enums";
import { jwtDecode } from "jwt-decode";
import { useSession } from "@/hooks";
import AuthLogo from "../auth-logo";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function LoginForm() {
  const { setSession } = useSession();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginSchemaType) {
    setLoading(true);

    try {
      const response = await authUserLogin(values.email, values.password);

      if (response.success && response?.data) {
        const { token, userId, name, email, phone } = response.data;
        const decodedToken = jwtDecode(token);
        const expires = Number(decodedToken.exp) * 1000;
        const user = { id: userId, name, email, phone, imageUrl: null };
        await setSession({ token, user, expires });

        toast.success("Login successful!");
        console.log("testing login again!!!")
        console.log(user)

        // Redirect after successful login
        const params = new URLSearchParams(window.location.search);
        const pageToGo = params.get(EAppQueryParamsKey.REDIRECT_URL) || EAppRoutes.DASHBOARD;
        router.push(pageToGo);
      } else {
        toast.error(response.message || "Invalid email or password");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
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
    <div className="w-full h-full">
      <div className="w-full pl-10 pt-4 md:hidden bg-white dark:bg-dark-background-200 border-b border-b-neutral-200">
        <AuthLogo />
      </div>
      <div className="flex flex-col justify-around max-w-[536px] h-[calc(100%-56px)] md:h-full md:pb-[20%] px-4 md:px-0 space-y-4 mx-auto">
        <AuthLogo className="hidden md:block" />

        <div className="space-y-4">
          <div>
            <h2 className="lg:text-[2rem] text-xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-white">
              Login to access your dashboard. Don&apos;t have an account yet?{" "}
              <Link
                href={EAppRoutes.SIGNUP}
                className="ml-auto inline-block text-primary font-bold underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div className="w-full border border-gray-200 dark:border-dark-border dark:bg-dark-background-100 rounded-[10px] lg:p-[26px] p-3 space-y-8 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* EMAIL FIELD */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@example.com"
                          {...field}
                          disabled={loading}
                          className={`h-[50px] rounded-[8px] ${
                            fieldState?.error ? "border-red-500" : ""
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PASSWORD FIELD */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative w-full">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            disabled={loading}
                            className={`h-[50px] rounded-[8px] ${
                              fieldState?.error ? "border-red-500" : ""
                            }`}
                          />
                        </FormControl>

                        {showPassword ? (
                          <RiEyeOffLine
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <RiEyeLine
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(true)}
                          />
                        )}
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Forgot Password */}
                <div>
                  <Link
                    href={EAppRoutes.FORGOT_PASSWORD}
                    className="ml-auto inline-block font-bold text-primary underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* SUBMIT BUTTON */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-[52px]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Logging in...
                    </>
                  ) : (
                    "Login"
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
