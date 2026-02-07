"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common-elements/card";
import { Button } from "@/components/common-elements/button";
import { Input } from "@/components/common-elements/input";
import { Label } from "@/components/common-elements/label";
import { useSession } from "@/hooks";
import { useState, useEffect } from "react";
import { updateProfile } from "@/services/profile";
import { toast } from "sonner";
import { ProfileFormSkeleton } from "@/components/common/loading-skeletons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/common-elements/avatar";
import { getAvatarInitials } from "@/helpers";
import { User, Mail, Phone, Image } from "lucide-react";
import { Alert, AlertDescription } from "@/components/common-elements/alert";

export default function ProfilePage() {
  const { session, setSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: session.user.phone || "",
        avatar: session.user.imageUrl || "",
      });
    }
  }, [session]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        // Update session
        await setSession({
          ...session!,
          user: {
            ...session!.user,
            name: formData.name,
            phone: formData.phone,
            imageUrl: formData.avatar,
          },
        });
        toast.success("Profile updated successfully!");
        setHasChanges(false);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch {
      toast.error("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  return (
    <div className="space-y-6 pb-mobile-safe max-w-2xl">
      <div>
        <h1 className="heading-2xl">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
      </div>

      {hasChanges && (
        <Alert className="border-warning bg-warning-light dark:bg-warning/20">
          <AlertDescription className="text-sm">
            You have unsaved changes. Don't forget to save your updates!
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" aria-hidden="true" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!session?.user ? (
            <ProfileFormSkeleton />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatar || undefined} alt={formData.name} />
                  <AvatarFallback className="bg-primary-700 dark:bg-primary-400 text-white text-xl">
                    {getAvatarInitials(formData.name || "User")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Profile Picture</p>
                  <p className="text-xs text-muted-foreground">
                    Upload a profile picture or enter an image URL below
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  required
                  aria-required="true"
                  className="focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={session.user.email || ""}
                  disabled
                  placeholder="Your email"
                  className="bg-muted cursor-not-allowed"
                  aria-label="Email (read-only)"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className="focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar" className="flex items-center gap-2">
                  <Image className="h-4 w-4" aria-hidden="true" />
                  Avatar URL
                </Label>
                <Input
                  id="avatar"
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => handleChange("avatar", e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="focus-ring"
                />
                <p className="text-xs text-muted-foreground">
                  Enter a URL to an image or upload feature coming soon
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading || !hasChanges}
                  className="transition-smooth hover-scale"
                  aria-label="Update profile"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
                {hasChanges && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        name: session.user.name || "",
                        phone: session.user.phone || "",
                        avatar: session.user.imageUrl || "",
                      });
                      setHasChanges(false);
                    }}
                    className="transition-smooth"
                    aria-label="Cancel changes"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
