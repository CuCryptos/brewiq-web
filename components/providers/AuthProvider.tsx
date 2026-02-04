"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { PageLoader } from "@/components/ui/Spinner";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return <PageLoader message="Loading..." />;
  }

  return <>{children}</>;
}
