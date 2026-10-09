import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const owner = { id: "owner-test", name: "Propriétaire Test", email: "owner@matli.test", role: "owner", company_name: "Atlas Test", city: "Casablanca" };

async function mockOwnerApi(page: Page) {
  await page.addInitScript((user) => {
    localStorage.setItem("matli-api-token", "e2e-token");
    localStorage.setItem("matli-user", JSON.stringify(user));
    localStorage.setItem("matli-authenticated", "true");
    localStorage.setItem("matli-cookie-consent", "refused");
  }, owner);

  await page.route("**/api/matli/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    let body: unknown = {};
    if (path.endsWith("/auth/me")) body = { user: owner };
    else if (path.endsWith("/workspace/dashboard")) body = dashboardFixture();
    else if (path.includes("/workspace/equipment")) body = paginator([]);
    else if (path.includes("/workspace/reservations")) body = paginator([]);
    else if (path.includes("/marketplace/requests")) body = paginator([]);
    else if (path.includes("/notifications")) body = paginator([]);
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
}

test("navigation mobile, aide et accessibilité clavier", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow-x", /^(visible|hidden|clip)$/);
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);

  const menu = page.getByRole("button", { name: /menu/i }).first();
  if (await menu.isVisible()) {
    await menu.click({ force: true });
    await expect(page.getByRole("navigation", { name: "Navigation mobile", exact: true })).toBeVisible();
  }

  await page.goto("/help");
  await expect(page.getByRole("heading", { name: /ouvrir un dossier support/i })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  const accessibility = await new AxeBuilder({ page }).exclude("[data-brand-logo]").withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(accessibility.violations).toEqual([]);
});

test("catalogue utilisable sur réseau mobile lent", async ({ page }) => {
  await page.route("**/api/matli/equipment**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(paginator([])) });
  });
  await page.route("**/api/matli/meta", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ cities: ["Casablanca"], brands: ["JCB"], models: ["3CX"] }) }));
  await page.goto("/rentals");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
});

test("calendrier propriétaire et sélection de plusieurs photos", async ({ page }) => {
  await mockOwnerApi(page);
  await page.goto("/dashboard/calendar");
  await expect(page.getByRole("heading", { name: "Calendrier", exact: true })).toBeVisible();
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);

  await page.goto("/dashboard/equipment/new");
  const gallery = page.locator('input[name="gallery_images"]');
  await gallery.setInputFiles([
    { name: "machine-cabine.jpg", mimeType: "image/jpeg", buffer: Buffer.from("photo-cabine") },
    { name: "machine-godet.jpg", mimeType: "image/jpeg", buffer: Buffer.from("photo-godet") },
  ]);
  await expect.poll(() => gallery.evaluate((input: HTMLInputElement) => input.files?.length ?? 0)).toBe(2);
  expect(await horizontalOverflow(page)).toBeLessThanOrEqual(1);
});

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

function paginator<T>(data: T[]) {
  return { data, current_page: 1, last_page: 1, per_page: 12, total: data.length };
}

function dashboardFixture() {
  return {
    profile: owner,
    stats: { equipment: 0, available_equipment: 0, reservations: 0, pending_reservations: 0, unread_notifications: 0, active_reservations: 0, overdue_reservations: 0, maintenance_due: 0, estimated_revenue: 0 },
    alerts: [],
    conversion: { period_days: 30, searches: 0, zero_result_searches: 0, equipment_views: 0, reservation_requests: 0, confirmed_reservations: 0, view_to_request_rate: 0, request_to_confirmation_rate: 0, search_to_view_rate: 0, zero_result_rate: 0, average_owner_response_minutes: null, top_viewed_equipment: [], top_zero_result_searches: [] },
    recent_reservations: [],
    notifications: [],
  };
}
