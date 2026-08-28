import { AlertTriangle, CalendarDays, ChartNoAxesCombined, CreditCard, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { clientRequests, equipment, ownerDashboardMetrics } from "@/lib/data";
import { formatDh } from "@/lib/format";

const alerts: Array<[LucideIcon, string, string]> = [
  [CalendarDays, "Planning parc", "3 retours prévus cette semaine"],
  [Wrench, "Maintenance", "Vidange JCB 3CX dans 18 h moteur"],
  [CreditCard, "Paiements", "5 règlements en attente"],
  [AlertTriangle, "Alertes", "1 assurance expire dans 12 jours"],
];

export function OwnerPreview() {
  return (
    <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-xl shadow-neutral-950/5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ownerDashboardMetrics.map((metric) => (
          <div key={metric.label} className="rounded-md bg-neutral-50 p-4">
            <p className="text-xs font-bold uppercase text-neutral-500">{metric.label}</p>
            <p className="mt-2 text-2xl font-black text-neutral-950">{metric.value}</p>
            <p className="mt-1 text-xs font-semibold text-orange-600">{metric.helper}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-md border border-neutral-200 p-4">
          <h3 className="font-black text-neutral-950">Machines publiées</h3>
          <div className="mt-4 grid gap-3">
            {equipment.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-md bg-neutral-50 p-3">
                <div>
                  <p className="font-bold text-neutral-950">{item.title}</p>
                  <p className="text-xs text-neutral-500">
                    {item.city} · {item.companyName}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-black text-neutral-950">{formatDh(item.priceDay)}/j</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-neutral-200 p-4">
          <h3 className="font-black text-neutral-950">Demandes reçues</h3>
          <div className="mt-4 grid gap-3">
            {clientRequests.map((request) => (
              <div key={request.id} className="rounded-md bg-orange-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-neutral-950">{request.machine}</p>
                  <span className="text-xs font-black text-orange-700">{request.status}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-600">
                  {request.city} · budget {formatDh(request.budgetDay)}/j
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {alerts.map(([Icon, title, text]) => (
          <div key={title} className="flex gap-3 rounded-md border border-neutral-200 p-4">
            <Icon className="mt-1 text-orange-600" size={20} aria-hidden />
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
