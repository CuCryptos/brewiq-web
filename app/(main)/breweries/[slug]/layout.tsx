import type { Metadata } from "next";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://brewiq-api-production.up.railway.app/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewiq.ai";

interface BreweryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

async function fetchBrewery(slug: string) {
  try {
    const res = await fetch(`${API_URL}/breweries/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: BreweryLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const brewery = await fetchBrewery(slug);
  if (!brewery) return { title: "Brewery Not Found | BrewIQ" };

  const location = [brewery.city, brewery.state, brewery.country]
    .filter(Boolean)
    .join(", ");
  const description =
    brewery.description ||
    `${brewery.name} - Craft brewery in ${location}. ${brewery.beersCount} beers, rated ${brewery.averageRating?.toFixed(1)}/5.`;

  return {
    title: `${brewery.name} | BrewIQ`,
    description,
    alternates: { canonical: `/breweries/${slug}` },
    openGraph: {
      title: `${brewery.name} | BrewIQ`,
      description,
      url: `${SITE_URL}/breweries/${slug}`,
      type: "website",
      ...(brewery.logoUrl && {
        images: [{ url: brewery.logoUrl, alt: brewery.name }],
      }),
    },
  };
}

export default async function BreweryLayout({
  children,
  params,
}: BreweryLayoutProps) {
  const { slug } = await params;
  const brewery = await fetchBrewery(slug);

  const location = [brewery?.city, brewery?.state, brewery?.country]
    .filter(Boolean)
    .join(", ");

  const jsonLd = brewery
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: brewery.name,
        description:
          brewery.description || `${brewery.name} - Craft brewery in ${location}`,
        ...(brewery.logoUrl && { logo: brewery.logoUrl }),
        ...(brewery.website && { url: brewery.website }),
        ...(location && {
          address: {
            "@type": "PostalAddress",
            ...(brewery.city && { addressLocality: brewery.city }),
            ...(brewery.state && { addressRegion: brewery.state }),
            ...(brewery.country && { addressCountry: brewery.country }),
          },
        }),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
