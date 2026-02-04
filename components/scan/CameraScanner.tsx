"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X, RotateCcw, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface CameraScannerProps {
  onCapture: (imageData: string) => void;
  onClose?: () => void;
  isProcessing?: boolean;
}

export function CameraScanner({ onCapture, onClose, isProcessing }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsReady(false);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsReady(true);
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Camera access denied. Please enable camera permissions.");
        } else if (err.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else {
          setError("Could not access camera. Please try again.");
        }
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Get image data
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    onCapture(imageData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      onCapture(imageData);
    };
    reader.readAsDataURL(file);
  };

  const switchCamera = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="relative flex flex-col h-full bg-black">
      {/* Video feed */}
      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <Camera className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-white mb-4">{error}</p>
            <Button onClick={startCamera}>Try Again</Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Viewfinder overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Darkened corners */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Clear center area */}
              <div className="absolute inset-8 sm:inset-16 lg:inset-24">
                <div className="relative w-full h-full border-2 border-white/80 rounded-2xl">
                  {/* Corner indicators */}
                  <div className="absolute -top-0.5 -left-0.5 w-8 h-8 border-t-4 border-l-4 border-amber rounded-tl-xl" />
                  <div className="absolute -top-0.5 -right-0.5 w-8 h-8 border-t-4 border-r-4 border-amber rounded-tr-xl" />
                  <div className="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-b-4 border-l-4 border-amber rounded-bl-xl" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-b-4 border-r-4 border-amber rounded-br-xl" />

                  {/* Center the frame */}
                  <div className="absolute inset-0 bg-transparent" />
                </div>

                {/* Instructions */}
                <p className="absolute -bottom-8 left-0 right-0 text-center text-white text-sm">
                  Center the beer label in the frame
                </p>
              </div>
            </div>

            {/* Processing overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10">
                <Loader2 className="h-12 w-12 text-amber animate-spin mb-4" />
                <p className="text-white text-lg font-medium">Analyzing beer...</p>
                <p className="text-white/70 text-sm mt-1">This may take a moment</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="relative z-20 bg-black safe-bottom">
        <div className="flex items-center justify-between px-6 py-6">
          {/* Gallery button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
              <ImageIcon className="h-6 w-6" />
            </div>
            <span className="text-xs">Gallery</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Capture button */}
          <button
            onClick={captureImage}
            disabled={!isReady || isProcessing}
            className={cn(
              "h-20 w-20 rounded-full border-4 border-white flex items-center justify-center transition-transform",
              isReady && !isProcessing
                ? "bg-white hover:scale-95 active:scale-90"
                : "bg-white/30"
            )}
          >
            <div className="h-16 w-16 rounded-full bg-white" />
          </button>

          {/* Switch camera button */}
          <button
            onClick={switchCamera}
            disabled={isProcessing}
            className="flex flex-col items-center gap-1 text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
              <RotateCcw className="h-6 w-6" />
            </div>
            <span className="text-xs">Flip</span>
          </button>
        </div>
      </div>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors safe-top"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
