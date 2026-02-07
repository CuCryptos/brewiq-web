"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Beer,
  Search,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Bookmark,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { useAuth } from "@/lib/hooks/useAuth";
import { useUIStore } from "@/lib/stores/uiStore";
import { useNotificationSocket } from "@/lib/hooks/useSocket";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/beers", label: "Discover" },
  { href: "/breweries", label: "Breweries" },
  { href: "/sightings", label: "Sightings" },
  { href: "/recipes", label: "Recipes" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { setSearchOpen, isMobileNavOpen, setMobileNavOpen } = useUIStore();
  const { unreadCount } = useNotificationSocket();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber">
              <Beer className="h-5 w-5 text-stout-800" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              BrewIQ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-amber/10 text-amber"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link href="/notifications">
                  <Button variant="ghost" size="icon" className="relative" aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}>
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        size="sm"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted transition-colors"
                  >
                    <Avatar
                      src={user?.avatar}
                      fallback={user?.displayName || user?.username}
                      size="sm"
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-lg animate-scale-in origin-top-right">
                      <div className="p-3 border-b border-border">
                        <p className="font-medium text-foreground truncate">
                          {user?.displayName || user?.username}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          href="/profile?tab=saved"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                        >
                          <Bookmark className="h-4 w-4" />
                          Saved Beers
                        </Link>
                        <Link
                          href="/achievements"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                        >
                          <Trophy className="h-4 w-4" />
                          Achievements
                        </Link>
                        <Link
                          href="/profile/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t border-border">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileNavOpen(!isMobileNavOpen)}
              aria-label="Toggle menu"
            >
              {isMobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileNavOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-base font-medium transition-colors",
                  pathname === link.href
                    ? "bg-amber/10 text-amber"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-border mt-4 space-y-2">
                <Link href="/login" onClick={() => setMobileNavOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileNavOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
