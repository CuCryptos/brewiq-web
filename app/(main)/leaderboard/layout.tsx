import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | BrewIQ",
  alternates: { canonical: "/leaderboard" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
