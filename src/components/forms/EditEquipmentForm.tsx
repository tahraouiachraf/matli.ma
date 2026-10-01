"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DepositMachineForm } from "@/components/forms/DepositMachineForm";
import { useAuth } from "@/components/providers/AuthProvider";
import { getWorkspaceEquipmentItem } from "@/services/api/matli";
import type { Equipment } from "@/types";

export function EditEquipmentForm({ equipmentId }: { equipmentId: string }) {
  const { token } = useAuth();
  const router = useRouter();
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    getWorkspaceEquipmentItem(equipmentId, token)
      .then((item) => { if (active) setEquipment(item); })
      .catch((exception) => { if (active) setError(exception instanceof Error ? exception.message : "Ce matériel ne peut pas être chargé."); });
    return () => { active = false; };
  }, [equipmentId, token]);

  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-800">{error}</div>;
  if (!equipment) return <div className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-5" aria-label="Chargement du matériel"><span className="h-12 animate-pulse rounded-lg bg-neutral-100" /><span className="h-40 animate-pulse rounded-lg bg-neutral-100" /><span className="h-12 animate-pulse rounded-lg bg-neutral-100" /></div>;

  return <DepositMachineForm equipment={equipment} onCancel={() => router.push("/dashboard/equipment")} onUpdated={() => router.push("/dashboard/equipment")} />;
}
