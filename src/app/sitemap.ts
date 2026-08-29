import type { MetadataRoute } from "next";
import { companies, equipment } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://matli.ma";

  return [
    "",
    "/location",
    "/machines",
    "/deposer",
    "/fonctionnement",
    "/connexion",
    "/inscription",
    "/profil",
    "/mes-locations",
    "/espace",
    "/espace/materiel",
    "/espace/locations",
    "/espace/demandes",
    "/espace/calendrier",
    "/espace/maintenance",
    "/espace/clients",
    "/espace/operateurs",
    "/espace/finances",
    "/espace/documents",
    "/espace/equipe",
    "/espace/statistiques",
    "/espace/notifications",
    "/espace/parametres",
    ...equipment.map((item) => `/materiel/${item.slug}`),
    ...companies.map((company) => `/entreprise/${company.slug}`),
  ].map((url) => ({
    url: `${base}${url}`,
    lastModified: new Date(),
    changeFrequency: url === "" ? "daily" : "weekly",
    priority: url === "" ? 1 : 0.7,
  }));
}
