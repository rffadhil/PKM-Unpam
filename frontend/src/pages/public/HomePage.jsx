import { useMemo } from "react";
import Hero from "@/components/home/Hero";
import QuickAccess from "@/components/home/QuickAccess";
import Sambutan from "@/components/home/Sambutan";
import BeritaPengumuman from "@/components/home/BeritaPengumuman";
import AgendaMendatang from "@/components/home/AgendaMendatang";
import Statistik from "@/components/home/Statistik";
import GaleriPreview from "@/components/home/GaleriPreview";
import CtaPpdb from "@/components/home/CtaPpdb";

import {
  heroSlides,
  aksesCepat,
  sambutan,
  berita,
  pengumumanTersemat,
  statistik,
  galeri,
  ctaPpdb,
} from "@/mocks/home";

import { useDaftarAgenda } from "@/hooks/useAgenda";

const NAMA_BULAN = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OKT",
  "NOV",
  "DES",
];

function formatTanggalAgenda(item) {
  const tanggal = item.tanggalMulai || item.tanggal_mulai;

  if (!tanggal) {
    return {
      ...item,
      bulan: "-",
      tanggal: "-",
      tone: "mint",
    };
  }

  // Gunakan tanggal lokal dari string YYYY-MM-DD.
  const [tahun, bulan, hari] = String(tanggal)
    .slice(0, 10)
    .split("-")
    .map(Number);

  const tanggalObj = new Date(tahun, bulan - 1, hari);

  const toneKategori = {
    Akademik: "mint",
    "Kegiatan Sekolah": "gold",
    "Hari Besar": "surface",
  };

  return {
    ...item,
    bulan: NAMA_BULAN[tanggalObj.getMonth()],
    tanggal: String(tanggalObj.getDate()).padStart(2, "0"),
    tone: toneKategori[item.kategori] || "mint",
  };
}

export default function HomePage() {
  const { data: dataAgenda = [] } = useDaftarAgenda();

  const agendaMendatang = useMemo(() => {
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    return dataAgenda
      .filter((item) => {
        const tanggal = item.tanggalMulai || item.tanggal_mulai;

        if (!tanggal) return false;

        const [tahun, bulan, hari] = String(tanggal)
          .slice(0, 10)
          .split("-")
          .map(Number);

        const tanggalAgenda = new Date(tahun, bulan - 1, hari);

        return tanggalAgenda >= hariIni;
      })
      .sort((a, b) => {
        const tanggalA = a.tanggalMulai || a.tanggal_mulai;
        const tanggalB = b.tanggalMulai || b.tanggal_mulai;

        return String(tanggalA).localeCompare(String(tanggalB));
      })
      .slice(0, 3)
      .map(formatTanggalAgenda);
  }, [dataAgenda]);

  return (
    <>
      <Hero slides={heroSlides} />
      <QuickAccess items={aksesCepat} />
      <Sambutan data={sambutan} />

      <BeritaPengumuman
        berita={berita}
        pengumuman={pengumumanTersemat}
      />

      <AgendaMendatang />

      <Statistik items={statistik} />
      <GaleriPreview data={galeri} />
      <CtaPpdb data={ctaPpdb} />
    </>
  );
}