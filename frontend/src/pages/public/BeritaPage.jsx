/** @format */

import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import BeritaHero from "@/components/berita/BeritaHero";
import BeritaFilter from "@/components/berita/BeritaFilter";
import BeritaUtama from "@/components/berita/BeritaUtama";
import KumpulanBerita from "@/components/berita/KumpulanBerita";

import { useDaftarBeritaPublik } from "@/hooks/useBerita";
import { KATEGORI_PENGUMUMAN } from "@/config/beritaPublik";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

const BULAN_PENDEK = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const formatTanggalBerita = (input) => {
  if (!input) return "—";

  const d = new Date(input);

  if (Number.isNaN(d.getTime())) return "—";

  const hari = String(d.getDate()).padStart(2, "0");
  const bulan = BULAN_PENDEK[d.getMonth()] || "Jan";
  const tahun = d.getFullYear();

  return `${hari} ${bulan} ${tahun}`;
};

const hitungMenitBaca = (teks = "") => {
  const bersih = String(teks)
    .replace(/<[^>]*>/g, " ")
    .trim();

  const jumlahKata = bersih ? bersih.split(/\s+/).length : 0;
  const menit = Math.max(1, Math.ceil(jumlahKata / 180));

  return `${menit} mnt baca`;
};

const gayaVisualBerita = `
  .bp-hero-block {
    position: relative;
    background: #063b00 !important;
    border-bottom: 4px solid #e2eb24 !important;
    color: #ffffff !important;
    box-shadow: 0 10px 24px rgba(2, 35, 0, 0.14);
  }

  .bp-hero-block *,
  .bp-hero-block *::before,
  .bp-hero-block *::after {
    background-color: transparent !important;
  }

  .bp-hero-block h1,
  .bp-hero-block h2,
  .bp-hero-block h3,
  .bp-hero-block h4,
  .bp-hero-block p,
  .bp-hero-block span,
  .bp-hero-block div {
    color: #ffffff !important;
    opacity: 1 !important;
    visibility: visible !important;
  }

  .bp-list-wrap div:has(> h1):not(article *):not([class*="card"] *):not([class*="Card"] *),
  .bp-list-wrap div:has(> h2):not(article *):not([class*="card"] *):not([class*="Card"] *),
  .bp-list-wrap div:has(> h3):not(article *):not([class*="card"] *):not([class*="Card"] *) {
    background: #063b00 !important;
    border-bottom: 4px solid #e2eb24 !important;
    border-radius: 14px !important;
    padding: 18px 24px !important;
    margin-bottom: 24px !important;
    box-shadow: 0 8px 20px rgba(2, 35, 0, 0.12) !important;
  }

  .bp-list-wrap div:has(> h1):not(article *):not([class*="card"] *):not([class*="Card"] *) h1,
  .bp-list-wrap div:has(> h2):not(article *):not([class*="card"] *):not([class*="Card"] *) h2,
  .bp-list-wrap div:has(> h3):not(article *):not([class*="card"] *):not([class*="Card"] *) h3 {
    color: #ffffff !important;
    margin: 0 !important;
  }

  .bp-list-wrap div:has(> h1):not(article *):not([class*="card"] *):not([class*="Card"] *) > :not(h1),
  .bp-list-wrap div:has(> h2):not(article *):not([class*="card"] *):not([class*="Card"] *) > :not(h2),
  .bp-list-wrap div:has(> h3):not(article *):not([class*="card"] *):not([class*="Card"] *) > :not(h3) {
    display: none !important;
  }

  .bp-berita-card {
    position: relative;
    overflow: hidden;
    background: #ffffff !important;
    border: 1px solid rgba(47, 107, 25, 0.24) !important;
    border-radius: 15px !important;
    box-shadow: 0 4px 12px rgba(2, 35, 0, 0.05) !important;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease !important;
  }

  .bp-berita-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2f6b19 0%, #063b00 65%, #E1E100 100%);
    transform: scaleX(0.35);
    transform-origin: left;
    transition: transform 0.28s ease;
    z-index: 2;
  }

  .bp-berita-card:hover {
    transform: translateY(-6px);
    border-color: rgba(47, 107, 25, 0.45) !important;
    box-shadow: 0 14px 28px rgba(2, 35, 0, 0.14), 0 5px 10px rgba(2, 35, 0, 0.08) !important;
  }

  .bp-berita-card:hover::before {
    transform: scaleX(1);
  }

  .bp-list-wrap article,
  .bp-list-wrap [class*="card"],
  .bp-list-wrap [class*="Card"] {
    position: relative;
    overflow: hidden;
    background: #ffffff !important;
    color: #022300 !important;
    border: 1px solid rgba(47, 107, 25, 0.24) !important;
    border-radius: 15px !important;
    box-shadow: 0 4px 12px rgba(2, 35, 0, 0.05) !important;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease !important;
  }

  .bp-list-wrap article > div,
  .bp-list-wrap [class*="card"] > div,
  .bp-list-wrap [class*="Card"] > div {
    background: #ffffff !important;
  }

  .bp-list-wrap article h1,
  .bp-list-wrap article h2,
  .bp-list-wrap article h3,
  .bp-list-wrap [class*="card"] h1,
  .bp-list-wrap [class*="card"] h2,
  .bp-list-wrap [class*="card"] h3,
  .bp-list-wrap [class*="Card"] h1,
  .bp-list-wrap [class*="Card"] h2,
  .bp-list-wrap [class*="Card"] h3 {
    color: #022300 !important;
  }

  .bp-list-wrap article p,
  .bp-list-wrap [class*="card"] p,
  .bp-list-wrap [class*="Card"] p {
    color: #667894 !important;
  }

  .bp-list-wrap article::before,
  .bp-list-wrap [class*="card"]::before,
  .bp-list-wrap [class*="Card"]::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2f6b19 0%, #063b00 65%, #E1E100 100%);
    transform: scaleX(0.35);
    transform-origin: left;
    transition: transform 0.28s ease;
    z-index: 2;
  }

  .bp-list-wrap article:hover,
  .bp-list-wrap [class*="card"]:hover,
  .bp-list-wrap [class*="Card"]:hover {
    transform: translateY(-6px);
    border-color: rgba(47, 107, 25, 0.45) !important;
    box-shadow: 0 14px 28px rgba(2, 35, 0, 0.14), 0 5px 10px rgba(2, 35, 0, 0.08) !important;
  }

  .bp-list-wrap article:hover::before,
  .bp-list-wrap [class*="card"]:hover::before,
  .bp-list-wrap [class*="Card"]:hover::before {
    transform: scaleX(1);
  }
`;

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    backgroundImage:
      "radial-gradient(rgba(47, 107, 25, 0.08) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
    color: "#022300",
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
    overflowX: "hidden",
  },

  container: {
    width: "min(1200px, calc(100% - 40px))",
    margin: "0 auto",
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
  },

  featuredSection: {
    background: "transparent",
    padding: "28px 0 8px",
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
  },

  content: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 24,
    alignItems: "start",
    paddingTop: 28,
    paddingBottom: 56,
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
  },

  listColumn: {
    minWidth: 0,
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
  },

  empty: {
    padding: "44px 24px",
    textAlign: "center",
    background: "#ffffff",
    border: "1px dashed rgba(47, 107, 25, 0.35)",
    borderRadius: 14,
    color: "#667894",
    boxShadow: "0 4px 12px rgba(2, 35, 0, 0.05)",
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
  },

  actionButton: {
    marginTop: 18,
    padding: "10px 20px",
    background: "#063b00",
    color: "#e2eb24",
    border: "1px solid rgba(226, 235, 36, 0.45)",
    borderRadius: 22,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 700,
    fontFamily: FONT_HALAMAN,
  },
};

