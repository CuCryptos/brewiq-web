import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | BrewIQ",
  alternates: { canonical: "/pricing" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
