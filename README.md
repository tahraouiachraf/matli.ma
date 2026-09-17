# MATLI.ma Frontend

MATLI.ma est une marketplace marocaine pour louer et déposer des machines BTP. Le frontend Next.js permet aux clients de rechercher du matériel, comparer les prix, consulter les propriétaires et accéder à un espace connecté pour suivre les locations.

## Fonctionnalités

- Accueil marketplace avec offres machines chargées depuis l’API Laravel.
- Catalogue `/location` paginé avec machines, catégories, villes et demandes clients.
- Recherche avancée avec suggestions, filtres persistants, tris et URL partageable.
- Pages SEO locales `/location/[categorie-ville]` intégrées au sitemap.
- Détail matériel `/materiel/[slug]` avec galerie, caractéristiques, calendrier, avis et machines similaires.
- Page entreprise `/entreprise/[slug]`.
- Authentification frontend via token Bearer Laravel.
- Inscription propriétaire/client.
- Espace connecté propriétaire/client protégé.
- Dashboard alimenté par Laravel avec actions rapides, alertes et états vides utiles.
- Centre de notifications avec compteur non lu, lecture et préférences email/application.
- Suivi commercial avec consentement: recherches, fiches vues, demandes et réservations.
- Sentry côté navigateur, serveur et edge, avec remontée des erreurs API 500.
- Contrôle Lighthouse CI sur les pages publiques principales.
- Pages d’erreurs professionnelles: 400, 403, 404, 500 et backend indisponible.

## Stack technique

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- API Laravel: `NEXT_PUBLIC_API_URL`

## Structure

```text
src/app                 Routes Next.js
src/components          UI, layout, dashboard, forms, marketplace
src/components/errors   Composants pages erreurs
src/services/api        Client API Laravel et mappers
src/lib                 Données fallback et helpers
src/types               Types métier frontend
public/equipment        Images machines locales
```

## Configuration

Créer un fichier `.env.local` si besoin:

```env
# Local:
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# Production:
NEXT_PUBLIC_API_URL=https://portail.joblik.ma/api
NEXT_PUBLIC_GA_ID=G-1CYERG8JGX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=code-fourni-par-search-console
```

## Lancer le projet

```bash
npm install
npm run dev
```

Frontend local:

```text
http://localhost:3000
```

## Backend requis

Le backend Laravel doit tourner sur:

```text
http://127.0.0.1:8000/api
```

Commande côté backend:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

## Endpoints consommés

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/categories`
- `GET /api/equipment`
- `GET /api/equipment/{slug}`
- `GET /api/equipment/{slug}/similar`
- `GET /api/equipment/{slug}/availability`
- `POST /api/equipment/{equipment}/reports`
- `GET /api/search/suggestions`
- `GET /api/notifications`
- `PATCH /api/notifications/read-all`
- `PATCH /api/notifications/{notification}/read`
- `GET /api/notification-preferences`
- `PUT /api/notification-preferences`
- `POST /api/analytics/events`
- `GET /api/companies/{slug}`
- `GET /api/marketplace/requests`
- `GET /api/workspace/dashboard`

## Vérification

```bash
npm run build
npm run lighthouse
```

## Confidentialité

Google Analytics est chargé uniquement après consentement explicite. Les conditions générales, la politique de confidentialité, la politique d’annulation et les mentions légales sont intégrées au sitemap.