export default function BeritaPage() {
  const [search, setSearch] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua Berita");
  const [sort, setSort] = useState("terbaru");
  const [halaman, setHalaman] = useState(1);

  const {
    data: rows = [],
    isPending,
    isError,
    refetch,
  } = useDaftarBeritaPublik();

  useEffect(() => {
    document.title = "Berita | SMA Harapan Jaya";
  }, []);

  // Mengolah data API menjadi format yang digunakan komponen berita.
  const daftarArtikel = useMemo(() => {
    if (!Array.isArray(rows)) return [];

    return rows.map((r) => {
      const tglSumber =
        r.created_at ||
        r.tanggal ||
        r.tanggalPublikasi ||
        r.published_at ||
        "";

      const ts = tglSumber ? new Date(tglSumber).getTime() : 0;

      const penulis =
        (typeof r.penulis === "string"
          ? r.penulis
          : r.penulis?.nama) || "";

      return {
        id: r.id,
        slug: r.slug || String(r.id ?? ""),
        kategori: r.kategori || "",
        tanggal: formatTanggalBerita(tglSumber),
        timestamp: Number.isNaN(ts) ? 0 : ts,
        judul: r.judul || "",
        deskripsi: r.ringkasan || r.cuplikan || "",
        baca: hitungMenitBaca(
          r.konten || r.isi || r.ringkasan || "",
        ),
        gambar:
          r.gambarCover ||
          r.gambar_cover ||
          r.gambar ||
          "",
        penulis,
        tanggalSumber: tglSumber,
      };
    });
  }, [rows]);

  // Menentukan berita utama dari berita non-pengumuman terbaru.
  const headlineArtikel = useMemo(() => {
    return (
      daftarArtikel
        .filter(
          (artikel) =>
            artikel.kategori !== KATEGORI_PENGUMUMAN,
        )
        .sort((a, b) => b.timestamp - a.timestamp)[0] ?? null
    );
  }, [daftarArtikel]);

  // Filter kategori, pencarian, dan pengurutan berita.
  const beritaTampil = useMemo(() => {
    let data = [...daftarArtikel];

    if (kategoriAktif !== "Semua Berita") {
      const katLower = kategoriAktif.toLocaleLowerCase("id");

      data = data.filter((item) => {
        const itemKat = String(item.kategori || "")
          .toLocaleLowerCase("id");

        return (
          itemKat === katLower ||
          itemKat.includes(katLower) ||
          katLower.includes(itemKat)
        );
      });
    }

    const kataKunci = search.trim().toLocaleLowerCase("id");

    if (kataKunci) {
      data = data.filter((item) =>
        [
          item.judul,
          item.deskripsi,
          item.kategori,
          item.tanggal,
        ].some((value) =>
          String(value || "")
            .toLocaleLowerCase("id")
            .includes(kataKunci),
        ),
      );
    }

    data.sort((a, b) => {
      const selisih = (b.timestamp || 0) - (a.timestamp || 0);

      return sort === "terlama" ? -selisih : selisih;
    });

    return data;
  }, [daftarArtikel, search, kategoriAktif, sort]);

  const ubahSearch = (value) => {
    setSearch(value);
    setHalaman(1);
  };

  const ubahKategori = (value) => {
    setKategoriAktif(value);
    setHalaman(1);
  };

  const resetFilter = () => {
    setSearch("");
    setKategoriAktif("Semua Berita");
    setSort("terbaru");
    setHalaman(1);
  };

  return (
    <div style={styles.page}>
      <style>{gayaVisualBerita}</style>

      <main style={{ fontFamily: FONT_HALAMAN, fontWeight: 400 }}>
        <div className="bp-hero-block">
          <BeritaHero />
        </div>

        <BeritaFilter
          search={search}
          setSearch={ubahSearch}
          kategoriAktif={kategoriAktif}
          setKategoriAktif={ubahKategori}
          sort={sort}
          setSort={(value) => {
            setSort(value);
            setHalaman(1);
          }}
          jumlahBerita={daftarArtikel}
        />

        {headlineArtikel && (
          <section style={styles.featuredSection}>
            <div style={styles.container}>
              <BeritaUtama berita={headlineArtikel} />
            </div>
          </section>
        )}

        <section
          style={{
            ...styles.container,
            ...styles.content,
          }}
        >
          <div className="bp-list-wrap" style={styles.listColumn}>
            {isPending ? (
              <div style={styles.empty}>
                <p style={{ margin: 0, fontSize: 15 }}>
                  Memuat berita...
                </p>
              </div>
            ) : isError ? (
              <div style={styles.empty}>
                <SearchX
                  size={38}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  style={{ marginBottom: 12 }}
                />

                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: FONT_HALAMAN,
                  }}
                >
                  Berita gagal dimuat
                </h3>

                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.7,
                    fontSize: 15,
                    fontWeight: 400,
                    fontFamily: FONT_HALAMAN,
                  }}
                >
                  Tidak dapat mengambil data berita dari server.
                  Silakan periksa koneksi dan coba kembali.
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  style={styles.actionButton}
                >
                  Coba Lagi
                </button>
              </div>
            ) : beritaTampil.length > 0 ? (
              <KumpulanBerita
                berita={beritaTampil}
                halaman={halaman}
                setHalaman={setHalaman}
              />
            ) : (
              <div style={styles.empty}>
                <SearchX
                  size={38}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  style={{ marginBottom: 12 }}
                />

                <h3
                  style={{
                    margin: "0 0 8px",
                    fontSize: 20,
                    fontWeight: 700,
                    fontFamily: FONT_HALAMAN,
                  }}
                >
                  Berita tidak ditemukan
                </h3>

                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.7,
                    fontSize: 15,
                    fontWeight: 400,
                    fontFamily: FONT_HALAMAN,
                  }}
                >
                  Coba gunakan kata kunci lain atau pilih kategori
                  berita yang berbeda.
                </p>

                <button
                  type="button"
                  onClick={resetFilter}
                  style={styles.actionButton}
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}