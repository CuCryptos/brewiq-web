"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/utils/validation";
import { authApi } from "@/lib/api/auth";
import { useUIStore } from "@/lib/stores/uiStore";

export default function ForgotPasswordPage() {
  const { showError } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(data);
      setIsSubmitted(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to send reset email";
      showError("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card padding="lg">
        <CardContent className="text-center py-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Check your email</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-foreground">{getValues("email")}</span>
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-amber hover:text-amber-500 font-medium"
            >
              try another email
            </button>
          </p>
          <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Forgot password?</CardTitle>
        <CardDescription>
          No worries, we&apos;ll send you reset instructions
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send reset link
          </Button>
        </form>

        <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "w-full mt-4")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
        </Link>
      </CardContent>
    </Card>
  );
}
