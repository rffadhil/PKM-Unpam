/** @format */
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Tag, User } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { ambilBerita, daftarBerita } from "@/services/berita.service";
import { petakanBerita, formatTanggalLengkap } from "@/utils/beritaPublik";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

// Data contoh, hanya dipakai kalau API gagal total.
const CONTOH = {
  id: 0,
  slug: "contoh",
  judul: "Siswa SMA Harapan Jaya Raih Medali Emas di Olimpiade Sains Nasional 2026",
  ringkasan: "Delegasi siswa sukses mengamankan medali emas di ajang OSN tingkat nasional.",
  kategori: "Prestasi Siswa",
  tanggal: "2026-10-12",
  penulis: "Humas",
  konten:
    "<p>Prestasi membanggakan kembali ditorehkan oleh siswa-siswi SMA Harapan Jaya dalam ajang bergengsi Olimpiade Sains Nasional (OSN) tingkat nasional tahun 2026.</p>",
};

// Cadangan untuk kartu fallback di BeritaPage (id 1-6) dan headline utama.
const buatCadangan = (id, kategori, tanggal, judul, ringkasan, foto, slug = String(id)) => ({
  id,
  slug,
  kategori,
  tanggal,
  judul,
  ringkasan,
  gambar: `https://images.unsplash.com/${foto}?auto=format&fit=crop&w=1200&q=80`,
  penulis: "Humas & Kesiswaan",
  konten: `<p>${ringkasan}</p>`,
});

const FALLBACK = [];

function olahArtikel(mentah, detail) {
  const sumber = { ...mentah, ...(detail || {}) };
  return {
    ...petakanBerita(sumber),
    konten: sumber.konten || sumber.isi || "",
  };
}

function KontenArtikel({ konten }) {
  if (!konten) {
    return <p className="text-text-muted">Isi artikel belum tersedia.</p>;
  }
  if (/<[a-z][\s\S]*>/i.test(konten)) {
    return (
      <div
        className="konten-artikel break-words [overflow-wrap:anywhere]"
        style={{ fontFamily: FONT_HALAMAN }}
        dangerouslySetInnerHTML={{ __html: konten }}
      />
    );
  }
  return (
    <div
      className="konten-artikel break-words [overflow-wrap:anywhere]"
      style={{ fontFamily: FONT_HALAMAN }}
    >
      {konten.split(/\n{2,}/).map((p, i) => (
        <p key={i} className="break-words [overflow-wrap:anywhere]">
          {p}
        </p>
      ))}
    </div>
  );
}

