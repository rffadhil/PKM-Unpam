/** @format */
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Tag, User } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { ambilBeritaPublik } from "@/services/berita.service";
import { petakanBerita, formatTanggalLengkap } from "@/utils/beritaPublik";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

function ekstrakDataBerita(response) {
  if (!response) return null;
  if (response.data && typeof response.data === "object") {
    return response.data.data ?? response.data;
  }
  if (response.berita && typeof response.berita === "object") {
    return response.berita;
  }
  return response;
}

function olahArtikel(mentah) {
  if (!mentah || typeof mentah !== "object") return null;
  const dipetakan = petakanBerita(mentah);
  const penulisMentah = dipetakan.penulis ?? mentah.penulis;
  const namaPenulis =
    typeof penulisMentah === "string"
      ? penulisMentah
      : penulisMentah?.nama || "Humas & Kesiswaan";

  return {
    ...dipetakan,
    penulisNama: namaPenulis,
    konten: mentah.konten || mentah.isi || dipetakan.konten || "",
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

  const [mentah, setMentah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selalu mulai dari atas saat membuka artikel.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [slug]);

  // Mengambil detail berita publik berdasarkan slug.
  useEffect(() => {
    let aktif = true;

    const ambilDetail = async () => {
      if (!slug) {
        setMentah(null);
        setError("Berita tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setMentah(null);

        const response = await ambilBeritaPublik(slug);
        if (!aktif) return;

        const data = ekstrakDataBerita(response);
        if (!data || (!data.id && !data.slug && !data.judul)) {
          setMentah(null);
          setError("Berita tidak ditemukan atau belum diterbitkan.");
          return;
        }

        setMentah(data);
      } catch (err) {
        if (!aktif) return;
        console.error("Gagal mengambil detail berita:", err);
        setMentah(null);
        setError("Berita tidak ditemukan atau gagal dimuat.");
      } finally {
        if (aktif) {
          setLoading(false);
        }
      }
    };

    ambilDetail();

    return () => {
      aktif = false;
    };
  }, [slug]);

  const artikel = useMemo(() => {
    if (!mentah) return null;
    try {
      return olahArtikel(mentah);
    } catch (err) {
      console.error("Gagal mengolah data artikel:", err);
      return null;
    }
  }, [mentah]);

  useEffect(() => {
    document.title = artikel
      ? `${artikel.judul} | SMA Harapan Jaya`
      : "Berita | SMA Harapan Jaya";
  }, [artikel]);

  if (loading) {
    return (
      <main
        className="min-h-screen bg-white"
        style={{ fontFamily: FONT_HALAMAN }}
      >
        <p
          role="status"
          className="mx-auto max-w-4xl px-4 py-16 text-text-muted"
        >
          Memuat artikel…
        </p>
      </main>
    );
  }

  if (error || !artikel) {
    return (
      <main
        className="min-h-screen bg-white"
        style={{ fontFamily: FONT_HALAMAN }}
      >
        <div className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-3xl font-bold text-primary">
            Berita Tidak Ditemukan
          </h1>

          <p className="mt-3 text-sm text-text-muted">
            {error ||
              "Artikel yang kamu cari tidak tersedia, belum diterbitkan, atau sudah dihapus."}
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
    <main
      className="min-h-screen w-full bg-surface-light"
      style={{ fontFamily: FONT_HALAMAN }}
    >
      <div className="w-full max-w-none px-4 py-8 sm:px-6 lg:px-10 xl:px-12">
        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-text-muted"
        >
          <Link to="/" className="hover:text-secondary">
            Beranda
          </Link>

          <Icon name="chevron_right" className="text-[15px]" />

          <Link to="/berita" className="hover:text-secondary">
            Berita
          </Link>

          <Icon name="chevron_right" className="text-[15px]" />

          <span className="font-semibold text-primary">
            {artikel.judul}
          </span>
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
              <strong className="font-bold text-primary">
                {artikel.penulisNama}
              </strong>
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

          {/* GAMBAR */}
          {artikel.gambar && (
            <figure className="mt-6">
              <img
                src={artikel.gambar}
                alt={artikel.judul}
                className="mx-auto h-auto max-h-[280px] w-full max-w-md rounded-lg border border-border-muted object-cover"
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