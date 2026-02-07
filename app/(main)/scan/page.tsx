"use client";

import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Menu, Beer, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import dynamic from "next/dynamic";

const CameraScanner = dynamic(
  () => import("@/components/scan/CameraScanner").then((m) => ({ default: m.CameraScanner })),
  { ssr: false }
);
const ImageUpload = dynamic(
  () => import("@/components/scan/ImageUpload").then((m) => ({ default: m.ImageUpload })),
  { ssr: false }
);
import { ScanResult } from "@/components/scan/ScanResult";
import { useCreateScan } from "@/lib/hooks/useScanner";
import { useRequireAuth } from "@/lib/hooks/useAuth";
import { PageLoader } from "@/components/ui/Spinner";
import type { ScanType, ScanResult as ScanResultType } from "@/lib/types";

type ScanMode = "camera" | "upload";
type ScanStep = "select" | "scanning" | "result";

export default function ScanPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const [mode, setMode] = useState<ScanMode>("camera");
  const [step, setStep] = useState<ScanStep>("select");
  const [scanType, setScanType] = useState<ScanType>("single");
  const [scanResult, setScanResult] = useState<ScanResultType | null>(null);

  const scanMutation = useCreateScan();
  const scanTypes: ScanType[] = ["single", "menu", "shelf"];
  const scanTypeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleScanTypeKeyDown = (e: React.KeyboardEvent) => {
    const currentIdx = scanTypes.indexOf(scanType);
    let nextIdx = currentIdx;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        nextIdx = (currentIdx + 1) % scanTypes.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        nextIdx = (currentIdx - 1 + scanTypes.length) % scanTypes.length;
        break;
      default:
        return;
    }

    setScanType(scanTypes[nextIdx]);
    scanTypeRefs.current[nextIdx]?.focus();
  };

  if (authLoading) {
    return <PageLoader message="Loading..." />;
  }

  const handleCapture = async (imageData: string) => {
    setStep("scanning");

    try {
      // Convert data URL to File
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], "scan.jpg", { type: "image/jpeg" });

      // Submit scan
      const scan = await scanMutation.mutateAsync({ image: file, scanType });

      if (scan.status === "completed" && scan.results && scan.results.length > 0) {
        setScanResult(scan.results[0]);
        setStep("result");
      } else {
        // Handle no results
        setScanResult(null);
        setStep("result");
      }
    } catch (error) {
      console.error("Scan error:", error);
      setStep("select");
    }
  };

  const handleScanAnother = () => {
    setScanResult(null);
    setStep("select");
  };

  // Result view
  if (step === "result") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        {scanResult ? (
          <ScanResult result={scanResult} onScanAnother={handleScanAnother} />
        ) : (
          <Card padding="lg" className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              No beer detected
            </h2>
            <p className="mt-2 text-muted-foreground">
              We couldn&apos;t identify any beer in this image. Try taking a clearer
              photo of the beer label.
            </p>
            <Button onClick={handleScanAnother} className="mt-6">
              Try Again
            </Button>
          </Card>
        )}
      </div>
    );
  }

  // Camera view (full screen)
  if (mode === "camera" && step !== "select") {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <CameraScanner
          onCapture={handleCapture}
          onClose={() => setStep("select")}
          isProcessing={scanMutation.isPending}
        />
      </div>
    );
  }

  // Selection view
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Scan a Beer</h1>
        <p className="text-muted-foreground mt-2">
          Take a photo of a beer label, menu, or store shelf
        </p>
      </div>

      {/* Scan Type Selection */}
      <Card className="mb-6">
        <h3 className="font-medium text-foreground mb-3">What are you scanning?</h3>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Scan type" onKeyDown={handleScanTypeKeyDown}>
          <button
            ref={(el) => { scanTypeRefs.current[0] = el; }}
            role="radio"
            aria-checked={scanType === "single"}
            tabIndex={scanType === "single" ? 0 : -1}
            onClick={() => setScanType("single")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
              scanType === "single"
                ? "border-amber bg-amber/5"
                : "border-border hover:border-amber/50"
            }`}
          >
            <Beer className="h-6 w-6" />
            <span className="text-sm font-medium">Single Beer</span>
          </button>
          <button
            ref={(el) => { scanTypeRefs.current[1] = el; }}
            role="radio"
            aria-checked={scanType === "menu"}
            tabIndex={scanType === "menu" ? 0 : -1}
            onClick={() => setScanType("menu")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
              scanType === "menu"
                ? "border-amber bg-amber/5"
                : "border-border hover:border-amber/50"
            }`}
          >
            <Menu className="h-6 w-6" />
            <span className="text-sm font-medium">Menu</span>
          </button>
          <button
            ref={(el) => { scanTypeRefs.current[2] = el; }}
            role="radio"
            aria-checked={scanType === "shelf"}
            tabIndex={scanType === "shelf" ? 0 : -1}
            onClick={() => setScanType("shelf")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
              scanType === "shelf"
                ? "border-amber bg-amber/5"
                : "border-border hover:border-amber/50"
            }`}
          >
            <ImageIcon className="h-6 w-6" />
            <span className="text-sm font-medium">Shelf</span>
          </button>
        </div>
      </Card>

      {/* Mode Selection */}
      <Tabs defaultValue="camera" value={mode} onValueChange={(v) => setMode(v as ScanMode)}>
        <TabsList className="w-full">
          <TabsTrigger value="camera" className="flex-1">
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">
            <ImageIcon className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera">
          <Card padding="lg" className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber/10">
              <Camera className="h-10 w-10 text-amber" />
            </div>
            <h3 className="font-medium text-foreground">Use your camera</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Take a photo of a beer label to identify it
            </p>
            <Button onClick={() => setStep("scanning")} size="lg">
              Open Camera
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card padding="lg">
            <ImageUpload
              onImageSelect={handleCapture}
              onOpenCamera={() => {
                setMode("camera");
                setStep("scanning");
              }}
            />
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tips */}
      <Card className="mt-6 bg-muted/50">
        <h3 className="font-medium text-foreground mb-2">Tips for best results</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Make sure the label is clearly visible and in focus</li>
          <li>• Avoid glare and reflections on the label</li>
          <li>• Include the full label in the frame</li>
          <li>• Good lighting helps improve accuracy</li>
        </ul>
      </Card>
    </div>
  );
}
