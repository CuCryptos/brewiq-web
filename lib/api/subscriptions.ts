import { api } from "./client";
import type { Subscription, SubscriptionPlan, SubscriptionTier } from "@/lib/types";

// API wraps responses in { success: boolean, data: T }
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const subscriptionsApi = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await api.get<ApiResponse<SubscriptionPlan[]>>("/subscriptions/plans");
    return response.data.data;
  },

  async getCurrentSubscription(): Promise<Subscription | null> {
    const response = await api.get<ApiResponse<Subscription | null>>("/subscriptions/current");
    return response.data.data;
  },

  async createCheckoutSession(planId: string): Promise<{ url: string }> {
    const response = await api.post<ApiResponse<{ url: string }>>("/subscriptions/checkout", {
      planId,
      successUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/subscription/success`,
      cancelUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/subscription/cancel`,
    });
    return response.data.data;
  },

  async getPortalUrl(): Promise<{ url: string }> {
    const response = await api.get<ApiResponse<{ url: string }>>("/subscriptions/portal");
    return response.data.data;
  },

  async cancelSubscription(): Promise<Subscription> {
    const response = await api.post<ApiResponse<Subscription>>("/subscriptions/cancel");
    return response.data.data;
  },

  async reactivateSubscription(): Promise<Subscription> {
    const response = await api.post<ApiResponse<Subscription>>("/subscriptions/reactivate");
    return response.data.data;
  },

  // Check if user has access to a feature
  hasFeatureAccess(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
    const tierRanking: Record<SubscriptionTier, number> = {
      free: 0,
      enthusiast: 1,
      connoisseur: 2,
      brewmaster: 3,
    };
    return tierRanking[userTier] >= tierRanking[requiredTier];
  },
};
