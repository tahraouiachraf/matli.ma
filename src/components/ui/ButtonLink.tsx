import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  const variants = {
    primary: "bg-amber-500 text-neutral-950 hover:bg-amber-400",
    secondary: "border border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950",
    ghost: "text-neutral-800 hover:bg-neutral-100",
  };

  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
