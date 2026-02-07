import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | BrewIQ",
  alternates: { canonical: "/notifications" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
