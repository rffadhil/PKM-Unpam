
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

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f9f7",
    color: "#263b2c",
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
    background: "#f0f5f0",
    padding: "28px 0",
    borderTop: "1px solid #e1e9e2",
    borderBottom: "1px solid #e1e9e2",
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
  },

  content: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 24,
    alignItems: "start",
    paddingTop: 30,
    paddingBottom: 40,
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
  },

  listColumn: {
    minWidth: 0,
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
  },

  empty: {
    padding: "40px 20px",
    textAlign: "center",
    background: "#fff",
    border: "1px solid #e3e9e4",
    borderRadius: 12,
    color: "#667568",
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
  },

  actionButton: {
    marginTop: 18,
    padding: "10px 18px",
    background: "#176b3a",
    color: "#fff",
    border: 0,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
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
      <main style={{ fontFamily: FONT_HALAMAN, fontWeight: 400 }}>
        <BeritaHero />

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
          <div style={styles.listColumn}>
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
