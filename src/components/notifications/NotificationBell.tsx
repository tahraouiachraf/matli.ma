"use client";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getNotificationCenter } from "@/services/api/matli";

type NotificationBellProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

export function NotificationBell({ mobile = false, onNavigate }: NotificationBellProps) {
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
        href="/espace/notifications"
        onClick={onNavigate}
        aria-label={`${count} notifications non lues`}
        className="mt-2 flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-3 text-sm font-black text-neutral-900 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
      >
        <span className="flex items-center gap-2">
          <Bell size={18} aria-hidden />
          Notifications
        </span>
        {count ? <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">{count > 99 ? "99+" : count}</span> : null}
      </Link>
    );
  }

  return <Link href="/espace/notifications" aria-label={`${count} notifications non lues`} className="relative grid size-10 place-items-center rounded-md border border-neutral-200 text-neutral-700 hover:border-orange-300 hover:text-orange-700"><Bell size={18} aria-hidden />{count ? <span className="absolute -right-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-white">{count > 99 ? "99+" : count}</span> : null}</Link>;
}
