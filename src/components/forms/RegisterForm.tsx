"use client";

import { AlertCircle, Building2, Check, ChevronDown, Eye, EyeOff, HardHat, Loader2, LockKeyhole, Mail, MapPin, Phone, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { cities } from "@/lib/data";

const fieldClass = "flex h-12 min-w-0 items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-3 transition focus-within:border-orange-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-100";
const controlClass = "h-full min-w-0 flex-1 bg-transparent text-sm font-semibold text-neutral-950 outline-none placeholder:text-neutral-400";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    try {
      const response = await register({
        name: String(formData.get("name")),
        phone: String(formData.get("phone")),
        email: String(formData.get("email")),
        city: String(formData.get("city")),
        company_name: String(formData.get("company_name")),
        password: String(formData.get("password")),
        password_confirmation: String(formData.get("password_confirmation")),
        account_type: formData.get("account_type") === "client" ? "client" : "owner",
      });
      router.push(`/connexion?registered=1&email=${encodeURIComponent(response.email)}`);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Création du compte impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="grid min-w-0 gap-x-4 gap-y-4 md:grid-cols-2" onSubmit={handleSubmit}>
      {error ? (
        <p className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700 md:col-span-2">
          <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
          {error}
        </p>
      ) : null}
      <label className="grid min-w-0 gap-2 text-sm font-black text-neutral-800">
        Nom complet
        <span className={fieldClass}>
          <UserRound className="size-5 shrink-0 text-neutral-400" aria-hidden />
          <input name="name" autoComplete="name" placeholder="Votre nom complet" className={controlClass} required />
        </span>
      </label>
      <label className="grid min-w-0 gap-2 text-sm font-black text-neutral-800">
        Téléphone
        <span className={fieldClass}>
          <Phone className="size-5 shrink-0 text-neutral-400" aria-hidden />
          <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="06 00 00 00 00" className={controlClass} />
        </span>
      </label>
      <label className="grid min-w-0 gap-2 text-sm font-black text-neutral-800">
        Email
        <span className={fieldClass}>
          <Mail className="size-5 shrink-0 text-neutral-400" aria-hidden />
          <input name="email" type="email" autoComplete="email" placeholder="nom@entreprise.ma" className={controlClass} required />
        </span>
      </label>
      <label className="grid min-w-0 gap-2 text-sm font-black text-neutral-800">
        Ville
        <span className={`${fieldClass} relative`}>
          <MapPin className="size-5 shrink-0 text-neutral-400" aria-hidden />
          <select name="city" defaultValue="" className={`${controlClass} appearance-none pr-7`} required>
            <option value="" disabled>Choisir une ville</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 size-4 text-neutral-400" aria-hidden />
        </span>
      </label>
      <fieldset className="min-w-0 md:col-span-2">
        <legend className="mb-2 text-sm font-black text-neutral-800">Je souhaite</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="cursor-pointer">
            <input type="radio" name="account_type" value="owner" defaultChecked className="peer sr-only" />
            <span className="flex min-h-14 items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-4 text-sm font-bold text-neutral-700 transition hover:border-orange-300 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-800 peer-checked:[&_.selection-mark]:opacity-100 peer-focus-visible:ring-4 peer-focus-visible:ring-orange-100">
              <HardHat className="size-5 shrink-0" aria-hidden />
              <span className="flex-1">Déposer mes machines</span>
              <Check className="selection-mark size-4 opacity-0 transition" aria-hidden />
            </span>
          </label>
          <label className="cursor-pointer">
            <input type="radio" name="account_type" value="client" className="peer sr-only" />
            <span className="flex min-h-14 items-center gap-3 rounded-md border border-neutral-300 bg-neutral-50 px-4 text-sm font-bold text-neutral-700 transition hover:border-orange-300 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-800 peer-checked:[&_.selection-mark]:opacity-100 peer-focus-visible:ring-4 peer-focus-visible:ring-orange-100">
              <HardHat className="size-5 shrink-0" aria-hidden />
              <span className="flex-1">Louer une machine</span>
              <Check className="selection-mark size-4 opacity-0 transition" aria-hidden />
            </span>
          </label>
        </div>
      </fieldset>
      <label className="grid min-w-0 gap-2 text-sm font-black text-neutral-800 md:col-span-2">
        Entreprise
        <span className={fieldClass}>
          <Building2 className="size-5 shrink-0 text-neutral-400" aria-hidden />
          <input name="company_name" autoComplete="organization" placeholder="Nom de votre entreprise (facultatif)" className={controlClass} />
        </span>
      </label>
      <label className="grid min-w-0 gap-2 text-sm font-black text-neutral-800">
        Mot de passe
        <span className={fieldClass}>
          <LockKeyhole className="size-5 shrink-0 text-neutral-400" aria-hidden />
          <input name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={10} placeholder="10 caractères minimum" className={controlClass} required />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="grid size-8 shrink-0 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
            {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </span>
      </label>
      <label className="grid min-w-0 gap-2 text-sm font-black text-neutral-800">
        Confirmer le mot de passe
        <span className={fieldClass}>
          <LockKeyhole className="size-5 shrink-0 text-neutral-400" aria-hidden />
          <input name="password_confirmation" type={showConfirmation ? "text" : "password"} autoComplete="new-password" minLength={10} placeholder="Répéter le mot de passe" className={controlClass} required />
          <button type="button" onClick={() => setShowConfirmation((value) => !value)} className="grid size-8 shrink-0 place-items-center rounded-md text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500" aria-label={showConfirmation ? "Masquer la confirmation" : "Afficher la confirmation"}>
            {showConfirmation ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
          </button>
        </span>
      </label>
      <p className="text-xs leading-5 text-neutral-500 md:col-span-2">Utilisez au moins une majuscule, une minuscule, un chiffre et un symbole.</p>
      <button disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-orange-600 text-sm font-black text-white shadow-md shadow-orange-700/15 transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2">
        {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {loading ? "Création en cours..." : "Créer mon compte"}
      </button>
    </form>
  );
}
