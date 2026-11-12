/** @format */
import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import BeritaHero from "@/components/berita/BeritaHero";
import BeritaFilter from "@/components/berita/BeritaFilter";
import BeritaUtama from "@/components/berita/BeritaUtama";
import KumpulanBerita from "@/components/berita/KumpulanBerita";
import { daftarBerita } from "@/services/berita.service";
import { KATEGORI_PENGUMUMAN } from "@/config/beritaPublik";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

const beritaDataFallback = [];

const BULAN_PENDEK = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const formatTanggalBerita = (input) => {
  const d = input ? new Date(input) : new Date();

  if (Number.isNaN(d.getTime())) return "24 Feb 2026";

  const hari = String(d.getDate()).padStart(2, "0");
  const bulan = BULAN_PENDEK[d.getMonth()] || "Jan";
  const tahun = d.getFullYear();

  return `${hari} ${bulan} ${tahun}`;
};

const hitungMenitBaca = (teks = "") => {
  const bersih = String(teks).replace(/<[^>]*>/g, " ").trim();
  const jumlahKata = bersih ? bersih.split(/\s+/).length : 0;
  const menit = Math.max(1, Math.ceil(jumlahKata / 180));

  return `${menit} mnt baca`;
};

const GAMBAR_DEFAULT =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80";

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
};

export default function BeritaPage() {
  const [daftarArtikel, setDaftarArtikel] = useState([]);
  const [headlineArtikel, setHeadlineArtikel] = useState(null);
  const [search, setSearch] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua Berita");
  const [sort, setSort] = useState("terbaru");
  const [halaman, setHalaman] = useState(1);

  useEffect(() => {
    let aktif = true;

    daftarBerita()
      .then((rows) => {
        if (!aktif) return;
        const list = Array.isArray(rows) ? rows : (rows?.data ?? []);

        const mapped = list.map((r) => {
          const tglSumber = r.created_at || r.tanggal;
          const ts = tglSumber
            ? new Date(tglSumber).getTime()
            : Date.now();
          const penulis =
            (typeof r.penulis === "string" ? r.penulis : r.penulis?.nama) ||
            "Redaksi Sekolah";

          return {
            id: r.id,
            slug: r.slug || String(r.id),
            kategori: r.kategori || "Kegiatan Akademik",
            tanggal: formatTanggalBerita(tglSumber),
            timestamp: Number.isNaN(ts) ? 0 : ts,
            judul: r.judul,
            deskripsi: r.ringkasan || r.cuplikan || "",
            baca: hitungMenitBaca(
              r.konten || r.isi || r.ringkasan
            ),
            gambar: r.gambarCover || r.gambar_cover || r.gambar || GAMBAR_DEFAULT,
            penulis,
            tanggalSumber: tglSumber,
          };
        });

        const headline = mapped
          .filter((artikel) => artikel.kategori !== KATEGORI_PENGUMUMAN)
          .sort((a, b) => b.timestamp - a.timestamp)[0] ?? null;

        setHeadlineArtikel(headline);
        setDaftarArtikel(mapped);
      })
      .catch(() => {
        if (aktif) {
          setDaftarArtikel([]);
          setHeadlineArtikel(null);
        }
      });

    return () => {
      aktif = false;
    };
  }, []);

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
        [item.judul, item.deskripsi, item.kategori, item.tanggal].some(
          (value) =>
            String(value || "")
              .toLocaleLowerCase("id")
              .includes(kataKunci)
        )
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

        <div style={styles.container}>
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
          />
        </div>

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
            {beritaTampil.length > 0 ? (
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
                  style={{
                    marginBottom: 12,
                  }}
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
                  Coba gunakan kata kunci lain atau pilih kategori berita
                  yang berbeda.
                </p>

                <button
                  type="button"
                  onClick={resetFilter}
                  style={{
                    marginTop: 18,
                    padding: "10px 18px",
                    background: "#176b3a",
                    color: "#fff",
                    border: 0,
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 400,
                    fontFamily: FONT_HALAMAN,
                  }}
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