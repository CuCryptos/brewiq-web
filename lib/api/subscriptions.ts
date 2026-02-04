import { api } from "./client";
import type { Subscription, SubscriptionPlan, SubscriptionTier } from "@/lib/types";

export const subscriptionsApi = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await api.get<SubscriptionPlan[]>("/subscriptions/plans");
    return response.data;
  },

  async getCurrentSubscription(): Promise<Subscription | null> {
    const response = await api.get<Subscription | null>("/subscriptions/current");
    return response.data;
  },

  async createCheckoutSession(planId: string): Promise<{ url: string }> {
    const response = await api.post<{ url: string }>("/subscriptions/checkout", {
      planId,
      successUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/subscription/success`,
      cancelUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/subscription/cancel`,
    });
    return response.data;
  },

  async getPortalUrl(): Promise<{ url: string }> {
    const response = await api.get<{ url: string }>("/subscriptions/portal");
    return response.data;
  },

  async cancelSubscription(): Promise<Subscription> {
    const response = await api.post<Subscription>("/subscriptions/cancel");
    return response.data;
  },

  async reactivateSubscription(): Promise<Subscription> {
    const response = await api.post<Subscription>("/subscriptions/reactivate");
    return response.data;
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
