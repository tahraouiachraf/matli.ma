"use client";
import { Bell, CheckCheck, Loader2, Mail, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatDateTime } from "@/lib/format";
import { getNotificationCenter, getNotificationPreferences, markNotificationRead, markNotificationsRead, updateNotificationPreferences, type AccountNotification, type NotificationPreferences } from "@/services/api/matli";

const defaults: NotificationPreferences = { email_enabled: true, app_enabled: true, reservation_updates: true, important_alerts: true, marketing: false };

export function NotificationCenter() {
  const { token } = useAuth();
  const [items, setItems] = useState<AccountNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [preferences, setPreferences] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => { Promise.all([getNotificationCenter(token), getNotificationPreferences(token)]).then(([center, settings]) => { setItems(center.notifications); setUnread(center.unreadCount); setPreferences(settings); }).catch(() => setNotice("Les notifications ne peuvent pas être chargées pour le moment.")).finally(() => setLoading(false)); }, [token]);
  const syncBadge = () => window.dispatchEvent(new Event("matli-notifications-updated"));
  async function read(item: AccountNotification) { if (item.read_at) return; await markNotificationRead(item.id, token); setItems((current) => current.map((row) => row.id === item.id ? { ...row, read_at: new Date().toISOString() } : row)); setUnread((value) => Math.max(0, value - 1)); syncBadge(); }
  async function readAll() { const response = await markNotificationsRead(token); setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at ?? new Date().toISOString() }))); setUnread(0); setNotice(response.message); syncBadge(); }
  async function savePreferences() { setSaving(true); setNotice(null); try { const response = await updateNotificationPreferences(preferences, token); setPreferences(response.preferences); setNotice(response.message); } catch (error) { setNotice(error instanceof Error ? error.message : "Merci de réessayer."); } finally { setSaving(false); } }
  if (loading) return <div className="grid gap-3">{[1,2,3].map((item) => <div key={item} className="h-24 animate-pulse rounded-xl bg-neutral-100" />)}</div>;
  return <div className="grid gap-6">
    <div><p className="text-sm font-black uppercase text-orange-600">Centre unifié</p><h2 className="mt-2 text-2xl font-black text-neutral-950 sm:text-3xl">Notifications</h2><p className="mt-2 text-sm text-neutral-600">Réservations, confirmations et alertes importantes au même endroit.</p></div>
    {notice ? <p role="status" className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm font-bold text-orange-900">{notice}</p> : null}
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 p-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-orange-50 text-orange-700"><Bell size={19} /></span><div><h3 className="font-black">Activité</h3><p className="text-xs text-neutral-500">{unread} non lue{unread > 1 ? "s" : ""}</p></div></div>{unread ? <button type="button" onClick={readAll} className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-200 px-3 text-xs font-black"><CheckCheck size={16} />Tout marquer comme lu</button> : null}</div>
      <div className="divide-y divide-neutral-100">{items.length ? items.map((item) => <button key={item.id} type="button" onClick={() => read(item)} className={`flex w-full gap-3 p-4 text-left transition hover:bg-neutral-50 ${item.read_at ? "bg-white" : "bg-orange-50/60"}`}><span className={`mt-2 size-2.5 shrink-0 rounded-full ${item.read_at ? "bg-neutral-200" : "bg-orange-500"}`} /><span className="min-w-0 flex-1"><span className="flex flex-col justify-between gap-1 sm:flex-row"><strong className="text-sm text-neutral-950">{item.title}</strong><time className="text-xs text-neutral-500">{formatDateTime(item.created_at)}</time></span><span className="mt-1 block text-sm leading-6 text-neutral-600">{item.body}</span></span></button>) : <p className="p-8 text-center text-sm text-neutral-500">Aucune notification pour le moment.</p>}</div>
    </section>
    <section className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5"><h3 className="font-black text-neutral-950">Préférences</h3><p className="mt-1 text-sm text-neutral-600">Choisissez les canaux utilisés pour vous informer.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{([["email_enabled","Emails",Mail],["app_enabled","Dans l’application",Smartphone],["reservation_updates","Réservations et statuts",Bell],["important_alerts","Alertes importantes",Bell],["marketing","Actualités MATLI",Mail]] as const).map(([key,label,Icon]) => <label key={key} className="flex min-h-14 items-center justify-between gap-3 rounded-lg border border-neutral-200 p-3 text-sm font-bold"><span className="inline-flex items-center gap-2"><Icon size={17} className="text-orange-600" />{label}</span><input type="checkbox" checked={preferences[key]} onChange={(event) => setPreferences((current) => ({ ...current, [key]: event.target.checked }))} className="size-5 accent-orange-500" /></label>)}</div><button type="button" disabled={saving} onClick={savePreferences} className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-orange-500 px-5 text-sm font-black text-white disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : null}Enregistrer les préférences</button></section>
  </div>;
}
