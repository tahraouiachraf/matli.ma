"use client";

import { AlertCircle, Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { RequiredFieldsLegend, RequiredMark } from "@/components/ui/RequiredField";

const fieldClass = "flex h-12 min-w-0 items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-3 transition focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/10";
const controlClass = "h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-neutral-950 outline-none placeholder:text-neutral-400";

export function LoginForm({ notice, initialVerificationEmail }: { notice?: string; initialVerificationEmail?: string }) {
  const router = useRouter();
  const { login, resendVerification } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(initialVerificationEmail ?? null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setVerificationEmail(null);
    setResendMessage(null);
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));

    try {
      await login(email, String(formData.get("password")));
      router.push("/dashboard");
    } catch (exception) {
      const message = exception instanceof Error ? exception.message : "Identifiants invalides.";
      setError(message);
      if (message.toLowerCase().includes("confirmez votre adresse")) setVerificationEmail(email);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid min-w-0 gap-4" onSubmit={handleSubmit}>
      {notice ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-800">
          {notice}
        </div>
      ) : null}
      {error ? (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}
      {verificationEmail ? (
        <button
          type="button"
          disabled={resending}
          onClick={async () => {
            setResending(true);
            setError(null);
            try {
              setResendMessage(await resendVerification(verificationEmail));
            } catch (exception) {
              setError(exception instanceof Error ? exception.message : "L’email n’a pas pu être renvoyé.");
            } finally {
              setResending(false);
            }
          }}
          className="justify-self-start text-sm font-black text-orange-700 hover:text-orange-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resending ? "Envoi en cours..." : "Renvoyer l’email de confirmation"}
        </button>
      ) : null}
      {resendMessage ? <p className="text-sm font-semibold text-emerald-700">{resendMessage}</p> : null}
      <RequiredFieldsLegend />

      <label className="grid min-w-0 gap-2 text-sm font-black text-neutral-800">
        <span>Adresse email <RequiredMark /></span>
        <span className={fieldClass}>
          <Mail className="h-5 w-5 shrink-0 text-neutral-400" />
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="nom@entreprise.ma"
            className={controlClass}
          />
        </span>
      </label>

      <label className="grid min-w-0 gap-2 text-sm font-black text-neutral-800">
        <span>Mot de passe <RequiredMark /></span>
        <span className={fieldClass}>
          <LockKeyhole className="h-5 w-5 shrink-0 text-neutral-400" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Votre mot de passe"
            className={controlClass}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="grid size-8 shrink-0 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </span>
      </label>

      <Link href="/forgot-password" className="justify-self-end text-sm font-black text-orange-700 hover:text-orange-800">
        Mot de passe oublié ?
      </Link>

      <button
        disabled={loading}
        className="mt-1 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-black text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Connexion en cours..." : "Se connecter"}
      </button>

      <p className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-xs font-semibold leading-6 text-orange-900">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-orange-600" aria-hidden />
        Votre session donne accès aux annonces, réservations, demandes clients et pages propriétaires selon votre rôle.
      </p>
    </form>
  );
}
