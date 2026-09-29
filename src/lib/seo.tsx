import type { Equipment } from "@/types";

export const siteUrl = "https://www.matli.ma";
export const siteName = "MATLI.ma";
export const siteDescription =
  "Marketplace marocaine pour louer, comparer et déposer des machines BTP: tractopelles, mini-pelles, chariots télescopiques, pelles et chargeuses.";

export function absoluteUrl(path = "") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: absoluteUrl("/favicon.ico"),
    sameAs: ["https://www.instagram.com/matlimaroc/", "https://www.linkedin.com/"],
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
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/rentals")}?category={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function marketplaceJsonLd() {
  const categories = [
    { name: "Tractopelles", slug: "tractopelles" },
    { name: "Mini-pelles", slug: "mini-pelles" },
    { name: "Chariots télescopiques", slug: "chariots-telescopiques" },
    { name: "Pelles sur chenilles", slug: "pelles-sur-chenilles" },
    { name: "Chargeuses sur pneumatiques", slug: "chargeuses-sur-pneumatiques" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Machines BTP à louer au Maroc",
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: category.name,
      url: absoluteUrl(`/rentals?category=${category.slug}`),
    })),
  };
}

export function equipmentJsonLd(item: Equipment) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    brand: {
      "@type": "Brand",
      name: item.brand,
    },
    model: item.model,
    image: item.image.startsWith("http") ? item.image : absoluteUrl(item.image),
    description: item.description,
    category: item.category,
    offers: {
      "@type": "Offer",
      price: item.priceDay,
      priceCurrency: "MAD",
      availability: item.status === "AVAILABLE" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
      url: absoluteUrl(`/equipment/${item.slug}`),
      itemCondition: "https://schema.org/UsedCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: item.delivery ? 0 : 0,
          currency: "MAD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "MA",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: item.delivery ? 1 : 0,
            maxValue: item.delivery ? 3 : 0,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "MA",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
      seller: {
        "@type": "Organization",
        name: item.companyName,
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
