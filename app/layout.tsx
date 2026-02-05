import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Playfair_Display, Sora, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

// BrewIQ Brand Kit Fonts
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
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
    { media: "(prefers-color-scheme: light)", color: "#FFF8ED" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1208" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${playfair.variable} ${sora.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
