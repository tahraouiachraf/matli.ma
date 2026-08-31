import { MessageSquareText } from "lucide-react";
import { clientRequests as fallbackRequests } from "@/lib/data";
import { formatDh } from "@/lib/format";
import type { ClientRequest } from "@/types";

export function RequestsPreviewSection({ requests = fallbackRequests }: { requests?: ClientRequest[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-bold text-orange-600">Demandes clients</p>
          <h2 className="mt-2 text-3xl font-black text-neutral-950">Des demandes claires, prêtes à devenir des devis.</h2>
          <p className="mt-3 max-w-2xl text-neutral-600">
            Chaque demande contient le matériel recherché, la ville, la durée, le budget et le type de client. C&apos;est la base du futur module de devis et réservation.
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {requests.map((request) => (
          <article key={request.id} className="rounded-md border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <MessageSquareText className="text-orange-500" size={22} aria-hidden />
              <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-black text-orange-700">{request.id}</span>
            </div>
            <h3 className="mt-4 text-xl font-black">{request.machine}</h3>
            <p className="mt-2 text-sm text-neutral-600">{request.city} · {request.dateRange}</p>
            <p className="mt-4 text-sm text-neutral-500">Budget client</p>
            <p className="text-2xl font-black">{formatDh(request.budgetDay)} / jour</p>
            <p className="mt-3 text-sm font-semibold text-neutral-700">{request.contact}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
