"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    initialize,
    updateUser,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
    initialize,
    updateUser,
  };
}

export function useRequireAuth(redirectTo = "/login") {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isInitialized, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading: !isInitialized || isLoading };
}

export function useRedirectIfAuthenticated(redirectTo = "/") {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isInitialized, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading: !isInitialized || isLoading };
}
