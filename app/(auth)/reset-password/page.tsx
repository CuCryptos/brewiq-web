"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/utils/validation";
import { authApi } from "@/lib/api/auth";
import { useUIStore } from "@/lib/stores/uiStore";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { showError, showSuccess } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      showError("Invalid link", "Please request a new password reset link");
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({ token, password: data.password });
      setIsSuccess(true);
      showSuccess("Password reset!", "You can now sign in with your new password");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to reset password";
      showError("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Card padding="lg">
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Invalid reset link</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password">
            <Button className="mt-6">Request a new link</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isSuccess) {
    return (
      <Card padding="lg">
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Password reset successful</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been successfully reset.
          </p>
          <Link href="/login">
            <Button className="mt-6">Sign in</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>

      <CardContent className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            error={errors.password?.message}
            hint="At least 8 characters with uppercase, lowercase, and number"
            {...register("password")}
          />

          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-8">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
