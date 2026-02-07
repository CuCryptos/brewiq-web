import type { Metadata } from "next";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://brewiq-api-production.up.railway.app/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://brewiq.ai";

interface RecipeLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

async function fetchRecipe(slug: string) {
  try {
    const res = await fetch(`${API_URL}/recipes/${slug}`, {
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
}: RecipeLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await fetchRecipe(slug);
  if (!recipe) return { title: "Recipe Not Found | BrewIQ" };

  const author = recipe.user?.displayName || recipe.user?.username || "BrewIQ";
  const description =
    recipe.description ||
    `${recipe.name} - ${recipe.style?.name} homebrew recipe by ${author}. ${recipe.abv}% ABV, ${recipe.ibu} IBU, ${recipe.batchSize} ${recipe.batchSizeUnit} batch.`;

  return {
    title: `${recipe.name} | BrewIQ`,
    description,
    alternates: { canonical: `/recipes/${slug}` },
    openGraph: {
      title: `${recipe.name} | BrewIQ`,
      description,
      url: `${SITE_URL}/recipes/${slug}`,
      type: "website",
    },
  };
}

export default async function RecipeLayout({
  children,
  params,
}: RecipeLayoutProps) {
  const { slug } = await params;
  const recipe = await fetchRecipe(slug);

  const author = recipe?.user?.displayName || recipe?.user?.username || "BrewIQ";

  const jsonLd = recipe
    ? {
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: recipe.name,
        description:
          recipe.description ||
          `${recipe.name} - ${recipe.style?.name} homebrew recipe`,
        author: { "@type": "Person", name: author },
        ...(recipe.style?.name && { recipeCategory: recipe.style.name }),
        ...(recipe.batchSize && {
          recipeYield: `${recipe.batchSize} ${recipe.batchSizeUnit}`,
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
