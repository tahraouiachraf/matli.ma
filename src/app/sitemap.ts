import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { equipmentMatchesLanding, seoLandingPages } from "@/lib/local-seo";
import { getCompanies, getEquipmentPageStrict, getNewsArticlesStrict } from "@/services/api/matli";
import type { Equipment } from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [equipment, companies, news] = await Promise.all([
    getAllEquipment(),
    getCompanies(),
    getNewsArticlesStrict(30).catch(() => []),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    page("", 1, "daily"),
    page("/rentals", 0.95, "daily"),
    page("/companies", 0.8, "weekly"),
    page("/news", 0.72, "weekly"),
    page("/how-it-works", 0.7, "monthly"),
    page("/help", 0.55, "monthly"),
    page("/register", 0.35, "monthly"),
    page("/terms", 0.3, "yearly"),
    page("/privacy", 0.3, "yearly"),
    page("/cancellation-policy", 0.3, "yearly"),
    page("/legal-notice", 0.3, "yearly"),
  ];

  const landingPages = seoLandingPages
    .filter((landing) => equipment.some((item) => equipmentMatchesLanding(item, landing)))
    .map((landing) => page(`/rentals/${landing.slug}`, landing.city ? 0.8 : 0.84, "daily"));

  const equipmentPages = equipment.map((item) =>
    page(`/equipment/${item.slug}`, 0.82, item.status === "AVAILABLE" ? "daily" : "weekly"),
  );

  const companyPages = companies.map((company) =>
    page(`/company/${company.slug}`, 0.72, "weekly"),
  );

  const newsPages = news.map((article) => ({
    ...page(`/news/${article.slug}`, 0.68, "monthly"),
    lastModified: new Date(article.updatedAt),
  }));

  return [...staticPages, ...landingPages, ...equipmentPages, ...companyPages, ...newsPages];
}

async function getAllEquipment(): Promise<Equipment[]> {
  try {
    const firstPage = await getEquipmentPageStrict({ perPage: 30, page: 1 });
    if (firstPage.lastPage <= 1) return firstPage.items;

    const remainingPages = await Promise.all(
      Array.from({ length: firstPage.lastPage - 1 }, (_, index) =>
        getEquipmentPageStrict({ perPage: 30, page: index + 2 }),
      ),
    );

    return [firstPage, ...remainingPages].flatMap((result) => result.items);
  } catch {
    return [];
  }
}

function page(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}
