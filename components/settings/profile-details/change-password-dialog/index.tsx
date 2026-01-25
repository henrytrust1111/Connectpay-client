"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/common-elements/dialog";
import { Button } from "@/components/common-elements/button";
import { Input } from "@/components/common-elements/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/common-elements/form";
import {
  changePasswordSchema,
  type ChangePasswordSchemaType,
} from "@/validations/settings";
import { changePassword } from "@/services/user";
import toast from "react-hot-toast";
import { Eye, EyeOff, X } from "lucide-react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordDialog({
  isOpen,
  onClose,
}: ChangePasswordDialogProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const newPasswordValue = form.watch("newPassword");
  const currentPasswordValue = form.watch("currentPassword");

  const passwordChecks = (pw: string, currentPw: string) => {
    return {
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      lowercase: /[a-z]/.test(pw),
      number: /\d/.test(pw),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw),
      different: pw !== "" && pw !== currentPw,
    };
  };

  const checks = passwordChecks(
    newPasswordValue || "",
    currentPasswordValue || ""
  );

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await changePassword();

      if (result.success) {
        toast.success("Password changed successfully");
        onClose();
        form.reset();
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-[500px] h-[429px] md:h-[372px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-left dark:text-white">
            Change Password
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-900 dark:text-white font-normal text-base">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        {...field}
                        className="h-12 bg-transparent font-light text-[#A3A3A3] dark:text-dark-text"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-900 dark:text-white font-normal text-base">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        {...field}
                        className="h-12 bg-transparent font-light text-[#A3A3A3] dark:text-dark-text"
                      />
                      {showNewPassword ? (
                        <RiEyeOffLine
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                          onClick={() => setShowNewPassword(false)}
                        />
                      ) : (
                        <RiEyeLine
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                          onClick={() => setShowNewPassword(true)}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />

                  {newPasswordValue && (
                    <div className="mt-2 text-sm">
                      <ul className="space-y-1">
                        {!checks.length && (
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">
                              At least 8 characters
                            </span>
                          </li>
                        )}
                        {!checks.uppercase && (
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">
                              Contains an uppercase letter
                            </span>
                          </li>
                        )}
                        {!checks.lowercase && (
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">
                              Contains a lowercase letter
                            </span>
                          </li>
                        )}
                        {!checks.number && (
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">
                              Contains a number
                            </span>
                          </li>
                        )}
                        {!checks.special && (
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">
                              Contains a special character
                            </span>
                          </li>
                        )}
                        {!checks.different && (
                          <li className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">
                              New password is different from current
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </FormItem>
              )}
            />
            <DialogFooter className="!justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="w-full md:w-[111px] h-[52px] dark:border-dark-border dark:bg-[linear-gradient(0deg,#374151,#374151),linear-gradient(180deg,rgba(55,65,81,0.16)_0%,rgba(55,65,81,0)_100%)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark"
                disabled={isLoading}
                className="border border-primary-950 shadow-xs w-full md:w-[184px] h-[52px] dark:text-[#FEF3F2] dark:bg-primary-600 dark:border-primary-500"
              >
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}