"use client";

import { useState, useEffect, useRef } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/common-elements/avatar";
import { Button } from "@/components/common-elements/button";
import { Trash2 } from "lucide-react";
import { EditOrganizationDialog } from "./edit-organization-dialog";
import { EditEmailDialog } from "./edit-email-dialog";
import { EditPhoneDialog } from "./edit-phone-dialog";
import { ChangePasswordDialog } from "./change-password-dialog";
import { ConfirmModal } from "@/components/modal/confirm-modal";
import { useSession } from "@/hooks/useSession";
import {
  updateOrganizationImage,
  deleteOrganizationImage,
} from "@/services/user";
import toast from "react-hot-toast";

export function ProfileDetails() {
  const { session, setSession } = useSession();

  const [isOrgDialogOpen, setIsOrgDialogOpen] = useState(false);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // State for form data - will be populated from session
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Populate data from session on mount
  useEffect(() => {
    if (session?.user) {
      setOrganizationName(session.user.name || "");
      setEmail(session.user.email || "");
      setPhone(session.user.phone || "");
      console.log(session.user.id);
    }
  }, [session]);

  const computeInitials = (name?: string) => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      const w = parts[0];
      return (
        (w[0] || "").toUpperCase() + ((w[1] || "") as string).toUpperCase()
      );
    }
    // two or more words: use first letters of first two words
    return ((parts[0][0] || "") + (parts[1][0] || "")).toUpperCase();
  };

  const onUpdateClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!session?.user?.id) {
      toast.error("Unable to determine organisation id");
      return;
    }

    try {
      setIsUploading(true);
      const res = await updateOrganizationImage();
      if (res.success) {
        toast.success("Image updated successfully");
        // TODO: refetch organisation to get fresh imageUrl when API is implemented
        // const refresh = await getUserData();
        // if (refresh.success && refresh.data) {
        //   const org = refresh.data.data.organisation;
        //   const newImageUrl = org?.imageUrl || undefined;
        //   // Update session to reflect new image - will broadcast to all components
        //   if (session?.user) {
        //     await setSession({
        //       ...session,
        //       user: {
        //         ...session.user,
        //         image: newImageUrl,
        //       },
        //     });
        //   }
        // }
      } else {
        toast.error("Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      // reset input so selecting same file again works
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDeleteImage = async () => {
    if (!session?.user?.id) {
      toast.error("Unable to determine organisation id");
      return;
    }

    try {
      setIsDeleting(true);
      const res = await deleteOrganizationImage();
      if (res.success) {
        toast.success("Image deleted successfully");
        // Update session to clear image - will broadcast to all components
        if (session?.user) {
          await setSession({
            ...session,
            user: {
              ...session.user,
              imageUrl: undefined,
            },
          });
        }
      } else {
        toast.error("Failed to delete image");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image");
    } finally {
      setIsDeleting(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Personal Information Section */}
      <div className="w-full max-w-[570.212890625px] space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2 dark:text-white">
            Personal Information
          </h2>
          <p className="text-sm text-body dark:text-dark-text">
            Keep your account details up-to-date to ensure smooth communication
            and management.
          </p>
        </div>

        {/* Avatar Section */}
        <div className="flex items-center gap-4">
          <Avatar className="size-[100px]">
            <AvatarImage
              src={session?.user?.imageUrl || undefined}
              alt="Profile"
            />
            <AvatarFallback className="bg-primary text-primary-foreground dark:text-primary-50 text-2xl font-semibold">
              {computeInitials(organizationName) || ""}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFileChange}
              />
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-body rounded-[40px] text-neutral-900 dark:text-white dark:border-dark-border"
                onClick={onUpdateClick}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Update"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-none shadow-none text-body hover:text-destructive"
                onClick={() => setIsDeleteConfirmOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            </div>
            <p className="text-xs text-muted-foreground dark:text-dark-text mt-1">
              Max file size: 2MB
            </p>
          </div>
        </div>

        <div className="w-full max-w-[570.212890625px] space-y-8">
          {/* Organization Name */}
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <h3 className="font-medium mb-1">Organization Name</h3>
              <p className="text-sm text-muted-foreground dark:text-dark-text">
                {organizationName}
              </p>
            </div>
            <Button
              variant="link"
              className="text-[#222222] dark:text-white underline font-semibold"
              onClick={() => setIsOrgDialogOpen(true)}
            >
              Edit
            </Button>
          </div>

          {/* Email Address */}
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <h3 className="font-medium mb-1">Email address</h3>
              <p className="text-sm text-muted-foreground dark:text-dark-text">
                {email}
              </p>
            </div>
            <Button
              variant="link"
              className="text-[#222222] dark:text-white underline font-semibold"
              onClick={() => setIsEmailDialogOpen(true)}
            >
              Edit
            </Button>
          </div>

          {/* Phone Numbers */}
          <div className="flex items-center justify-between py-4 border-b">
            <div>
              <h3 className="font-medium mb-1">Phone numbers</h3>
              <p className="text-sm text-muted-foreground dark:text-dark-text">
                {phone}
              </p>
            </div>
            <Button
              variant="link"
              className="text-[#222222] dark:text-white underline font-semibold"
              onClick={() => setIsPhoneDialogOpen(true)}
            >
              Edit
            </Button>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="h-[109px] flex items-center border-y space-y-4">
          <div className="w-full">
            <div className="w-full flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold mb-2 text-nowrap">
                Change Password
              </h2>
              <Button
                variant="link"
                className="text-[#222222] dark:text-white underline font-semibold"
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                Update password
              </Button>
            </div>
            <p className="text-sm text-muted-foreground dark:text-dark-text">
              Update your password and secure your account
            </p>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <EditOrganizationDialog
        isOpen={isOrgDialogOpen}
        onClose={() => setIsOrgDialogOpen(false)}
        currentName={organizationName}
        onSave={async (newName) => {
          setOrganizationName(newName);
          // Update session with new name - will broadcast to all components
          if (session?.user) {
            await setSession({
              ...session,
              user: {
                ...session.user,
                name: newName,
              },
            });
          }
        }}
      />
      <EditEmailDialog
        isOpen={isEmailDialogOpen}
        onClose={() => setIsEmailDialogOpen(false)}
        currentEmail={email}
        onSave={async (newEmail) => {
          setEmail(newEmail);
          // Update session with new email
          if (session?.user) {
            await setSession({
              ...session,
              user: {
                ...session.user,
                email: newEmail,
              },
            });
          }
        }}
      />
      <EditPhoneDialog
        isOpen={isPhoneDialogOpen}
        onClose={() => setIsPhoneDialogOpen(false)}
        currentPhone={phone}
        onSave={(newPhone) => {
          setPhone(newPhone);
          // Update session with new phone
          if (session?.user) {
            setSession({
              ...session,
              user: {
                ...session.user,
                phone: newPhone,
              },
            });
          }
        }}
      />
      <ChangePasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      />
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={onDeleteImage}
        title="Delete Profile Image"
        description="Are you sure you want to delete your profile image? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
      />
    </div>
  );
}
