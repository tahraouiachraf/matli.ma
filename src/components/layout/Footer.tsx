"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAuth } from "@/components/providers/AuthProvider";
import { getWorkspaceRole, isOwnerWorkspaceRole } from "@/lib/workspace-access";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[19px]" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[19px]" aria-hidden="true" fill="currentColor">
      <path d="M5.1 8.8h3.3V19H5.1V8.8Zm1.7-4.9a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8ZM10.4 8.8h3.1v1.4h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.2 3.9 5V19h-3.3v-4.9c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6v5h-3.3V8.8Z" />
    </svg>
  );
}

export function Footer() {
  const { connected, user } = useAuth();
  const canDeposit = connected && isOwnerWorkspaceRole(getWorkspaceRole(user));
  const ownerLinks = [
    ...(canDeposit ? [["Déposer un matériel", "/list-equipment"]] : []),
    ...(!connected ? [["Créer un compte", "/register"], ["Se connecter", "/login"]] : []),
  ];

  return (
    <footer className="border-t border-neutral-200 bg-white text-neutral-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.05fr_2fr] lg:px-8">
        <div>
          <BrandLogo imageClassName="size-11" textClassName="text-2xl" />
          <p className="mt-4 max-w-md text-sm leading-6 text-neutral-600">
            La plateforme marocaine de location et de gestion de matériel professionnel.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Link
              href="https://www.instagram.com/matlimaroc/"
              aria-label="MATLI sur Instagram"
              className="grid size-10 place-items-center rounded-md border border-neutral-200 text-neutral-700 transition hover:border-orange-500 hover:text-orange-600"
            >
              <InstagramIcon />
            </Link>
            <Link
              href="https://www.linkedin.com/"
              aria-label="MATLI sur LinkedIn"
              className="grid size-10 place-items-center rounded-md border border-neutral-200 text-neutral-700 transition hover:border-orange-500 hover:text-orange-600"
            >
              <LinkedinIcon />
            </Link>
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Marketplace", [["Location", "/rentals"], ["Entreprises", "/companies"]]],
            ["Propriétaires", ownerLinks],
            ["Compte", [["Profil", "/profile"], ["Mes locations", "/my-rentals"], ["Dashboard", "/dashboard"]]],
            ["MATLI", [["Fonctionnement", "/how-it-works"], ["Conseils location", "/how-it-works#conseils"], ["Contact", "mailto:contact@matli.ma"]]],
          ].filter(([, links]) => (links as string[][]).length > 0).map(([title, links]) => (
            <div key={title as string}>
              <h3 className="font-semibold text-neutral-950">{title}</h3>
              <div className="mt-4 grid gap-3 text-sm text-neutral-600">
                {(links as string[][]).map(([label, href]) => (
                  <Link key={href} href={href} className="hover:text-orange-600">
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-neutral-100">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-2 px-4 py-5 text-xs font-semibold text-neutral-500 sm:px-6 lg:px-8">
          <Link href="/terms" className="hover:text-orange-600">Conditions générales</Link>
          <Link href="/privacy" className="hover:text-orange-600">Confidentialité et cookies</Link>
          <Link href="/cancellation-policy" className="hover:text-orange-600">Politique d’annulation</Link>
          <Link href="/legal-notice" className="hover:text-orange-600">Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}
