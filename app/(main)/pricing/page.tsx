"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Beer, Camera, Beaker, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/hooks/useAuth";
import { subscriptionsApi } from "@/lib/api/subscriptions";
import { useUIStore } from "@/lib/stores/uiStore";
import { cn } from "@/lib/utils/cn";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "forever",
    description: "Perfect for casual beer explorers",
    features: [
      "5 scans per month",
      "Basic beer information",
      "Community reviews",
      "Save up to 20 beers",
      "Basic achievements",
    ],
    limitations: [
      "Limited IQ analysis",
      "No recipe access",
      "No sighting alerts",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "enthusiast",
    name: "Enthusiast",
    price: 4.99,
    interval: "month",
    description: "For dedicated craft beer lovers",
    features: [
      "50 scans per month",
      "Full IQ Score analysis",
      "Detailed tasting notes",
      "Unlimited saves & wishlists",
      "Sighting notifications",
      "Priority support",
      "All achievements",
    ],
    limitations: [],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: "connoisseur",
    name: "Connoisseur",
    price: 9.99,
    interval: "month",
    description: "Unlock the full BrewIQ experience",
    features: [
      "Unlimited scans",
      "AI-powered recommendations",
      "Clone recipe generator",
      "Full recipe library access",
      "Advanced analytics",
      "Early access to features",
      "Custom lists & notes",
      "API access",
    ],
    limitations: [],
    cta: "Start Free Trial",
    popular: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { showError } = useUIStore();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (planId === "free") {
      if (!isAuthenticated) {
        router.push("/register");
      }
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?redirect=/pricing");
      return;
    }

    setLoadingPlan(planId);
    try {
      const { url } = await subscriptionsApi.createCheckoutSession(planId);
      window.location.href = url;
    } catch {
      showError("Error", "Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Choose Your Plan
        </h1>
        <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
          Unlock AI-powered beer insights, unlimited scans, and premium features
          to enhance your craft beer journey.
        </p>
      </div>

      {/* Plans */}
      <div className="grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            padding="lg"
            className={cn(
              "relative",
              plan.popular && "border-2 border-amber shadow-beer"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="gold" className="px-3 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
              <div className="mt-3">
                <span className="text-4xl font-bold text-foreground">
                  ${plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground">/{plan.interval}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {plan.description}
              </p>
            </div>

            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              onClick={() => handleSelectPlan(plan.id)}
              isLoading={loadingPlan === plan.id}
              disabled={user?.tier === plan.id}
            >
              {user?.tier === plan.id ? "Current Plan" : plan.cta}
            </Button>

            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
              {plan.limitations.map((limitation) => (
                <div
                  key={limitation}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <span className="h-5 w-5 flex items-center justify-center shrink-0">
                    -
                  </span>
                  <span className="text-sm">{limitation}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Feature Comparison */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          What You Get
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center">
            <Camera className="h-10 w-10 mx-auto text-amber mb-3" />
            <h3 className="font-medium text-foreground">Smart Scanning</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Identify beers instantly with AI-powered label recognition
            </p>
          </Card>
          <Card className="text-center">
            <Beer className="h-10 w-10 mx-auto text-amber mb-3" />
            <h3 className="font-medium text-foreground">IQ Scores</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get detailed quality scores and tasting analysis
            </p>
          </Card>
          <Card className="text-center">
            <Beaker className="h-10 w-10 mx-auto text-amber mb-3" />
            <h3 className="font-medium text-foreground">Clone Recipes</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Generate homebrew recipes from your favorite beers
            </p>
          </Card>
          <Card className="text-center">
            <MapPin className="h-10 w-10 mx-auto text-amber mb-3" />
            <h3 className="font-medium text-foreground">Beer Sightings</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Find where your favorite beers are available
            </p>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Questions?
        </h2>
        <div className="space-y-4">
          <Card>
            <h3 className="font-medium text-foreground">
              Can I cancel anytime?
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Yes! You can cancel your subscription at any time. You&apos;ll continue
              to have access until the end of your billing period.
            </p>
          </Card>
          <Card>
            <h3 className="font-medium text-foreground">Is there a free trial?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Paid plans include a 7-day free trial. You won&apos;t be charged until
              the trial ends.
            </p>
          </Card>
          <Card>
            <h3 className="font-medium text-foreground">
              What payment methods do you accept?
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              We accept all major credit cards, debit cards, and Apple Pay through
              our secure Stripe payment system.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
