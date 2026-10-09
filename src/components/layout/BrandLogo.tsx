import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  onClick?: () => void;
  textClassName?: string;
};

export function BrandLogo({ className = "", imageClassName = "", onClick, textClassName = "" }: BrandLogoProps) {
  return (
    <Link href="/" onClick={onClick} className={`inline-flex shrink-0 items-center gap-2 ${className}`} aria-label="MATLI.ma accueil" data-brand-logo>
      <Image
        src="/favicon.png"
        alt=""
        width={44}
        height={44}
        priority
        unoptimized
        className={`size-10 shrink-0 object-contain ${imageClassName}`}
      />
      <span className={`leading-none font-black text-[#F58220] ${textClassName}`}>MATLI.ma</span>
    </Link>
  );
}
