import { BadgeCheck, CalendarCheck, Check, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { GoogleConnectButton } from "@/components/ui/GoogleConnectButton";

type AuthPageShellProps = {
  appearance?: "light" | "dark";
  alternativeHref: string;
  alternativeLabel: string;
  alternativePrompt: string;
  children: React.ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

const benefits = [
  { title: "Machines vérifiées", description: "Des annonces utiles et bien renseignées.", Icon: BadgeCheck },
  { title: "Réservations suivies", description: "Dates, demandes et statuts centralisés.", Icon: CalendarCheck },
  { title: "Gestion propriétaire", description: "Matériel, clients et documents réunis.", Icon: Truck },
  { title: "Accès protégé", description: "Compte et permissions selon votre profil.", Icon: ShieldCheck },
];

const darkBenefits = [
  { title: "Machines vérifiées", description: "Publiez votre parc et gagnez en visibilité.", Icon: BadgeCheck },
  { title: "Réservations suivies", description: "Centralisez demandes, dates et statuts.", Icon: CalendarCheck },
  { title: "Profil propriétaire", description: "Gérez clients, prix et documents.", Icon: Truck },
  { title: "Accès protégé", description: "Connexion sécurisée selon votre profil.", Icon: ShieldCheck },
];

export function AuthPageShell({ appearance = "dark", alternativeHref, alternativeLabel, alternativePrompt, children, description, eyebrow, title }: AuthPageShellProps) {
  const isDark = appearance === "dark";
  const displayedBenefits = isDark ? darkBenefits : benefits;

  return (
    <section className={`border-t border-orange-100 ${isDark ? "bg-orange-50/50" : "bg-neutral-50"}`}>
      <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className={`mx-auto grid min-w-0 max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_24px_70px_rgba(23,23,23,0.10)] lg:w-full ${isDark ? "lg:grid-cols-[1.08fr_0.92fr]" : "lg:grid-cols-[0.88fr_1.12fr]"}`}>
          <div className={`relative flex min-w-0 flex-col justify-between overflow-hidden p-5 sm:p-9 lg:min-h-[680px] lg:p-10 xl:p-12 ${isDark ? "bg-neutral-950 text-white" : "bg-orange-500 text-neutral-950"}`}>
            {isDark ? <span aria-hidden className="absolute inset-y-0 left-0 w-2 bg-orange-500" /> : null}
            {isDark ? <span aria-hidden className="absolute -right-16 top-12 h-80 w-80 rounded-full border border-white/10" /> : null}
            <div className="relative z-10 flex items-center gap-3">
              <span className={`grid size-11 place-items-center rounded-full text-lg font-black shadow-sm ${isDark ? "bg-orange-500 text-white" : "border border-white/70 bg-white text-orange-600"}`}>M</span>
              <div>
                <p className="text-base font-black leading-tight">MATLI.ma</p>
                <p className={`text-xs font-bold ${isDark ? "text-white/75" : "text-neutral-800"}`}>{isDark ? "Marketplace BTP au Maroc" : "La marketplace des chantiers"}</p>
              </div>
            </div>

            <div className="relative z-10 max-w-xl py-7 sm:py-12 lg:py-10">
              <p className={`inline-flex items-center gap-2 text-xs font-black uppercase ${isDark ? "tracking-[0.18em] text-orange-300" : "text-neutral-900"}`}>
                {isDark ? null : <Check className="size-4" strokeWidth={3} aria-hidden />}
                {isDark ? "Espace sécurisé" : "Simple, rapide et professionnel"}
              </p>
              <h1 className={`mt-4 text-2xl font-black leading-tight sm:text-4xl ${isDark ? "lg:text-[2.8rem] xl:text-5xl" : "lg:text-[2.65rem]"}`}>
                {isDark ? (
                  <><span className="sm:hidden">Louez et gérez vos machines.</span><span className="hidden sm:inline">Louer, déposer et gérer vos machines depuis un seul compte.</span></>
                ) : "Vos machines BTP, vos réservations, un seul espace."}
              </h1>
              <p className={`mt-4 hidden max-w-lg text-sm font-semibold leading-6 sm:block sm:text-base sm:leading-7 ${isDark ? "text-white/75" : "text-neutral-800"}`}>
                {isDark
                  ? "Accédez aux demandes clients, réservations, prix par jour, disponibilités et historique de location depuis une interface centralisée."
                  : "Publiez votre matériel ou trouvez une machine disponible près de votre chantier, partout au Maroc."}
              </p>
            </div>

            <div className={`relative z-10 hidden gap-3 md:grid md:grid-cols-2 ${isDark ? "" : "border-t border-neutral-950/15 pt-6"}`}>
              {displayedBenefits.map(({ title: benefitTitle, description: benefitDescription, Icon }) => (
                <div key={benefitTitle} className={`flex items-start gap-3 ${isDark ? "rounded-lg border border-white/15 bg-white/10 p-4" : ""}`}>
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full ${isDark ? "bg-white/10" : "bg-white/80"}`}>
                    <Icon className={`size-4 ${isDark ? "text-white" : "text-orange-700"}`} aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-black">{benefitTitle}</p>
                    <p className={`mt-0.5 text-xs leading-5 ${isDark ? "text-white/65" : "text-neutral-800"}`}>{benefitDescription}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 items-center p-6 sm:p-9 lg:p-10 xl:px-12">
            <div className="mx-auto w-full min-w-0 max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-700">{eyebrow}</p>
              <h2 className="mt-2 break-words text-2xl font-black tracking-normal text-neutral-950 sm:text-4xl">{title}</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600">{description}</p>

              <div className="mt-6"><GoogleConnectButton className="w-full" /></div>
              <div className="my-5 flex items-center gap-3 text-[11px] font-black uppercase text-neutral-400">
                <span className="h-px flex-1 bg-neutral-200" />ou avec email<span className="h-px flex-1 bg-neutral-200" />
              </div>

              {children}

              <p className="mt-6 border-t border-neutral-100 pt-5 text-center text-sm text-neutral-600 sm:text-left">
                {alternativePrompt}{" "}
                <Link href={alternativeHref} className="font-black text-orange-700 hover:text-orange-800">{alternativeLabel}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
