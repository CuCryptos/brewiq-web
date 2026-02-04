import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL?.startsWith("http")
      ? process.env.NEXT_PUBLIC_APP_URL
      : `https://${process.env.NEXT_PUBLIC_APP_URL || "brewiq.ai"}`
  ),
  title: {
    default: "BrewIQ - Discover & Rate Craft Beer",
    template: "%s | BrewIQ",
  },
  description:
    "Scan, discover, and rate craft beers with AI-powered IQ scores. Find nearby sightings, create homebrew recipes, and connect with beer enthusiasts.",
  keywords: [
    "craft beer",
    "beer scanner",
    "beer rating",
    "beer discovery",
    "homebrew",
    "beer recipes",
    "brewery finder",
  ],
  authors: [{ name: "BrewIQ" }],
  creator: "BrewIQ",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brewiq.ai",
    siteName: "BrewIQ",
    title: "BrewIQ - Discover & Rate Craft Beer",
    description:
      "Scan, discover, and rate craft beers with AI-powered IQ scores.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "BrewIQ - Craft Beer Discovery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrewIQ - Discover & Rate Craft Beer",
    description:
      "Scan, discover, and rate craft beers with AI-powered IQ scores.",
    images: ["/images/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#1C1917" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
