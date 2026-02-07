import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan a Beer | BrewIQ",
  alternates: { canonical: "/scan" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