export default function BeritaDetailPage() {
  const { slug } = useParams();

  const [daftar, setDaftar] = useState([]);
  const [status, setStatus] = useState("memuat"); // memuat | siap | gagal
  const [detail, setDetail] = useState(null);

  // Selalu mulai dari atas saat membuka artikel
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    let aktif = true;
    setStatus("memuat");
    setDetail(null);

    daftarBerita()
      .then((rows) => {
        if (!aktif) return;
        const list = Array.isArray(rows) ? rows : rows?.data;
        setDaftar(Array.isArray(list) ? list : []);
        setStatus("siap");
      })
      .catch(() => {
        if (!aktif) return;
        setDaftar([CONTOH]);
        setStatus("gagal");
      });

    return () => {
      aktif = false;
    };
  }, [slug]);

  const mentah = useMemo(() => {
    const cari = (list) =>
      list.find((r) => r && (String(r.slug) === slug || String(r.id) === slug));

    return (
      cari(daftar) ??
      (status === "memuat" ? null : cari(FALLBACK)) ??
      (status === "gagal" ? daftar[0] : null) ??
      null
    );
  }, [daftar, slug, status]);

  // Kalau endpoint daftar tidak menyertakan isi artikel, ambil dari endpoint detail.
  useEffect(() => {
    if (!mentah || mentah.konten || mentah.isi || status !== "siap") return;
    let aktif = true;
    ambilBerita(mentah.id)
      .then((r) => aktif && setDetail(r?.data ?? r))
      .catch(() => {});
    return () => {
      aktif = false;
    };
  }, [mentah, status]);

  const artikel = useMemo(() => {
    if (!mentah) return null;
    try {
      return olahArtikel(mentah, detail);
    } catch {
      return null;
    }
  }, [mentah, detail]);

  useEffect(() => {
    document.title = "SMA Harapan Jaya";
  }, [artikel]);

  if (status === "memuat") {
    return (
      <main className="min-h-screen bg-white" style={{ fontFamily: FONT_HALAMAN }}>
        <p role="status" className="mx-auto max-w-4xl px-4 py-16 text-text-muted">
          Memuat artikel…
        </p>
      </main>
    );
  }

  if (!artikel) {
    return (
      <main className="min-h-screen bg-white" style={{ fontFamily: FONT_HALAMAN }}>
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-3xl font-bold text-primary">Berita Tidak Ditemukan</h1>
          <p className="mt-3 text-sm text-text-muted">
            Artikel yang kamu cari tidak ada atau sudah dihapus.
          </p>
          <Link
            to="/berita"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-secondary"
          >
            <Icon name="arrow_back" className="text-[17px]" />
            Kembali ke Berita
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-surface-light" style={{ fontFamily: FONT_HALAMAN }}>
      <div className="w-full max-w-none px-4 py-8 sm:px-6 lg:px-10 xl:px-12">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-text-muted"
        >
          <Link to="/" className="hover:text-secondary">Beranda</Link>
          <Icon name="chevron_right" className="text-[15px]" />
          <Link to="/berita" className="hover:text-secondary">Berita</Link>
          <Icon name="chevron_right" className="text-[15px]" />
          <span className="font-semibold text-primary">{artikel.judul}</span>
        </nav>

        <article className="min-w-0 w-full overflow-x-hidden rounded-xl border border-border-muted bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          {/* KATEGORI */}
          {artikel.kategori && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-secondary">
              <Tag size={13} aria-hidden="true" />
              {artikel.kategori}
            </span>
          )}

          {/* JUDUL */}
          <h1 className="mt-4 text-3xl font-bold leading-tight text-primary sm:text-4xl">
            {artikel.judul}
          </h1>

          {/* PENULIS & TANGGAL PUBLIKASI */}
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border-muted pb-5 text-sm text-text-muted">
            <span className="inline-flex items-center gap-2">
              <User size={16} aria-hidden="true" />
              Ditulis oleh{" "}
              <strong className="font-bold text-primary">{artikel.penulis.nama}</strong>
            </span>
            {artikel.tanggal && (
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} aria-hidden="true" />
                {formatTanggalLengkap(artikel.tanggal)}
              </span>
            )}
          </div>

          {/* CUPLIKAN */}
          {artikel.ringkasan && (
            <p className="mt-6 text-lg italic leading-relaxed text-text-muted">
              {artikel.ringkasan}
            </p>
          )}

          {/* GAMBAR (diperkecil) */}
          {artikel.gambar && (
            <figure className="mt-6">
              <img
                src={artikel.gambar}
                alt={artikel.judul}
                className="aspect-[16/9] max-h-[460px] w-full rounded-lg border border-border-muted bg-surface-light object-contain"
              />
            </figure>
          )}

          {/* ISI ARTIKEL */}
          <div className="mt-8 text-lg">
            <KontenArtikel konten={artikel.konten} />
          </div>

          <div className="mt-10 border-t border-border-muted pt-6">
            <Link
              to="/berita"
              className="inline-flex items-center gap-2 rounded-lg border border-secondary px-4 py-3 text-sm font-bold text-secondary hover:bg-secondary/10"
            >
              <Icon name="arrow_back" className="text-[17px]" />
              Kembali ke Berita
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}