import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";

const SearchModal = dynamic(
  () => import("@/components/layout/SearchModal").then((m) => ({ default: m.SearchModal })),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "BrewIQ",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-4 focus:py-2 focus:rounded-md focus:ring-2 focus:ring-primary focus:text-foreground">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomNav />
      <SearchModal />
    </div>
  );
}
