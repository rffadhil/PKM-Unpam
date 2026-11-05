import Hero from "@/components/home/Hero";
import QuickAccess from "@/components/home/QuickAccess";
import Sambutan from "@/components/home/Sambutan";
import AgendaMendatang from "@/components/home/AgendaMendatang";
import Statistik from "@/components/home/Statistik";
import GaleriPreview from "@/components/home/GaleriPreview";
import CtaPpdb from "@/components/home/CtaPpdb";

import {
  heroSlides,
  aksesCepat,
  sambutan,
  statistik,
  galeri,
  ctaPpdb,
} from "@/mocks/home";

export default function HomePage() {
  return (
    <>
      <Hero slides={heroSlides} />
      <QuickAccess items={aksesCepat} />
      <Sambutan data={sambutan} />
      <Statistik items={statistik} />
      <AgendaMendatang />
      <GaleriPreview data={galeri} />
      <CtaPpdb data={ctaPpdb} />
    </>
  );
}