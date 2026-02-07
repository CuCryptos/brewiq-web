import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beer Sightings | BrewIQ",
  alternates: { canonical: "/sightings" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
