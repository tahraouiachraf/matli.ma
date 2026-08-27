import type { Metadata } from "next";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description: "Découvrez comment rechercher, déposer et louer du matériel professionnel sur MATLI.",
};

export default function HowItWorksPage() {
  return <HowItWorksSection />;
}
