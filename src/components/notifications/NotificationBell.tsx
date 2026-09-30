"use client";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getNotificationCenter } from "@/services/api/matli";

type NotificationBellProps = {
  mobile?: boolean;
  dark?: boolean;
  onNavigate?: () => void;
};

export function NotificationBell({ mobile = false, dark = false, onNavigate }: NotificationBellProps) {
  const { connected, token } = useAuth();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!connected || !token) return;
    let mounted = true;
    const load = () => getNotificationCenter(token).then((result) => { if (mounted) setCount(result.unreadCount); }).catch(() => undefined);
    load(); window.addEventListener("matli-notifications-updated", load);
    return () => { mounted = false; window.removeEventListener("matli-notifications-updated", load); };
  }, [connected, token]);
  if (!connected) return null;
  if (mobile) {
    return (
      <Link
        href="/dashboard/notifications"
        onClick={onNavigate}
        aria-label={`${count} notifications non lues`}
        className={`mt-2 flex items-center justify-between rounded-md px-3 py-3 text-sm font-black transition ${dark ? "border border-white/15 bg-white/5 text-white hover:border-[#F58220] hover:bg-white/10" : "border border-neutral-200 bg-white text-neutral-900 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"}`}
      >
        <span className="flex items-center gap-2">
          <Bell size={18} aria-hidden />
          Notifications
        </span>
        {count ? <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">{count > 99 ? "99+" : count}</span> : null}
      </Link>
    );
  }

  return <Link href="/dashboard/notifications" aria-label={`${count} notifications non lues`} className={`relative grid size-10 place-items-center rounded-md border transition ${dark ? "border-white/15 text-neutral-300 hover:border-[#F58220] hover:bg-white/10 hover:text-white" : "border-neutral-200 text-neutral-700 hover:border-orange-300 hover:text-orange-700"}`}><Bell size={18} aria-hidden />{count ? <span className="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#F58220] px-1 text-[10px] font-black text-white">{count > 99 ? "99+" : count}</span> : null}</Link>;
}
