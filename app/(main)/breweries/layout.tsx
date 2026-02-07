import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Breweries | BrewIQ",
  alternates: { canonical: "/breweries" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
