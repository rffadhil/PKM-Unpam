
import { useEffect, useState } from "react";

import Hero from "@/components/home/Hero";
import QuickAccess from "@/components/home/QuickAccess";
import Sambutan from "@/components/home/Sambutan";
import AgendaMendatang from "@/components/home/AgendaMendatang";
import Ekskul from "@/components/home/Ekskul";
import GaleriPreview from "@/components/home/GaleriPreview";
import CtaPpdb from "@/components/home/CtaPpdb";

import {
  heroSlides,
  aksesCepat,
  galeri,
  ctaPpdb,
} from "@/mocks/home";

import { ambilSemuaStaf } from "@/services/stafService";
import { ambilPengaturanLengkap } from "@/services/pengaturan.service";

export default function HomePage() {
  const [dataSambutan, setDataSambutan] = useState({
    nama: "",
    jabatan: "",
    nip: "",
    foto: "",
    fotoAlt: "",
    judul: "",
    paragraf: [],
  });

  useEffect(() => {
    let aktif = true;

    async function muatSambutan() {
      try {
        const [hasilStaf, hasilPengaturan] = await Promise.all([
          ambilSemuaStaf(),
          ambilPengaturanLengkap(),
        ]);

        if (!aktif) return;

        const daftarStaf = Array.isArray(hasilStaf.data)
          ? hasilStaf.data
          : [];

        const stafPublik = daftarStaf.filter(
          (staf) =>
            staf.tampil_publik !== false &&
            staf.tampil !== false
        );

        const kepalaSekolah = stafPublik.find(
          (staf) =>
            String(staf.jabatan || "")
              .trim()
              .toLowerCase() === "kepala sekolah"
        );

        const pengaturan =
          hasilPengaturan.portal ||
          hasilPengaturan.data?.portal ||
          hasilPengaturan.data ||
          {};

        const isiSambutan =
          pengaturan.sambutan_kepsek || "";

        const paragrafSambutan = isiSambutan
          .split(/\r?\n/)
          .map((teks) => teks.trim())
          .filter(Boolean);

        const dataBaru = {
          nama: kepalaSekolah?.nama || "",
          jabatan: kepalaSekolah?.jabatan || "",
          nip: kepalaSekolah?.nip_nuptk || "-",
          foto: kepalaSekolah?.foto_url || "",
          fotoAlt: kepalaSekolah
            ? `Foto ${kepalaSekolah.nama}`
            : "",
          judul: pengaturan.sambutan_judul || "",
          paragraf: paragrafSambutan,
        };

        setDataSambutan(dataBaru);
      } catch (error) {
        console.error("Gagal memuat data sambutan:", error);
      }
    }

    muatSambutan();

    return () => {
      aktif = false;
    };
  }, []);

  return (
    <>
      <Hero slides={heroSlides} />
      <QuickAccess items={aksesCepat} />
      <Sambutan data={dataSambutan} />
      <AgendaMendatang />

      {/* Tiga ekskul unggulan di Beranda */}
      <Ekskul />

      <GaleriPreview data={galeri} />
      <CtaPpdb data={ctaPpdb} />
    </>
  );
}
