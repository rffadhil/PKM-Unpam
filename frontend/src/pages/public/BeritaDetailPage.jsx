/** @format */
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, Check, Link2, MessageCircle, User } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { ambilBerita, daftarBerita } from "@/services/berita.service";
import { petakanBerita, formatTanggalLengkap } from "@/utils/beritaPublik";
import { kategoriBerita } from "@/config/kategoriBerita";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

function IkonFacebook({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function IkonX({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

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
    "<p>Prestasi membanggakan kembali ditorehkan oleh siswa-siswi SMA Harapan Jaya dalam ajang bergengsi Olimpiade Sains Nasional (OSN) tingkat nasional tahun 2026.</p><p>Keberhasilan ini membuktikan konsistensi SMA Harapan Jaya dalam membina potensi akademis dan karakter generasi penerus bangsa.</p>",
  tags: ["Olimpiade", "PrestasiSiswa", "SMANasional"],
};

function normalisasiTags(nilai) {
  if (Array.isArray(nilai)) return nilai.filter(Boolean);
  if (typeof nilai === "string")
    return nilai.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
}

function olahArtikel(mentah, detail) {
  const sumber = { ...mentah, ...(detail || {}) };
  return {
    ...petakanBerita(sumber),
    konten: sumber.konten || sumber.isi || "",
    caption: sumber.captionGambar || sumber.caption_gambar || sumber.caption || "",
    tags: normalisasiTags(sumber.tags),
  };
}

function KontenArtikel({ konten }) {
  if (!konten) {
    return <p className="text-text-muted">Isi artikel belum tersedia.</p>;
  }
  if (/<[a-z][\s\S]*>/i.test(konten)) {
    return <div className="konten-artikel" dangerouslySetInnerHTML={{ __html: konten }} />;
  }
  return (
    <div className="konten-artikel">
      {konten.split(/\n{2,}/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

function KartuSamping({ children }) {
  return (
    <div className="rounded-xl border border-border-muted bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

export default function BeritaDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [daftar, setDaftar] = useState([]);
  const [status, setStatus] = useState("memuat"); // memuat | siap | gagal
  const [detail, setDetail] = useState(null);
  const [kataCari, setKataCari] = useState("");
  const [tersalin, setTersalin] = useState(false);

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
    const cocok = daftar.find(
      (r) => r && (String(r.slug) === slug || String(r.id) === slug)
    );
    return cocok ?? (status === "gagal" ? daftar[0] : null);
  }, [daftar, slug, status]);

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

  const populer = useMemo(() => {
    try {
      return daftar
        .filter((r) => r && r.id !== mentah?.id)
        .map((r) => petakanBerita(r))
        .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
        .slice(0, 3);
    } catch {
      return [];
    }
  }, [daftar, mentah]);

  useEffect(() => {
    if (artikel?.judul) document.title = `${artikel.judul} — SMA Harapan Jaya`;
  }, [artikel]);

  const urlHalaman = typeof window !== "undefined" ? window.location.href : "";

  const salinTautan = async () => {
    try {
      await navigator.clipboard.writeText(urlHalaman);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      // clipboard tidak tersedia
    }
  };

  const cari = (e) => {
    e.preventDefault();
    const q = kataCari.trim();
    if (q) navigate(`/pencarian?q=${encodeURIComponent(q)}`);
  };

  if (status === "memuat") {
    return (
      <main className="min-h-screen bg-white" style={{ fontFamily: FONT_HALAMAN }}>
        <p role="status" className="mx-auto max-w-7xl px-4 py-16 text-text-muted lg:px-8">
          Memuat artikel…
        </p>
      </main>
    );
  }

  if (!artikel) {
    return (
      <main className="min-h-screen bg-white" style={{ fontFamily: FONT_HALAMAN }}>
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
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

  const linkShare = encodeURIComponent(urlHalaman);
  const teksShare = encodeURIComponent(artikel.judul);
  const tombolShare =
    "flex h-10 w-10 items-center justify-center rounded-full text-white transition-opacity hover:opacity-85";

  return (
    <main className="min-h-screen bg-surface-light" style={{ fontFamily: FONT_HALAMAN }}>
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ARTIKEL */}
          <article className="rounded-xl border border-border-muted bg-white p-6 shadow-sm sm:p-10 lg:col-span-8">
            <h1 className="text-3xl font-bold leading-tight text-primary sm:text-4xl">
              {artikel.judul}
            </h1>

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
              <span>{artikel.menitBaca} menit baca</span>
            </div>

            {artikel.gambar && (
              <figure className="mt-6">
                <img
                  src={artikel.gambar}
                  alt={artikel.judul}
                  className="max-h-[520px] w-full rounded-xl border border-border-muted object-cover"
                />
                {artikel.caption && (
                  <figcaption className="mt-3 text-center text-sm italic text-text-muted">
                    {artikel.caption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="mt-8 text-lg">
              <KontenArtikel konten={artikel.konten} />
            </div>

            {/* BAGIKAN & TAGS */}
            <div className="mt-10 flex flex-col gap-4 border-t border-border-muted pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-primary">Bagikan:</span>
                <a
                  href={`https://wa.me/?text=${teksShare}%20${linkShare}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Bagikan ke WhatsApp"
                  className={`${tombolShare} bg-[#25D366]`}
                >
                  <MessageCircle size={18} />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${linkShare}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Bagikan ke Facebook"
                  className={`${tombolShare} bg-[#1877F2]`}
                >
                  <IkonFacebook />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${teksShare}&url=${linkShare}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Bagikan ke X"
                  className={`${tombolShare} bg-black`}
                >
                  <IkonX size={16} />
                </a>
                <button
                  type="button"
                  onClick={salinTautan}
                  aria-label="Salin tautan"
                  className={`${tombolShare} bg-primary-container`}
                >
                  {tersalin ? <Check size={18} /> : <Link2 size={18} />}
                </button>
              </div>

              {artikel.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
                  <span>Tags:</span>
                  {artikel.tags.map((t) => (
                    <Link
                      key={t}
                      to={`/pencarian?q=${encodeURIComponent(t)}`}
                      className="text-secondary hover:underline"
                    >
                      #{String(t).replace(/^#/, "")}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="space-y-6 lg:col-span-4">
            <KartuSamping>
              <form onSubmit={cari} role="search">
                <label className="flex items-center gap-2 rounded-lg border border-border-muted bg-surface-light px-3 py-2.5">
                  <Icon name="search" className="text-[18px] text-text-muted" />
                  <input
                    type="search"
                    value={kataCari}
                    onChange={(e) => setKataCari(e.target.value)}
                    placeholder="Cari berita, agenda, informasi..."
                    aria-label="Cari berita, agenda, informasi"
                    className="w-full border-none bg-transparent p-0 text-sm text-primary outline-none focus:ring-0"
                  />
                </label>
              </form>
            </KartuSamping>

            <KartuSamping>
              <div className="mb-5 flex items-center justify-between border-b border-border-muted pb-3">
                <h2 className="text-lg font-bold text-primary">Berita Populer</h2>
                <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
              </div>

              {populer.length === 0 ? (
                <p className="text-sm text-text-muted">Belum ada berita lain.</p>
              ) : (
                <ul className="space-y-4">
                  {populer.map((p) => (
                    <li key={p.id}>
                      <Link to={`/berita/${p.slug}`} className="group flex items-center gap-3">
                        <div className="h-14 w-16 shrink-0 overflow-hidden rounded-md bg-surface-container">
                          {p.gambar && (
                            <img
                              src={p.gambar}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-bold leading-snug text-primary group-hover:text-secondary">
                            {p.judul}
                          </p>
                          {p.tanggal && (
                            <p className="mt-1 text-xs text-text-muted">
                              {formatTanggalLengkap(p.tanggal)}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </KartuSamping>

            <KartuSamping>
              <h2 className="mb-4 border-b border-border-muted pb-3 text-lg font-bold text-primary">
                Kategori
              </h2>
              <ul className="space-y-3 text-sm">
                {kategoriBerita.map((k) => (
                  <li key={k.nama}>
                    <Link
                      to={`/berita?kategori=${encodeURIComponent(k.nama)}`}
                      className={
                        k.nama === artikel.kategori
                          ? "font-bold text-secondary"
                          : "text-text-muted hover:text-secondary"
                      }
                    >
                      {k.nama}
                    </Link>
                  </li>
                ))}
              </ul>
            </KartuSamping>

            <div className="rounded-xl bg-primary-container p-6 text-white shadow-sm">
              <span className="inline-block rounded bg-cta-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                Pendaftaran
              </span>
              <h3 className="mt-3 text-xl font-bold">PPDB 2026/2027</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Telah dibuka jalur prestasi &amp; zonasi. Bergabunglah menjadi bagian dari SMA
                Harapan Jaya.
              </p>
              <Link
                to="/ppdb"
                className="mt-5 inline-flex rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:bg-white"
              >
                Daftar Sekarang
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}