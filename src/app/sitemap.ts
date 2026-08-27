import type { MetadataRoute } from "next";
import { companies, equipment } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://matli.ma";

  return [
    "",
    "/location",
    "/machines-jcb",
    "/deposer",
    "/fonctionnement",
    "/guide",
    "/connexion",
    "/inscription",
    "/compte",
    "/profil",
    "/espace",
    ...equipment.map((item) => `/materiel/${item.slug}`),
    ...companies.map((company) => `/entreprise/${company.slug}`),
  ].map((url) => ({
    url: `${base}${url}`,
    lastModified: new Date(),
    changeFrequency: url === "" ? "daily" : "weekly",
    priority: url === "" ? 1 : 0.7,
  }));
}
