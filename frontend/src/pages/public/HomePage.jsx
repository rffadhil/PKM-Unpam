
import { useEffect, useMemo, useState } from "react";

import Hero from "@/components/home/Hero";
import QuickAccess from "@/components/home/QuickAccess";
import Sambutan from "@/components/home/Sambutan";
import AgendaMendatang from "@/components/home/AgendaMendatang";
import Ekskul from "@/components/home/Ekskul";
import GaleriPreview from "@/components/home/GaleriPreview";
import CtaPpdb from "@/components/home/CtaPpdb";

import {
  aksesCepat,
  galeri,
  ctaPpdb,
} from "@/mocks/home";

import { useDaftarBeritaPublik } from "@/hooks/useBerita";
import { ambilSemuaStaf } from "@/services/stafService";
import { ambilPengaturanLengkap } from "@/services/pengaturan.service";

// Mengubah tanggal berita menjadi timestamp lokal untuk pengurutan.
function waktuBerita(tanggal) {
  if (!tanggal) return 0;

  const tanggalLokal = String(tanggal).slice(0, 10);
  const hasil = new Date(`${tanggalLokal}T00:00:00`).getTime();

  return Number.isNaN(hasil) ? 0 : hasil;
}

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

  // Mengambil berita yang sudah diterbitkan dari CMS.
  const { data: daftarBerita = [] } = useDaftarBeritaPublik();

  // Hanya berita Terbit dan disematkan yang menjadi slide Beranda.
  const heroSlides = useMemo(() => {
    const beritaTersemat = (Array.isArray(daftarBerita) ? daftarBerita : [])
      .filter(
        (berita) =>
          String(berita.status || "").trim().toLowerCase() === "terbit" &&
          Boolean(berita.disematkan ?? berita.is_pinned ?? berita.sematkan)
      )
      .sort(
        (a, b) =>
          waktuBerita(b.tanggal || b.tanggalPublikasi) -
          waktuBerita(a.tanggal || a.tanggalPublikasi)
      );

    return beritaTersemat.map((berita) => ({
      id: berita.id,
      label: berita.kategori || "Berita Sekolah",
      gambar:
        berita.gambar ||
        berita.gambarCover ||
        berita.gambar_cover ||
        berita.cover ||
        "",
      alt: berita.judul || "Foto berita sekolah",
      ikon: "newspaper",
      judul: berita.judul || "Berita SMA Harapan Jaya",
      keterangan:
        berita.ringkasan ||
        berita.cuplikan ||
        berita.kategori ||
        "Informasi terbaru SMA Harapan Jaya",
      badge: berita.kategori || "Berita",
    }));
  }, [daftarBerita]);

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

        const isiSambutan = pengaturan.sambutan_kepsek || "";

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
