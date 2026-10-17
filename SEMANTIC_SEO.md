# SEO semantique MATLI.ma

Le balisage JSON-LD partage dans `src/lib/seo.tsx` decrit le site et les donnees
effectivement presentes sur chaque page. Il est rendu dans le HTML et echappe
les caracteres `<` pour empecher la fermeture d'un script par du contenu saisi.

- Organization et WebSite sont relies par des identifiants stables `@id`.
- L'accueil presente le service de mise en relation pour la location BTP au Maroc.
- Les pages de location, les pages locales et les entreprises sont des
  CollectionPage avec la liste des elements reellement affiches. La pagination
  conserve la position des resultats. Les recherches filtrees restent noindex.
- Les machines sont des Product associes a une ItemPage et a une offre de
  location `LeaseOut`, avec prix en MAD par jour et lien vers le proprietaire.
- Les fiches ne declarent pas de livraison gratuite, de delais de transport ou
  de conditions de retour non renseignes. Des avertissements optionnels de
  fiches de marchand peuvent subsister : MATLI propose des locations, et ne doit
  pas inventer des conditions de vente pour obtenir un indicateur vert.
- Les avis des machines sont declares seulement lorsque le nombre d'avis est
  fourni. Le nombre de machines d'une entreprise n'est jamais un nombre d'avis.
- Les fils d'Ariane visibles et leur BreadcrumbList utilisent les memes donnees.
- Une seule zone principale `main` entoure les pages modifiees. La page
  fonctionnement a sa propre canonical; les hreflang pointant tous vers
  l'accueil ont ete retires puisqu'aucune traduction distincte n'est publiee.

## Verification

```bash
npm run typecheck
npx playwright test e2e/seo.spec.ts --project="Desktop Chrome"
```

Les tests utilisent l'API factice E2E existante (ports 3100/3200), jamais la base
de production. Ils verifient le graphe, les offres de location, les listes
reelles, l'absence d'avis inventes et le HTML des pages publiques.

Apres deploiement, controler une fiche reelle et une page locale avec
https://validator.schema.org/ puis l'outil d'inspection d'URL de Search Console.
Les donnees structurees aident a comprendre les pages; elles ne garantissent
ni une position precise ni un resultat enrichi.

References :
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- https://schema.org/Offer (businessFunction / LeaseOut)
