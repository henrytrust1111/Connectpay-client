"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  invitationSchema,
  InvitationSchemaType,
} from "@/validations/auth/invitation";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Input } from "@/components/common-elements/input";
import { Button } from "@/components/common-elements/button";
import {
  Form,
  FormField,
  FormItem,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/common-elements/form";
import { useRouter } from "next/navigation";
import { EAppRoutes } from "@/enums";
import AuthLogo from "../auth-logo";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function InvitationForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<InvitationSchemaType>({
    mode: "onChange",
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      organisationName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: InvitationSchemaType) {
    setLoading(true);

    try {
      // TODO: Implement invitation signup API call
      console.log(values); // Use values
      toast.success("Invitation accepted successfully!");
      router.push(EAppRoutes.LOGIN);
    } catch (error: unknown) {
      console.error("Invitation error:", error);
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
              Welcome, You&apos;re Invited 🎉
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-white leading-relaxed">
              You&apos;ve been invited to join Acme Organization
            </p>
          </div>

          {/* Form Container */}
          <div className="w-full border border-gray-200 dark:border-dark-border rounded-[10px] mt-5 p-5 sm:p-6 md:p-5 mb-10 bg-[#FAFAFA] dark:bg-dark-background-100">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Organisation Name */}
                <FormField
                  control={form.control}
                  name="organisationName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormDescription className="text-black dark:text-white font-semibold">
                        Organization name
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="e.g. Proctorme Inc."
                          {...field}
                          className={`h-[50px] rounded-[8px] ${fieldState.error ? "border-red-500" : ""}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormDescription className="text-black dark:text-white font-semibold">
                        First name
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          className={`h-[50px] rounded-[8px] ${fieldState.error ? "border-red-500" : ""}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormDescription className="text-black dark:text-white font-semibold">
                        Last name
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                          className={`h-[50px] rounded-[8px] ${fieldState.error ? "border-red-500" : ""}`}
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
                          placeholder="john.doe@example.com"
                          {...field}
                          className={`h-[50px] rounded-[8px] ${fieldState.error ? "border-red-500" : ""}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormDescription className="text-black dark:text-white font-semibold">
                        Phone number
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="+15550000000"
                          {...field}
                          className={`h-[50px] rounded-[8px] ${fieldState.error ? "border-red-500" : ""}`}
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
                      <div className="relative w-full">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="JohnDoe88&^"
                            {...field}
                            className={`h-[50px] rounded-[8px] ${fieldState.error ? "border-red-500" : ""}`}
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

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormDescription className="text-black dark:text-white font-semibold">
                        Confirm password
                      </FormDescription>
                      <div className="relative w-full">
                        <FormControl>
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="JohnDoe88&^"
                            {...field}
                            className={`h-[50px] rounded-[8px] ${fieldState.error ? "border-red-500" : ""}`}
                          />
                        </FormControl>
                        {showConfirmPassword ? (
                          <RiEyeOffLine
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowConfirmPassword(false)}
                          />
                        ) : (
                          <RiEyeLine
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                            onClick={() => setShowConfirmPassword(true)}
                          />
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[52px] text-sm sm:text-sm font-medium bg-[#4F46CA] hover:bg-[#4338CA] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Creating...
                    </>
                  ) : (
                    "Create account"
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
