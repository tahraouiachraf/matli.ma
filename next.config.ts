import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

const isProduction = process.env.NODE_ENV === "production";
const defaultApiUrl = "https://admin.matli.ma/api";
//const defaultApiUrl = "http://127.0.0.1:8000/api";
const configuredApiUrl = process.env.API_BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? defaultApiUrl;
const backendApiUrl = /^https?:\/\//i.test(configuredApiUrl)
  ? configuredApiUrl.replace(/\/$/, "")
  : defaultApiUrl;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/connexion", destination: "/login", permanent: true },
      { source: "/actualites/:path*", destination: "/news/:path*", permanent: true },
      { source: "/backend-indisponible", destination: "/service-unavailable", permanent: true },
      { source: "/conditions-generales", destination: "/terms", permanent: true },
      { source: "/confidentialite", destination: "/privacy", permanent: true },
      { source: "/deposer", destination: "/dashboard/equipment/new", permanent: true },
      { source: "/list-equipment", destination: "/dashboard/equipment/new", permanent: true },
      { source: "/entreprise/:path*", destination: "/company/:path*", permanent: true },
      { source: "/entreprises", destination: "/companies", permanent: true },
      { source: "/espace/calendrier", destination: "/dashboard/calendar", permanent: true },
      { source: "/espace/demandes", destination: "/dashboard/requests", permanent: true },
      { source: "/espace/locations", destination: "/dashboard/rentals", permanent: true },
      { source: "/espace/materiel", destination: "/dashboard/equipment", permanent: true },
      { source: "/espace/operateurs", destination: "/dashboard/operators", permanent: true },
      { source: "/espace/parametres", destination: "/dashboard/settings", permanent: true },
      { source: "/espace/statistiques", destination: "/dashboard/statistics", permanent: true },
      { source: "/espace/notifications", destination: "/dashboard/notifications", permanent: true },
      { source: "/espace/maintenance", destination: "/dashboard/maintenance", permanent: true },
      { source: "/espace/documents", destination: "/dashboard/documents", permanent: true },
      { source: "/espace/finances", destination: "/dashboard/finances", permanent: true },
      { source: "/espace/clients", destination: "/dashboard/clients", permanent: true },
      { source: "/espace", destination: "/dashboard", permanent: true },
      { source: "/fonctionnement", destination: "/how-it-works", permanent: true },
      { source: "/inscription", destination: "/register", permanent: true },
      { source: "/location/:path*", destination: "/rentals/:path*", permanent: true },
      { source: "/materiel/:path*", destination: "/equipment/:path*", permanent: true },
      { source: "/mentions-legales", destination: "/legal-notice", permanent: true },
      { source: "/mes-locations", destination: "/my-rentals", permanent: true },
      { source: "/mot-de-passe/oublie", destination: "/forgot-password", permanent: true },
      { source: "/mot-de-passe/reinitialiser", destination: "/reset-password", permanent: true },
      { source: "/politique-annulation", destination: "/cancellation-policy", permanent: true },
      { source: "/profil", destination: "/profile", permanent: true },
      { source: "/verification-email", destination: "/verify-email", permanent: true },
      { source: "/machines", destination: "/rentals", permanent: true },
      { source: "/guide", destination: "/how-it-works", permanent: true },
      { source: "/compte", destination: "/profile", permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: "/news/:path*", destination: "/actualites/:path*" },
      { source: "/service-unavailable", destination: "/backend-indisponible" },
      { source: "/terms", destination: "/conditions-generales" },
      { source: "/privacy", destination: "/confidentialite" },
      { source: "/company/:path*", destination: "/entreprise/:path*" },
      { source: "/companies", destination: "/entreprises" },
      { source: "/dashboard/calendar", destination: "/espace/calendrier" },
      { source: "/dashboard/requests", destination: "/espace/demandes" },
      { source: "/dashboard/rentals", destination: "/espace/locations" },
      { source: "/dashboard/equipment/new", destination: "/espace/materiel/nouveau" },
      { source: "/dashboard/equipment/:id/edit", destination: "/espace/materiel/:id/modifier" },
      { source: "/dashboard/equipment", destination: "/espace/materiel" },
      { source: "/dashboard/operators", destination: "/espace/operateurs" },
      { source: "/dashboard/settings", destination: "/espace/parametres" },
      { source: "/dashboard/statistics", destination: "/espace/statistiques" },
      { source: "/dashboard/notifications", destination: "/espace/notifications" },
      { source: "/dashboard/maintenance", destination: "/espace/maintenance" },
      { source: "/dashboard/documents", destination: "/espace/documents" },
      { source: "/dashboard/finances", destination: "/espace/finances" },
      { source: "/dashboard/clients", destination: "/espace/clients" },
      { source: "/dashboard", destination: "/espace" },
      { source: "/how-it-works", destination: "/fonctionnement" },
      { source: "/register", destination: "/inscription" },
      { source: "/rentals/:path*", destination: "/location/:path*" },
      { source: "/equipment/:path*", destination: "/materiel/:path*" },
      { source: "/legal-notice", destination: "/mentions-legales" },
      { source: "/my-rentals", destination: "/mes-locations" },
      { source: "/forgot-password", destination: "/mot-de-passe/oublie" },
      { source: "/reset-password", destination: "/mot-de-passe/reinitialiser" },
      { source: "/cancellation-policy", destination: "/politique-annulation" },
      { source: "/profile", destination: "/profil" },
      { source: "/verify-email", destination: "/verification-email" },
      {
        source: "/api/matli/:path*",
        destination: `${backendApiUrl}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "admin.matli.ma",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
  async headers() {
    const securityHeaders = [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Cross-Origin-Opener-Policy",
        value: "same-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(self), payment=()",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-ancestors 'self'",
          "img-src 'self' data: blob: https:",
          "font-src 'self' data:",
          "style-src 'self' 'unsafe-inline'",
          `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"} https://www.googletagmanager.com https://www.google-analytics.com`,
          `connect-src 'self'${isProduction ? "" : " http://127.0.0.1:8000"} https://admin.matli.ma https://www.google-analytics.com https://region1.google-analytics.com https://*.ingest.sentry.io`,
          ...(isProduction ? ["upgrade-insecure-requests"] : []),
        ].join("; "),
      },
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
