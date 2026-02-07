import type { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://brewiq-api-production.up.railway.app/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewiq.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: `${SITE_URL}/beers`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${SITE_URL}/breweries`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${SITE_URL}/recipes`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.8 },
    { url: `${SITE_URL}/sightings`, lastModified: new Date(), changeFrequency: "hourly" as const, priority: 0.7 },
    { url: `${SITE_URL}/leaderboard`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.5 },
    { url: `${SITE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  // Fetch dynamic slugs from API (wrap in try/catch to handle API failures gracefully)
  let beerPages: MetadataRoute.Sitemap = [];
  let breweryPages: MetadataRoute.Sitemap = [];
  let recipePages: MetadataRoute.Sitemap = [];

  try {
    const [beersRes, breweriesRes, recipesRes] = await Promise.all([
      fetch(`${API_URL}/beers?limit=1000&sortBy=updatedAt&sortOrder=desc`),
      fetch(`${API_URL}/breweries?limit=1000&sortBy=updatedAt&sortOrder=desc`),
      fetch(`${API_URL}/recipes?limit=1000&sortBy=updatedAt&sortOrder=desc`),
    ]);

    if (beersRes.ok) {
      const beers = await beersRes.json();
      beerPages = (beers.data?.data || []).map((beer: { slug: string; updatedAt: string }) => ({
        url: `${SITE_URL}/beers/${beer.slug}`,
        lastModified: new Date(beer.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }

    if (breweriesRes.ok) {
      const breweries = await breweriesRes.json();
      breweryPages = (breweries.data?.data || []).map((b: { slug: string; createdAt: string }) => ({
        url: `${SITE_URL}/breweries/${b.slug}`,
        lastModified: new Date(b.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }

    if (recipesRes.ok) {
      const recipes = await recipesRes.json();
      recipePages = (recipes.data?.data || []).map((r: { slug: string; updatedAt: string }) => ({
        url: `${SITE_URL}/recipes/${r.slug}`,
        lastModified: new Date(r.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
  } catch {
    // If API is unavailable, return static pages only
  }

  return [...staticPages, ...beerPages, ...breweryPages, ...recipePages];
}
