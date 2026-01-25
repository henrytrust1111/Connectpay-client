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
import { phoneSchema, type PhoneSchemaType } from "@/validations/settings";
import { updateOrganization } from "@/services/user";
import { useSession } from "@/hooks/useSession";
import toast from "react-hot-toast";

interface EditPhoneDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhone: string;
  onSave: (phone: string) => void;
}

export function EditPhoneDialog({
  isOpen,
  onClose,
  currentPhone,
  onSave,
}: EditPhoneDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();

  const form = useForm<PhoneSchemaType>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: currentPhone,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({ phone: currentPhone });
    }
  }, [isOpen, currentPhone, form]);

  const onSubmit = async (data: PhoneSchemaType) => {
    if (!session?.user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateOrganization();

      if (!result.success) {
        toast.error("Failed to update phone number");
        setIsLoading(false);
        return;
      }

      onSave(data.phone);
      toast.success("Phone number updated successfully");
      onClose();
      form.reset({ phone: data.phone });
    } catch (error) {
      console.error("Error updating phone:", error);
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
            Edit Phone Number
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-900 dark:text-white font-normal text-base">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="(+1) 567-890-0867"
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
                className="border border-primary-950 shadow-xs w-full md:w-[184px] h-[52px] dark:border-primary-500 dark:bg-primary-600 dark:text-[#FEF3F2]"
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