import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Achievements | BrewIQ",
  alternates: { canonical: "/achievements" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
