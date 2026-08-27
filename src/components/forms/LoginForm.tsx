"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

export function LoginForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem("matli-authenticated", "true");
    window.dispatchEvent(new Event("matli-auth-change"));
    router.push("/profil");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-semibold">
        Email
        <input type="email" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <label className="grid gap-2 text-sm font-semibold">
        Mot de passe
        <input type="password" className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500" />
      </label>
      <button className="h-12 rounded-md bg-neutral-950 text-sm font-black text-white hover:bg-neutral-800">
        Se connecter
      </button>
    </form>
  );
}
