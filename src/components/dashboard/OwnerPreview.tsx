import { AlertTriangle, CalendarDays, ChartNoAxesCombined, CreditCard, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stats = [
  ["Matériels", "42"],
  ["Disponibles", "28"],
  ["En location", "11"],
  ["Maintenance", "3"],
  ["CA du mois", "184 500 DH"],
  ["À encaisser", "37 200 DH"],
];

const alerts: Array<[LucideIcon, string, string]> = [
  [CalendarDays, "Planning parc", "3 retours prévus cette semaine"],
  [Wrench, "Maintenance", "Vidange pelle 320D dans 18 h moteur"],
  [CreditCard, "Paiements", "5 règlements en attente"],
  [AlertTriangle, "Alertes", "1 assurance expire dans 12 jours"],
];

export function OwnerPreview() {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-950/5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-md bg-neutral-50 p-4">
            <p className="text-xs font-bold uppercase text-neutral-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-neutral-950">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {alerts.map(([Icon, title, text]) => (
          <div key={title} className="flex gap-3 rounded-md border border-neutral-200 p-4">
            <Icon className="mt-1 text-amber-700" size={20} aria-hidden />
            <div>
              <h3 className="font-bold text-neutral-950">{title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-md bg-neutral-950 p-5 text-white">
        <div className="flex items-center gap-3">
          <ChartNoAxesCombined className="text-amber-400" size={24} aria-hidden />
          <div>
            <p className="text-sm text-neutral-300">Taux d&apos;utilisation du parc</p>
            <p className="text-3xl font-black">67%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
