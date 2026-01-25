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
import {
  organizationNameSchema,
  type OrganizationNameSchemaType,
} from "@/validations/settings";
import { updateOrganization } from "@/services/user";
import { useSession } from "@/hooks/useSession";
import toast from "react-hot-toast";

interface EditOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (name: string) => void;
}

export function EditOrganizationDialog({
  isOpen,
  onClose,
  currentName,
  onSave,
}: EditOrganizationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useSession();

  const form = useForm<OrganizationNameSchemaType>({
    resolver: zodResolver(organizationNameSchema),
    defaultValues: {
      organizationName: currentName,
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      form.reset({ organizationName: currentName });
    }
  }, [isOpen, currentName, form]);

  const onSubmit = async (data: OrganizationNameSchemaType) => {
    console.log("Session:", session);
    console.log("User ID:", session?.user?.id);
    
    if (!session?.user?.id) {
      toast.error("User not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateOrganization();
      
      console.log("Update result:", result);

      if (!result.success) {
        toast.error("Failed to update organization name");
        setIsLoading(false);
        return;
      }

      onSave(data.organizationName);
      toast.success("Organization name updated successfully");
      onClose();
      form.reset({ organizationName: data.organizationName });
    } catch (error) {
      console.error("Error updating organization name:", error);
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
            Edit Organization Name
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-11">
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-900 dark:text-white font-normal text-base">
                    Organization Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter organization name"
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
                onClick={onClose}
                disabled={isLoading}
                className="w-full md:w-[111px] h-[52px] shadow-xs dark:bg-[linear-gradient(0deg,#374151,#374151),linear-gradient(180deg,rgba(55,65,81,0.16)_0%,rgba(55,65,81,0)_100%)]"
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