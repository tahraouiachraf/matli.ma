import { AlertTriangle, Home, LockKeyhole, RotateCcw, SearchX, ServerCrash, WifiOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

const icons: Record<string, LucideIcon> = {
  badRequest: AlertTriangle,
  forbidden: LockKeyhole,
  notFound: SearchX,
  server: ServerCrash,
  dns: WifiOff,
};

type ErrorStateProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  tone?: "orange" | "red" | "neutral";
  icon?: keyof typeof icons;
  digest?: string;
  onRetry?: () => void;
};

export function ErrorState({
  code,
  description,
  digest,
  eyebrow,
  icon = "server",
  onRetry,
  title,
  tone = "orange",
}: ErrorStateProps) {
  const Icon = icons[icon];
  const toneClass =
    tone === "red"
      ? "bg-red-50 text-red-600"
      : tone === "neutral"
        ? "bg-neutral-100 text-neutral-700"
        : "bg-orange-50 text-orange-600";

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-7xl place-items-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-950/5 sm:p-8">
        <div className={`mx-auto grid size-16 place-items-center rounded-full ${toneClass}`}>
          <Icon size={30} aria-hidden />
        </div>
        <p className="mt-6 text-sm font-black uppercase text-orange-600">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black text-neutral-950">{title}</h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-neutral-600">{description}</p>
        <div className="mt-5 inline-flex rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-black text-neutral-700">
          Code {code}
        </div>
        {digest ? <p className="mt-3 text-xs text-neutral-400">Référence technique: {digest}</p> : null}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600"
            >
              <RotateCcw size={17} aria-hidden />
              Réessayer
            </button>
          ) : null}
          <Link href="/" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-black text-white hover:bg-orange-600">
            <Home size={17} aria-hidden />
            Accueil
          </Link>
          <Link href="/location" className="inline-flex min-h-11 items-center justify-center rounded-md border border-neutral-200 px-5 text-sm font-bold text-neutral-800 hover:border-orange-400">
            Voir les machines
          </Link>
        </div>
      </div>
    </section>
  );
}
