"use client";

import { useCallback, useState } from "react";
import { Upload, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

interface ImageUploadProps {
  onImageSelect: (imageData: string) => void;
  onOpenCamera?: () => void;
  className?: string;
}

export function ImageUpload({ onImageSelect, onOpenCamera, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setPreview(imageData);
        onImageSelect(imageData);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const clearPreview = () => {
    setPreview(null);
  };

  if (preview) {
    return (
      <div className={cn("relative rounded-xl overflow-hidden", className)}>
        <img
          src={preview}
          alt="Selected image"
          className="w-full h-64 object-cover"
        />
        <button
          onClick={clearPreview}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-colors",
          isDragging
            ? "border-amber bg-amber/5"
            : "border-border hover:border-amber/50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">
              Drop an image here, or click to browse
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Or use camera */}
      {onOpenCamera && (
        <div className="flex items-center gap-4">
          <div className="flex-1 border-t border-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 border-t border-border" />
        </div>
      )}

      {onOpenCamera && (
        <Button
          variant="outline"
          onClick={onOpenCamera}
          className="w-full"
        >
          <Camera className="h-4 w-4 mr-2" />
          Use Camera
        </Button>
      )}
    </div>
  );
}
