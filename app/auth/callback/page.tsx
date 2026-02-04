"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageLoader } from "@/components/ui/Spinner";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/authStore";
import Link from "next/link";

function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const provider = searchParams.get("provider");
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");

  useEffect(() => {
    async function handleCallback() {
      if (errorParam) {
        setError("Authentication was cancelled or failed. Please try again.");
        return;
      }

      if (!provider || !code) {
        setError("Invalid callback parameters");
        return;
      }

      try {
        const response = await authApi.handleOAuthCallback(provider, code);
        setUser(response.user);
        router.push("/");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Authentication failed";
        setError(message);
      }
    }

    handleCallback();
  }, [provider, code, errorParam, router, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card padding="lg" className="max-w-md w-full">
          <CardContent className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Authentication failed</h2>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link href="/login">
                <Button>Try again</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Go home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <PageLoader message="Completing sign in..." />;
}

export default function OAuthCallbackPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading..." />}>
      <OAuthCallbackHandler />
    </Suspense>
  );
}
