"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Camera, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/hooks/useAuth";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/beers", icon: Search, label: "Discover" },
  { href: "/scan", icon: Camera, label: "Scan", isMain: true },
  { href: "/sightings", icon: MapPin, label: "Sightings" },
  { href: "/profile", icon: User, label: "Profile", requiresAuth: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  return (
    <nav role="navigation" aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          // Skip auth-required items if not authenticated
          if (item.requiresAuth && !isAuthenticated) {
            return (
              <Link
                key={item.href}
                href="/login"
                aria-label={item.label}
                className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground"
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span className="text-[10px] mt-1">{item.label}</span>
              </Link>
            );
          }

          const isActive = pathname === item.href;

          // Main scan button
          if (item.isMain) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                aria-current={pathname === item.href ? "page" : undefined}
                className="flex items-center justify-center -mt-5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber shadow-beer transition-transform active:scale-95">
                  <item.icon className="h-7 w-7 text-stout-800" aria-hidden="true" />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors touch-target",
                isActive ? "text-amber" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
