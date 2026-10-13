import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/profile",
          "/my-rentals",
          "/login",
          "/register",
          "/forgot-password",
          "/reset-password",
          "/verify-email",
          "/service-unavailable",
          "/400",
          "/403",
          "/500",
        ],
      },
    ],
    sitemap: "https://www.matli.ma/sitemap.xml",
  };
}
