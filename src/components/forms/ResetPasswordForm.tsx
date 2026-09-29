"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resetPassword } from "@/services/api/matli";

export function ResetPasswordForm({ email, token }: { email: string; token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const data = new FormData(event.currentTarget);
    try {
      await resetPassword({
        email,
        token,
        password: String(data.get("password") ?? ""),
        password_confirmation: String(data.get("password_confirmation") ?? ""),
      });
      router.push("/login?password_reset=1");
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Le lien est invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  }

  if (!email || !token) {
    return <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">Ce lien de réinitialisation est incomplet.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {error ? <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}
      {["password", "password_confirmation"].map((name) => (
        <label key={name} className="grid gap-2 text-sm font-black text-neutral-800">
          {name === "password" ? "Nouveau mot de passe" : "Confirmer le mot de passe"}
          <span className="flex h-12 items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-3 focus-within:border-orange-500">
            <LockKeyhole className="size-5 text-neutral-400" aria-hidden />
            <input name={name} type="password" autoComplete="new-password" minLength={10} required className="h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none" placeholder="10 caractères minimum" />
          </span>
        </label>
      ))}
      <button disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-600 text-sm font-black text-white disabled:opacity-60">
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        Modifier mon mot de passe
      </button>
    </form>
  );
}
