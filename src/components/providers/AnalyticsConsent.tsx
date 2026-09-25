"use client";

import { useEffect, useState } from "react";

const storageKey = "matli-cookie-consent";
const analyticsId = process.env.NEXT_PUBLIC_GA_ID ?? "G-1CYERG8JGX";

function enableAnalytics() {
  if (document.querySelector(`script[data-matli-ga="${analyticsId}"]`)) return;
  const external = document.createElement("script");
  external.async = true;
  external.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
  external.dataset.matliGa = analyticsId;
  document.head.appendChild(external);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) { window.dataLayer?.push(args); };
  window.gtag("js", new Date());
  window.gtag("config", analyticsId, { anonymize_ip: true });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<"loading" | "accepted" | "refused" | null>("loading");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = localStorage.getItem(storageKey) as "accepted" | "refused" | null;
      setChoice(stored);
      if (stored === "accepted") enableAnalytics();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function decide(value: "accepted" | "refused") {
    localStorage.setItem(storageKey, value);
    setChoice(value);
    if (value === "accepted") enableAnalytics();
  }

  if (choice === "loading" || choice === "accepted" || choice === "refused") return null;

  return (
    <section aria-label="Choix des cookies" className="fixed inset-x-3 bottom-20 z-[80] mx-auto max-w-3xl rounded-lg border border-neutral-200 bg-white p-4 shadow-2xl sm:bottom-5 sm:flex sm:items-center sm:gap-5">
      <div className="min-w-0 flex-1">
        <h2 className="font-black text-neutral-950">Votre confidentialité compte</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-600">Avec votre accord, MATLI utilise Google Analytics pour améliorer la plateforme. Les cookies nécessaires restent toujours actifs.</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-0 sm:shrink-0">
        <button type="button" onClick={() => decide("refused")} className="h-10 rounded-md border border-neutral-300 px-4 text-sm font-bold text-neutral-700">Refuser</button>
        <button type="button" onClick={() => decide("accepted")} className="h-10 rounded-md bg-orange-700 px-4 text-sm font-black text-white hover:bg-orange-600">Accepter</button>
      </div>
    </section>
  );
}
