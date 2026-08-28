"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { demoAccount } from "@/lib/data";

export function LoginForm() {
  const router = useRouter();
  const { loginDemo: connectDemo } = useAuth();

  function loginDemo() {
    connectDemo();
    router.push("/espace");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginDemo();
  }

  return (
    <div className="grid gap-4">
      <div className="rounded-md border border-orange-200 bg-orange-50 p-4">
        <p className="text-sm font-black text-orange-700">Compte démo propriétaire</p>
        <div className="mt-3 grid gap-2 text-sm text-neutral-700">
          <p>
            Email: <span className="font-black text-neutral-950">{demoAccount.email}</span>
          </p>
          <p>
            Mot de passe: <span className="font-black text-neutral-950">{demoAccount.password}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={loginDemo}
          className="mt-4 h-11 w-full rounded-md bg-orange-500 px-4 text-sm font-black text-white hover:bg-orange-600"
        >
          Entrer avec le compte démo
        </button>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-semibold">
          Email
          <input
            type="email"
            defaultValue={demoAccount.email}
            className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Mot de passe
          <input
            type="password"
            defaultValue={demoAccount.password}
            className="h-12 rounded-md border border-neutral-200 px-3 font-normal outline-none focus:border-orange-500"
          />
        </label>
        <button className="h-12 rounded-md bg-neutral-950 text-sm font-black text-white hover:bg-neutral-800">
          Se connecter
        </button>
      </form>
    </div>
  );
}
