"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ReportSightingForm } from "@/components/sighting/ReportSightingForm";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { PageLoader } from "@/components/ui/Spinner";

export default function NewSightingPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useRequireAuth();

  if (authLoading) {
    return <PageLoader message="Loading..." />;
  }

  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <Link
        href="/sightings"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to sightings
      </Link>

      <h1 className="text-2xl font-bold text-foreground mb-2">Report a Sighting</h1>
      <p className="text-muted-foreground mb-6">
        Help the community find great beers by reporting where you found one.
      </p>

      <Card padding="lg">
        <ReportSightingForm
          onSuccess={() => router.push("/sightings")}
          onCancel={() => router.push("/sightings")}
        />
      </Card>
    </div>
  );
}
