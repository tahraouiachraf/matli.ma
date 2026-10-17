import { expect, test } from "@playwright/test";
import { collectionJsonLd, companyJsonLd, equipmentJsonLd, organizationJsonLd, websiteJsonLd } from "../src/lib/seo";
import type { Equipment } from "../src/types";

test("les offres décrivent une location par jour sans conditions inventées", () => {
  const equipment: Equipment = {
    id: 1, slug: "mini-pelle-test", title: "Mini-pelle de test", category: "Mini-pelles",
    brand: "Test", model: "Compact", year: 2024, city: "Rabat", region: "Rabat-Salé-Kénitra",
    priceDay: 950, priceWeek: 5000, status: "AVAILABLE", rating: 0, reviewsCount: 0,
    operator: false, delivery: true, image: "/favicon.png", companySlug: "test", companyName: "Entreprise test",
    description: "Mini-pelle disponible à Rabat.", specs: [], powerHp: 25, tonnage: 2.7,
  };
  const schema = equipmentJsonLd(equipment);
  expect(schema.offers.businessFunction).toContain("LeaseOut");
  expect(schema.offers.priceSpecification).toMatchObject({ price: 950, priceCurrency: "MAD", unitCode: "DAY" });
  expect(schema.offers.availability).toContain("InStock");
  expect(schema.offers).not.toHaveProperty("shippingDetails");
  expect(schema.offers).not.toHaveProperty("hasMerchantReturnPolicy");
  expect(schema).not.toHaveProperty("aggregateRating");
  expect(equipmentJsonLd({ ...equipment, status: "RESERVED" }).offers.availability).toContain("OutOfStock");
  expect(equipmentJsonLd({ ...equipment, rating: 4.5, reviewsCount: 2 }).aggregateRating?.reviewCount).toBe(2);
});

test("les listes et propriétaires n'inventent ni annonces ni avis", () => {
  const collection = collectionJsonLd("/rentals", "Machines", "Location BTP", [{ name: "Machine visible", path: "/equipment/visible" }], 12);
  expect(collection.mainEntity.numberOfItems).toBe(1);
  expect(collection.mainEntity.itemListElement[0]).toMatchObject({ position: 13, url: "https://www.matli.ma/equipment/visible" });
  expect(collectionJsonLd("/rentals", "Machines", "Location BTP", []).mainEntity.itemListElement).toEqual([]);
  const company = companyJsonLd({ slug: "test", name: "Test", city: "Rabat", region: "Rabat", logo: "T", rating: 5, equipmentCount: 30, description: "Parc de test" });
  expect(company).not.toHaveProperty("aggregateRating");
  expect(websiteJsonLd().publisher["@id"]).toBe(organizationJsonLd()["@id"]);
});

for (const [path, expectedType] of [["/", "Service"], ["/rentals", "CollectionPage"], ["/companies", "CollectionPage"], ["/how-it-works", "FAQPage"]]) {
  test(`balisage sémantique rendu côté serveur : ${path}`, async ({ request }) => {
    test.setTimeout(90_000);
    const response = await request.get(path, { timeout: 80_000 });
    expect(response.status()).toBe(200);
    const html = await response.text();
    const schemas = Array.from(html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g), (match) => JSON.parse(match[1]) as Record<string, unknown> | Array<Record<string, unknown>>).flat();
    expect(schemas.some((schema) => schema["@type"] === expectedType)).toBe(true);
    expect(schemas.some((schema) => schema["@type"] === "Organization")).toBe(true);
    expect((html.match(/<main\b/g) ?? []).length).toBe(1);
    if (path !== "/") {
      expect(schemas.some((schema) => schema["@type"] === "BreadcrumbList")).toBe(true);
      expect(html).toContain('aria-label="Fil d’Ariane"');
    }
    if (path === "/how-it-works") {
      expect(html).toContain('rel="canonical" href="https://www.matli.ma/how-it-works"');
    }
  });
}
