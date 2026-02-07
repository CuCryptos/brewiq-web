import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homebrew Recipes | BrewIQ",
  alternates: { canonical: "/recipes" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
