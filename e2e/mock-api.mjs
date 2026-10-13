import { createServer } from "node:http";

const owner = { id: "owner-e2e", name: "Propriétaire E2E", email: "owner@matli.test", role: "owner", city: "Casablanca" };
const client = { id: "client-e2e", name: "Client E2E", email: "client.e2e@matli.test", role: "client", city: "Casablanca" };
const paginator = (data = []) => ({ data, current_page: 1, last_page: 1, per_page: 12, total: data.length });

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1:3200");
  const send = (status, body) => {
    response.writeHead(status, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://127.0.0.1:3100",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    });
    response.end(status === 204 ? undefined : JSON.stringify(body));
  };

  if (request.method === "OPTIONS") return send(204, {});
  if (url.pathname === "/api/health") return send(200, { status: "ok", checks: { database: true, cache: true, storage: true } });
  if (url.pathname === "/api/auth/register" && request.method === "POST") return send(201, { message: "Compte créé.", email: client.email, verification_email_sent: true });
  if (url.pathname === "/api/auth/login" && request.method === "POST") return send(200, { token_type: "Bearer", access_token: "e2e-client-token", expires_at: "2099-01-01T00:00:00Z", user: client });
  if (url.pathname === "/api/auth/me") return send(200, { user: request.headers.authorization?.includes("owner") ? owner : client, session: { expires_at: "2099-01-01T00:00:00Z" } });
  if (url.pathname === "/api/auth/logout") return send(200, { message: "Déconnexion réussie." });
  if (url.pathname === "/api/meta") return send(200, { cities: ["Casablanca"], brands: ["JCB"], models: ["3CX"], statuses: {}, account_types: [] });
  if (url.pathname === "/api/categories") return send(200, []);
  if (url.pathname === "/api/equipment") return send(200, paginator());
  if (url.pathname === "/api/companies") return send(200, paginator());
  if (url.pathname === "/api/news") return send(200, paginator());
  if (url.pathname === "/api/marketplace/summary") return send(200, { stats: {}, featured_equipment: [], categories: [] });
  if (url.pathname.startsWith("/api/workspace/") || url.pathname.startsWith("/api/client/") || url.pathname === "/api/notifications") return send(200, paginator());
  if (url.pathname === "/api/analytics/events") return send(202, { recorded: true });
  return send(404, { message: "Ressource de test introuvable." });
});

server.listen(3200, "127.0.0.1", () => console.log("MATLI E2E API ready on 3200"));

const shutdown = () => server.close(() => process.exit(0));
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
