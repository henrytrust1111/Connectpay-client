"use client";

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
import { domainSchema, type DomainSchemaType } from "@/validations/settings";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AddDomainDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (domain: DomainSchemaType) => void;
  isLoading?: boolean;
}

export function AddDomainDialog({
  isOpen,
  onClose,
  onSave,
  isLoading=false,
}: AddDomainDialogProps) {
  const form = useForm<DomainSchemaType>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const onSubmit = (data: DomainSchemaType) => {
    onSave(data);
  };

    // Reset form when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen, form])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95%] sm:max-w-[688px] h-[418px] md:h-[334px]">
        <DialogHeader className="border-b pb-3 md:pb-6 dark:text-white">
          <DialogTitle>Add Domain</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="border-b space-y-4 pb-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:flex-row md:items-start md:gap-5">
                    <FormLabel className="text-neutral-900 dark:text-dark-text font-normal text-sm">
                      Title
                    </FormLabel>
                      <div className="w-full">
                        <FormControl>
                        <Input
                          placeholder="Main Portal"
                          {...field}
                          className="h-11 bg-transparent font-light text-[#A3A3A3] dark:text-dark-text border shadow-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex flex-col md:flex-row md:items-start md:gap-5">
                    <FormLabel className="text-neutral-900 dark:text-dark-text font-normal text-sm">
                      URL
                    </FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="proctorme.edu"
                          {...field}
                          className="h-11 bg-transparent font-light text-[#A3A3A3] dark:text-dark-text border shadow-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="!justify-between !mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-[52px] shadow dark:border-dark-border dark:text-white dark:bg-[linear-gradient(0deg,#374151,#374151),linear-gradient(180deg,rgba(55,65,81,0.16)_0%,rgba(55,65,81,0)_100%)]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark"
                disabled={isLoading}
                className="border border-primary-950 shadow-xs flex-1 h-[52px] dark:bg-primary-600 dak:text-[#FEF3F2]"
              >
                {
                  isLoading ? <Loader2 className="animate-spin"/> : "Save"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
