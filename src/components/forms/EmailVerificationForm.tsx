"use client";

import { AlertCircle, Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { API_ORIGIN } from "@/services/api/client";

type VerificationParams = {
  id?: string;
  hash?: string;
  expires?: string;
  signature?: string;
};

export function EmailVerificationForm({ id, hash, expires, signature }: VerificationParams) {
  const router = useRouter();
  const started = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const invalidLink = !id || !hash || !expires || !signature;

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!id || !hash || !expires || !signature) return;

    const query = new URLSearchParams({ expires, signature });

    fetch(`${API_ORIGIN}/email/verify/${encodeURIComponent(id)}/${encodeURIComponent(hash)}?${query}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Ce lien de vérification est invalide ou expiré.");
        router.replace("/login?verified=1");
      })
      .catch((exception: unknown) => {
        setError(exception instanceof Error ? exception.message : "La vérification n’a pas pu être effectuée.");
      });
  }, [expires, hash, id, router, signature]);

  const displayedError = invalidLink ? "Ce lien de vérification est incomplet ou invalide." : error;

  if (displayedError) {
    return (
      <div className="grid gap-5">
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
          <span>{displayedError}</span>
        </div>
        <p className="text-sm leading-6 text-neutral-600">
          Demandez un nouvel email depuis la page de connexion pour confirmer votre compte.
        </p>
        <Link
          href="/login"
          className="inline-flex h-12 items-center justify-center rounded-md bg-orange-600 px-5 text-sm font-black text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
        >
          Aller à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="grid justify-items-center gap-4 py-8 text-center" role="status" aria-live="polite">
      <span className="relative grid size-16 place-items-center rounded-full bg-orange-50 text-orange-600">
        <MailCheck className="size-7" aria-hidden />
        <Loader2 className="absolute size-16 animate-spin text-orange-200" aria-hidden />
      </span>
      <p className="font-black text-neutral-950">Confirmation de votre adresse email</p>
      <p className="max-w-sm text-sm leading-6 text-neutral-600">Quelques secondes suffisent. Vous serez ensuite redirigé vers la connexion.</p>
    </div>
  );
}
