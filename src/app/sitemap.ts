import type { MetadataRoute } from "next";
import { categories } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import { localSeoPages } from "@/lib/local-seo";
import { getCompanies, getEquipmentList, getNewsArticlesStrict } from "@/services/api/matli";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [equipment, companies, news] = await Promise.all([
    getEquipmentList({ perPage: 30 }),
    getCompanies(),
    getNewsArticlesStrict(30).catch(() => []),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    page("", 1, "daily"),
    page("/rentals", 0.95, "daily"),
    page("/companies", 0.8, "weekly"),
    page("/news", 0.72, "weekly"),
    page("/how-it-works", 0.7, "monthly"),
    page("/register", 0.35, "monthly"),
    page("/terms", 0.3, "yearly"),
    page("/privacy", 0.3, "yearly"),
    page("/cancellation-policy", 0.3, "yearly"),
    page("/legal-notice", 0.3, "yearly"),
  ];

  const categoryPages = categories.map((category) =>
    page(`/rentals?category=${category.slug}`, 0.78, "weekly"),
  );

  const localPages = localSeoPages.map((item) =>
    page(`/rentals/${item.slug}`, 0.8, "daily"),
  );

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

  return [...staticPages, ...categoryPages, ...localPages, ...equipmentPages, ...companyPages, ...newsPages];
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
