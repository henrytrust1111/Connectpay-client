"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common-elements/card";
import { Button } from "@/components/common-elements/button";
import { Input } from "@/components/common-elements/input";
import { Label } from "@/components/common-elements/label";
import { useSession } from "@/hooks";
import { useState } from "react";
import { updateProfile } from "@/services/profile";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { session, setSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    phone: session?.user?.phone || "",
    avatar: session?.user?.imageUrl || "",
  });

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
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-22">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={session?.user?.email || ""}
                disabled
                placeholder="Your email"
              />
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="Enter avatar URL"
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}