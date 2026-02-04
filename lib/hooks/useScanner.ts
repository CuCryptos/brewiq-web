"use client";

import { useState, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scansApi } from "@/lib/api/scans";
import type { ScanType } from "@/lib/types";
import { useUIStore } from "@/lib/stores/uiStore";

export const scanKeys = {
  all: ["scans"] as const,
  history: () => [...scanKeys.all, "history"] as const,
  detail: (id: string) => [...scanKeys.all, id] as const,
};

export function useScanner() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setIsCapturing(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to access camera";
      setError(message);
      console.error("Camera error:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  }, [stream]);

  const captureImage = useCallback(() => {
    if (!videoRef.current) return null;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);

    return dataUrl;
  }, []);

  const clearCapture = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const dataUrlToFile = useCallback(
    async (dataUrl: string, filename = "scan.jpg"): Promise<File> => {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return new File([blob], filename, { type: "image/jpeg" });
    },
    []
  );

  return {
    videoRef,
    stream,
    isCapturing,
    capturedImage,
    error,
    startCamera,
    stopCamera,
    captureImage,
    clearCapture,
    dataUrlToFile,
  };
}

export function useCreateScan() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: async ({
      image,
      scanType,
    }: {
      image: File;
      scanType: ScanType;
    }) => {
      const scan = await scansApi.create({ image, scanType });
      // Poll for completion
      return scansApi.waitForCompletion(scan.id);
    },
    onSuccess: (scan) => {
      queryClient.invalidateQueries({ queryKey: scanKeys.history() });
      if (scan.status === "completed" && scan.results?.length) {
        showSuccess(
          "Scan complete!",
          `Found ${scan.results.length} beer${scan.results.length > 1 ? "s" : ""}`
        );
      } else if (scan.status === "failed") {
        showError("Scan failed", "Could not identify any beers in this image");
      }
    },
    onError: () => {
      showError("Scan failed", "Something went wrong with the scan");
    },
  });
}

export function useScanHistory(page = 1, limit = 20) {
  return useQuery({
    queryKey: [...scanKeys.history(), page],
    queryFn: () => scansApi.getHistory(page, limit),
  });
}

export function useScan(scanId: string) {
  return useQuery({
    queryKey: scanKeys.detail(scanId),
    queryFn: () => scansApi.getById(scanId),
    enabled: !!scanId,
  });
}
