"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export function Avatar({ src, alt = "Avatar", fallback, size = "md", className }: AvatarProps) {
  const initials = fallback
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={size === "xl" ? "80px" : size === "lg" ? "56px" : "40px"}
        />
      ) : initials ? (
        <span className="font-medium text-muted-foreground">{initials}</span>
      ) : (
        <User className="h-1/2 w-1/2 text-muted-foreground" />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  avatars: Array<{ src?: string; alt?: string; fallback?: string }>;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = "sm", className }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size={size}
          className="ring-2 ring-card"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-muted ring-2 ring-card",
            sizeClasses[size]
          )}
        >
          <span className="font-medium text-muted-foreground">+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}
