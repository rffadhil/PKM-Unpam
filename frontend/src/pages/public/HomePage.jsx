
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
  ekskulUnggulan,
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

        // Mengambil daftar staf dari respons API.
        const daftarStaf = Array.isArray(hasilStaf.data)
          ? hasilStaf.data
          : [];

        // Hanya mengambil staf yang ditampilkan di halaman publik.
        const stafPublik = daftarStaf.filter(
          (staf) =>
            staf.tampil_publik !== false &&
            staf.tampil !== false
        );

        // Mengambil data kepala sekolah berdasarkan jabatan.
        const kepalaSekolah = stafPublik.find(
          (staf) =>
            String(staf.jabatan || "")
            .trim()
            .toLowerCase() === "kepala sekolah"
          );

        // Mengambil pengaturan portal.
        const pengaturan =
          hasilPengaturan.portal ||
          hasilPengaturan.data?.portal ||
          hasilPengaturan.data ||
          {};

        // Mengambil isi sambutan dari pengaturan.
        const isiSambutan =
          pengaturan.sambutan_kepsek || "";

        const paragrafSambutan = isiSambutan
          .split(/\r?\n/)
          .map((teks) => teks.trim())
          .filter(Boolean);

        // Menggabungkan data API dengan data default.
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
      <Ekskul items={ekskulUnggulan} />
      <AgendaMendatang />
      <GaleriPreview data={galeri} />
      <CtaPpdb data={ctaPpdb} />
    </>
  );
}
