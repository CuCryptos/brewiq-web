"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Bell, CreditCard, Shield, LogOut, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuth, useRequireAuth } from "@/lib/hooks/useAuth";
import { useUIStore } from "@/lib/stores/uiStore";
import { usersApi } from "@/lib/api/users";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { imagesApi } from "@/lib/api/images";
import { PageLoader } from "@/components/ui/Spinner";

interface ProfileFormData {
  displayName: string;
  bio: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  const { isLoading: authLoading } = useRequireAuth();
  const { showSuccess, showError } = useUIStore();

  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [avatarPrompt, setAvatarPrompt] = useState("");
  const [showAvatarPrompt, setShowAvatarPrompt] = useState(false);

  const { register, handleSubmit, formState: { isDirty } } = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName || "",
      bio: user?.bio || "",
    },
  });

  if (authLoading) {
    return <PageLoader message="Loading settings..." />;
  }

  if (!user) return null;

  const onSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      const updated = await usersApi.updateProfile(data);
      updateUser(updated);
      showSuccess("Profile updated", "Your changes have been saved.");
    } catch {
      showError("Update failed", "Could not save your changes.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      const updated = await usersApi.updateProfile({ avatar: file });
      updateUser(updated);
      showSuccess("Avatar updated", "Your profile picture has been changed.");
    } catch {
      showError("Upload failed", "Could not upload your avatar.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleGenerateAvatar = async () => {
    if (!avatarPrompt.trim()) return;
    setIsGeneratingAvatar(true);
    try {
      const { imageUrl } = await imagesApi.generateAvatar(avatarPrompt);
      const updated = await usersApi.updateProfile({ avatarUrl: imageUrl });
      updateUser(updated);
      showSuccess("Avatar generated", "Your new AI avatar has been set.");
      setShowAvatarPrompt(false);
      setAvatarPrompt("");
    } catch {
      showError("Generation failed", "Could not generate your avatar.");
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { url } = await subscriptionsApi.getPortalUrl();
      window.location.href = url;
    } catch {
      showError("Error", "Could not open subscription portal.");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <Link
        href="/profile"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to profile
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      {/* Profile Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-amber" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>
            Update your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar
              src={user.avatar}
              fallback={user.displayName || user.username}
              size="lg"
            />
            <div>
              <label className="cursor-pointer">
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={isUploadingAvatar}
                  onClick={() => document.getElementById("avatar-input")?.click()}
                >
                  Change avatar
                </Button>
                <input
                  id="avatar-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG. Max 5MB.
              </p>
            </div>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAvatarPrompt(!showAvatarPrompt)}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                AI Avatar
              </Button>
            </div>
          </div>

          {showAvatarPrompt && (
            <div className="mb-6 p-4 rounded-lg border border-border bg-muted/50">
              <p className="text-sm font-medium text-foreground mb-2">
                Describe your ideal avatar
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. A friendly brewmaster with a hop crown"
                  value={avatarPrompt}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarPrompt(e.target.value)}
                />
                <Button
                  onClick={handleGenerateAvatar}
                  isLoading={isGeneratingAvatar}
                  disabled={!avatarPrompt.trim()}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Powered by Google Gemini AI
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Username"
              value={user.username}
              disabled
              hint="Username cannot be changed"
            />
            <Input
              label="Display Name"
              placeholder="Your display name"
              {...register("displayName")}
            />
            <Textarea
              label="Bio"
              placeholder="Tell us about yourself..."
              rows={3}
              {...register("bio")}
            />
            <Button type="submit" isLoading={isUpdating} disabled={!isDirty}>
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Email Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-amber" />
            <CardTitle>Email</CardTitle>
          </div>
          <CardDescription>
            Manage your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            label="Email Address"
            value={user.email}
            disabled
            hint="Contact support to change your email"
          />
        </CardContent>
      </Card>

      {/* Subscription Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber" />
            <CardTitle>Subscription</CardTitle>
          </div>
          <CardDescription>
            Manage your subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                Current Plan:{" "}
                <Badge variant={user.tier === "free" ? "secondary" : "gold"} className="ml-1 capitalize">
                  {user.tier}
                </Badge>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {user.tier === "free"
                  ? "Upgrade to unlock premium features"
                  : "Manage your subscription and billing"}
              </p>
            </div>
            {user.tier === "free" ? (
              <Link href="/pricing">
                <Button>Upgrade</Button>
              </Link>
            ) : (
              <Button variant="outline" onClick={handleManageSubscription}>
                Manage
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Configure notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Notification settings coming soon.
          </p>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>
            Manage your account security
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/forgot-password">
            <Button variant="outline">Change Password</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <LogOut className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Sign Out</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleLogout}>
            Sign out of all devices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
