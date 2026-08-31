"use client";

import { AlertCircle, Loader2, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    try {
      await login(String(formData.get("email")), String(formData.get("password")));
      router.push("/espace");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {error ? (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-black text-neutral-800">
        Adresse email
        <span className="flex h-12 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
          <Mail className="h-5 w-5 shrink-0 text-neutral-400" />
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="nom@entreprise.ma"
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        </span>
      </label>

      <label className="grid gap-2 text-sm font-black text-neutral-800">
        Mot de passe
        <span className="flex h-12 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 transition focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10">
          <LockKeyhole className="h-5 w-5 shrink-0 text-neutral-400" />
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Votre mot de passe"
            className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        </span>
      </label>

      <button
        disabled={loading}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 text-sm font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Connexion en cours..." : "Se connecter"}
      </button>

      <p className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-xs font-semibold leading-6 text-orange-900">
        Votre session donne accès aux annonces, réservations, demandes clients et pages propriétaires selon votre rôle.
      </p>
    </form>
  );
}
