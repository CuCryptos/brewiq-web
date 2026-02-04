import Link from "next/link";
import { Beer } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Header */}
      <header className="py-6 px-4">
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber">
            <Beer className="h-6 w-6 text-stout-800" />
          </div>
          <span className="text-2xl font-bold text-stout-800">BrewIQ</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BrewIQ. All rights reserved.</p>
      </footer>
    </div>
  );
}
