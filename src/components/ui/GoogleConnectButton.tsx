"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.4 3-7.2Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-0.9 6.6-2.5L15.4 17c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8l3.3-2.6Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.7 9.7 0 0 0 12 2a10 10 0 0 0-8.9 5.6l3.3 2.6c.8-2.3 3-4.1 5.6-4.1Z"
      />
    </svg>
  );
}

type GoogleConnectButtonProps = {
  className?: string;
  compact?: boolean;
};

export function GoogleConnectButton({ className = "", compact = false }: GoogleConnectButtonProps) {
  const router = useRouter();
  const { loginDemo } = useAuth();

  function handleClick() {
    loginDemo();
    router.push("/profil");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-4 text-sm font-bold text-neutral-800 shadow-sm transition hover:border-orange-400 hover:bg-orange-50/40 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 ${className}`}
    >
      <GoogleIcon />
      {compact ? "Google" : "Continuer avec Google"}
    </button>
  );
}
