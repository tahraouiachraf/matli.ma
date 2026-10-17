import type { Company, Equipment } from "@/types";

export const siteUrl = "https://www.matli.ma";
export const siteName = "MATLI.ma";
export const siteDescription =
  "Location de matériel BTP au Maroc: comparez JCB 3CX, tractopelles, mini-pelles, chariots télescopiques, pelles et chargeuses sur MATLI.ma.";

export function absoluteUrl(path = "") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    logo: absoluteUrl("/favicon.png"),
    sameAs: ["https://www.instagram.com/matlimaroc/"],
    areaServed: { "@type": "Country", name: "Maroc", identifier: "MA" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      areaServed: "MA",
      availableLanguage: ["fr", "ar"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteName,
    url: siteUrl,
    inLanguage: "fr-MA",
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/rentals")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function marketplaceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl("/#rental-service"),
    name: "Mise en relation pour la location de matériel BTP au Maroc",
    serviceType: "Marketplace de location de matériel BTP",
    description: siteDescription,
    url: absoluteUrl("/rentals"),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: { "@type": "Country", name: "Maroc", identifier: "MA" },
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": absoluteUrl(`${items.at(-1)?.path ?? "/"}#breadcrumb`),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path),
    })),
  };
}

export function pageJsonLd(path: string, name: string, description: string, type = "WebPage") {
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": absoluteUrl(`${path}#webpage`),
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "fr-MA",
    isPartOf: { "@id": absoluteUrl("/#website") },
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

export function collectionJsonLd(path: string, name: string, description: string, items: Array<{ name: string; path: string }>, offset = 0) {
  return {
    ...pageJsonLd(path, name, description, "CollectionPage"),
    mainEntity: {
      "@type": "ItemList",
      "@id": absoluteUrl(`${path}#items`),
      name,
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem", position: offset + index + 1, name: item.name, url: absoluteUrl(item.path),
      })),
    },
  };
}

export function companyJsonLd(company: Company) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl(`/company/${company.slug}#organization`),
    name: company.name,
    description: company.description,
    url: absoluteUrl(`/company/${company.slug}`),
    address: {
      "@type": "PostalAddress", addressLocality: company.city, addressRegion: company.region, addressCountry: "MA",
    },
  };
}

export function equipmentJsonLd(item: Equipment) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": absoluteUrl(`/equipment/${item.slug}#equipment`),
    url: absoluteUrl(`/equipment/${item.slug}`),
    mainEntityOfPage: { "@id": absoluteUrl(`/equipment/${item.slug}#webpage`) },
    name: item.title,
    brand: {
      "@type": "Brand",
      name: item.brand,
    },
    model: item.model,
    image: (item.images?.length ? item.images : [item.image]).map((image) => image.startsWith("http") ? image : absoluteUrl(image)),
    description: item.description,
    category: item.category,
    additionalProperty: [
      { "@type": "PropertyValue", name: "Année", value: item.year },
      ...(item.powerHp ? [{ "@type": "PropertyValue", name: "Puissance", value: item.powerHp, unitText: "ch" }] : []),
      ...(item.tonnage ? [{ "@type": "PropertyValue", name: "Tonnage", value: item.tonnage, unitText: "t" }] : []),
    ],
    ...(item.reviewsCount && item.rating ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: item.rating,
        reviewCount: item.reviewsCount,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
    offers: {
      "@type": "Offer",
      businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
      price: item.priceDay,
      priceCurrency: "MAD",
      availability: item.status === "AVAILABLE" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/equipment/${item.slug}`),
      itemCondition: "https://schema.org/UsedCondition",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: item.priceDay,
        priceCurrency: "MAD",
        unitCode: "DAY",
        unitText: "jour",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "DAY" },
      },
      availableAtOrFrom: { "@type": "Place", name: item.city },
      seller: {
        "@type": "Organization",
        "@id": absoluteUrl(`/company/${item.companySlug}#organization`),
        name: item.companyName,
        url: absoluteUrl(`/company/${item.companySlug}`),
      },
    },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Array<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
