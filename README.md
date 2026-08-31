# MATLI.ma Frontend

MATLI.ma est une marketplace marocaine pour louer et déposer des machines BTP. Le frontend Next.js permet aux clients de rechercher du matériel, comparer les prix, consulter les propriétaires et accéder à un espace connecté pour suivre les locations.

## Fonctionnalités

- Accueil marketplace avec offres machines chargées depuis l’API Laravel.
- Catalogue `/location` avec machines, catégories, villes et demandes clients.
- Détail matériel `/materiel/[slug]`.
- Page entreprise `/entreprise/[slug]`.
- Authentification frontend via token Bearer Laravel.
- Inscription propriétaire/client.
- Espace connecté propriétaire/client protégé.
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
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
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
- `GET /api/companies/{slug}`
- `GET /api/marketplace/requests`
- `GET /api/workspace/dashboard`

## Vérification

```bash
npm run build
```
