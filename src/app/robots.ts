import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/espace",
          "/espace/",
          "/profil",
          "/mes-locations",
          "/backend-indisponible",
          "/400",
          "/403",
          "/500",
        ],
      },
    ],
    sitemap: "https://matli.ma/sitemap.xml",
  };
}
