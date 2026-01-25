"use client";

import { useState, useEffect } from "react";
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
import { emailSchema, type EmailSchemaType } from "@/validations/settings";
import { updateOrganization } from "@/services/user";
import toast from "react-hot-toast";
import { useSession } from "@/hooks";
import { deleteCookie } from "cookies-next";
import { defaultAuth } from "@/constants";
import { EAppCookieType, EAppRoutes } from "@/enums";
import { useRouter } from "@bprogress/next";

interface EditEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSave: (email: string) => void;
}

export function EditEmailDialog({
  isOpen,
  onClose,
  currentEmail,
  onSave,
}: EditEmailDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { session, setSession } = useSession();
  const router = useRouter();

  // Robust local logout: clear cookie and reset global session, no login redirect
  const localLogout = async () => {
    deleteCookie(EAppCookieType.SESSION_KEY);
    await setSession(defaultAuth);
  };

  const form = useForm<EmailSchemaType>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: currentEmail,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({ email: currentEmail });
    }
  }, [isOpen, currentEmail, form]);

  const onSubmit = async (data: EmailSchemaType) => {
    if (!session?.user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateOrganization();

      if (!result.success) {
        toast.error("Failed to update email");
        setIsLoading(false);
        return;
      }
      // Clear session then route to alert page
      localLogout();
      onSave(data.email);
      toast.success("Email updated successfully");
      router.push(EAppRoutes.RESET_EMAIL_ALERT);
      onClose();
      form.reset({ email: data.email });
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-[500px] h-[322px] md:h-[265px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-left dark:text-white">
            Edit Email address
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-900 dark:text-white font-normal text-base">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      {...field}
                      disabled={isLoading}
                      className="h-12 bg-transparent font-light text-[#A3A3A3] dark:text-dark-text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="!justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="w-full md:w-[111px] h-[52px] dark:text-white dark:border-dark-border dark:bg-[linear-gradient(0deg,#374151,#374151),linear-gradient(180deg,rgba(55,65,81,0.16)_0%,rgba(55,65,81,0)_100%)]"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark"
                disabled={isLoading}
                className="border border-primary-950 shadow-xs w-full md:w-[184px] h-[52px] dark:bg-primary-600"
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
