import type { Metadata } from "next";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://brewiq-api-production.up.railway.app/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewiq.ai";

interface BeerLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

async function fetchBeer(slug: string) {
  try {
    const res = await fetch(`${API_URL}/beers/${slug}`, {
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
}: BeerLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const beer = await fetchBeer(slug);
  if (!beer) return { title: "Beer Not Found | BrewIQ" };

  const description =
    beer.description ||
    `${beer.name} by ${beer.brewery?.name} - ${beer.style?.name}, ${beer.abv}% ABV. Rated ${beer.averageRating?.toFixed(1)}/5.`;

  return {
    title: `${beer.name} | BrewIQ`,
    description,
    alternates: { canonical: `/beers/${slug}` },
    openGraph: {
      title: `${beer.name} | BrewIQ`,
      description,
      url: `${SITE_URL}/beers/${slug}`,
      type: "website",
      ...(beer.imageUrl && {
        images: [{ url: beer.imageUrl, alt: beer.name }],
      }),
    },
  };
}

export default async function BeerLayout({
  children,
  params,
}: BeerLayoutProps) {
  const { slug } = await params;
  const beer = await fetchBeer(slug);

  const jsonLd = beer
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: beer.name,
        description: beer.description || `${beer.name} by ${beer.brewery?.name}`,
        image: beer.imageUrl,
        brand: { "@type": "Brand", name: beer.brewery?.name },
        ...(beer.averageRating > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: beer.averageRating,
            reviewCount: beer.reviewCount,
            bestRating: 5,
            worstRating: 1,
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
