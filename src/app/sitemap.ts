import type { MetadataRoute } from "next";
import { categories } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";
import { getCompanies, getEquipmentList } from "@/services/api/matli";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [equipment, companies] = await Promise.all([
    getEquipmentList({ perPage: 30 }),
    getCompanies(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    page("", 1, "daily"),
    page("/location", 0.95, "daily"),
    page("/machines", 0.85, "weekly"),
    page("/deposer", 0.75, "weekly"),
    page("/fonctionnement", 0.7, "monthly"),
    page("/inscription", 0.35, "monthly"),
  ];

  const categoryPages = categories.map((category) =>
    page(`/location?category=${category.slug}`, 0.78, "weekly"),
  );

  const equipmentPages = equipment.map((item) =>
    page(`/materiel/${item.slug}`, 0.82, item.status === "AVAILABLE" ? "daily" : "weekly"),
  );

  const companyPages = companies.map((company) =>
    page(`/entreprise/${company.slug}`, 0.72, "weekly"),
  );

  return [...staticPages, ...categoryPages, ...equipmentPages, ...companyPages];
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
