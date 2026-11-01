/** @format */

import { useEffect, useState } from "react";
import Hero from "@/components/home/Hero";
import QuickAccess from "@/components/home/QuickAccess";
import Sambutan from "@/components/home/Sambutan";
import BeritaPengumuman from "@/components/home/BeritaPengumuman";
import AgendaMendatang from "@/components/home/AgendaMendatang";
import Statistik from "@/components/home/Statistik";
import GaleriPreview from "@/components/home/GaleriPreview";
import CtaPpdb from "@/components/home/CtaPpdb";
import { daftarBerita } from "@/services/berita.service";
import {
  heroSlides,
  aksesCepat,
  sambutan,
  berita as beritaMock,
  pengumumanTersemat as pengumumanMock,
  agenda,
  statistik,
  galeri,
  ctaPpdb,
} from "@/mocks/home";

const GAMBAR_DEFAULT =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80";

const formatTanggalPendek = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

export default function HomePage() {
  const [daftarArtikel, setDaftarArtikel] = useState(beritaMock);
  const [daftarPengumuman, setDaftarPengumuman] = useState(pengumumanMock);

  useEffect(() => {
    let aktif = true;
    daftarBerita()
      .then((rows) => {
        if (!aktif || !Array.isArray(rows) || rows.length === 0) return;

        // Format artikel dari PostgreSQL untuk komponen BeritaPengumuman
        const hasilBerita = rows.slice(0, 5).map((r) => ({
          id: r.id,
          slug: r.slug,
          judul: r.judul,
          kategori: r.kategori || "Akademik",
          ringkasan: r.ringkasan || r.cuplikan || "",
          gambar: r.gambarCover || r.gambar_cover || GAMBAR_DEFAULT,
          alt: r.judul,
          tanggal: formatTanggalPendek(r.tanggal || r.created_at),
          penulis:
            typeof r.penulis === "object"
              ? r.penulis?.nama
              : r.penulis || "Admin",
        }));
        setDaftarArtikel(hasilBerita);

        // Jika ada berita yang disematkan (is_pinned) atau berkategori Pengumuman, tampilkan di sidebar Pengumuman Tersemat
        const tersemat = rows.filter(
          (r) =>
            r.is_pinned || r.disematkan || /pengumuman/i.test(r.kategori || ""),
        );
        if (tersemat.length > 0) {
          const tones = ["gold", "secondary", "primary"];
          setDaftarPengumuman(
            tersemat.slice(0, 3).map((p, idx) => ({
              id: p.id,
              label: `${p.is_pinned || p.disematkan ? "PENTING" : "PENGUMUMAN"} • ${formatTanggalPendek(p.tanggal || p.created_at)}`,
              judul: p.judul,
              deskripsi: p.ringkasan || p.cuplikan || "",
              to: `/berita/${p.slug}`,
              tone: tones[idx % tones.length],
            })),
          );
        }
      })
      .catch(() => {
        // Tetap gunakan mock jika server belum aktif
      });

    return () => {
      aktif = false;
    };
  }, []);

  return (
    <>
      <Hero slides={heroSlides} />
      <QuickAccess items={aksesCepat} />
      <Sambutan data={sambutan} />
      <BeritaPengumuman berita={daftarArtikel} pengumuman={daftarPengumuman} />
      <AgendaMendatang items={agenda} />
      <Statistik items={statistik} />
      <GaleriPreview data={galeri} />
      <CtaPpdb data={ctaPpdb} />
    </>
  );
}
