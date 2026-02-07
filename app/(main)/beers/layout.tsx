import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Beers | BrewIQ",
  alternates: { canonical: "/beers" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
