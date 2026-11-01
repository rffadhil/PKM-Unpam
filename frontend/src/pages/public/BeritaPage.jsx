/** @format */
import { useEffect, useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import BeritaHero from "@/components/berita/BeritaHero";
import BeritaFilter from "@/components/berita/BeritaFilter";
import BeritaUtama from "@/components/berita/BeritaUtama";
import KumpulanBerita from "@/components/berita/KumpulanBerita";
import PengumumanResmi from "@/components/berita/PengumumanResmi";
import LayananMedia from "@/components/berita/LayananMedia";
import { daftarBerita } from "@/services/berita.service";

const beritaDataFallback = [
  {
    id: 1,
    kategori: "Adiwiyata & Lingkungan",
    tanggal: "22 Feb 2026",
    timestamp: new Date(2026, 1, 22).getTime(),
    judul: "Peringatan Hari Bumi: Peluncuran Program 1 Siswa 1 Pohon",
    deskripsi:
      "Inisiatif pelestarian lingkungan berkelanjutan dengan melibatkan seluruh warga sekolah.",
    baca: "3 mnt baca",
    gambar:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    kategori: "Kegiatan Akademik",
    tanggal: "20 Feb 2026",
    timestamp: new Date(2026, 1, 20).getTime(),
    judul: "Sosialisasi Asesmen Bakat Minat dan Strategi Persiapan",
    deskripsi:
      "Guru Bimbingan Konseling mengadakan pendampingan dan strategi persiapan kepada siswa.",
    baca: "5 mnt baca",
    gambar:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    kategori: "Prestasi Siswa",
    tanggal: "18 Feb 2026",
    timestamp: new Date(2026, 1, 18).getTime(),
    judul: "Regu Pramuka Harapan Jaya Raih Gelar Juara Umum",
    deskripsi:
      "Ambalan Ki Hajar Dewantara dan R.A. Kartini mendominasi berbagai kategori perlombaan.",
    baca: "4 mnt baca",
    gambar:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    kategori: "Kegiatan Akademik",
    tanggal: "15 Feb 2026",
    timestamp: new Date(2026, 1, 15).getTime(),
    judul: "Kunjungan Edukasi Laboratorium Bioteknologi",
    deskripsi:
      "Siswa mendalami teknik ekstraksi DNA dan mengenal bidang biologi molekuler.",
    baca: "4 mnt baca",
    gambar:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    kategori: "Kegiatan Akademik",
    tanggal: "12 Feb 2026",
    timestamp: new Date(2026, 1, 12).getTime(),
    judul: "Pameran Karya Projek Penguatan Profil Pelajar Pancasila",
    deskripsi:
      "Gelar karya siswa dengan tema gaya hidup berkelanjutan dan kearifan lokal.",
    baca: "3 mnt baca",
    gambar:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    kategori: "Prestasi Siswa",
    tanggal: "10 Feb 2026",
    timestamp: new Date(2026, 1, 10).getTime(),
    judul: "Penyelenggaraan Donor Darah Sukarela PMR Harapan Jaya",
    deskripsi:
      "Kegiatan sosial yang melibatkan anggota PMR untuk meningkatkan kepedulian sesama.",
    baca: "2 mnt baca",
    gambar:
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
  },
];

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
  const d = input ? new Date(input) : new Date();
  if (Number.isNaN(d.getTime())) return "24 Feb 2026";
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

const GAMBAR_DEFAULT =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f9f7",
    color: "#263b2c",
    fontFamily: "Times New Roman, Times, serif",
    overflowX: "hidden",
  },
  container: {
    width: "min(1200px, calc(100% - 40px))",
    margin: "0 auto",
  },
  featuredSection: {
    background: "#f0f5f0",
    padding: "28px 0",
    borderTop: "1px solid #e1e9e2",
    borderBottom: "1px solid #e1e9e2",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 0.92fr)",
    gap: 24,
    alignItems: "start",
    paddingTop: 30,
    paddingBottom: 36,
  },
  listColumn: {
    minWidth: 0,
  },
  sidebar: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  empty: {
    padding: "36px 20px",
    textAlign: "center",
    background: "#fff",
    border: "1px solid #e3e9e4",
    borderRadius: 12,
    color: "#667568",
  },
};

export default function BeritaPage() {
  const [daftarArtikel, setDaftarArtikel] = useState(beritaDataFallback);
  const [search, setSearch] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua Berita");
  const [sort, setSort] = useState("terbaru");
  const [halaman, setHalaman] = useState(1);

  useEffect(() => {
    let aktif = true;
    daftarBerita()
      .then((rows) => {
        if (!aktif || !Array.isArray(rows) || rows.length === 0) return;

        const mapped = rows.map((r) => {
          const tglSumber = r.created_at || r.tanggal;
          const ts = tglSumber ? new Date(tglSumber).getTime() : Date.now();
          return {
            id: r.id,
            slug: r.slug,
            kategori: r.kategori || "Kegiatan Akademik",
            tanggal: formatTanggalBerita(tglSumber),
            timestamp: Number.isNaN(ts) ? Date.now() : ts,
            judul: r.judul,
            deskripsi: r.ringkasan || r.cuplikan || "",
            baca: hitungMenitBaca(r.konten || r.isi || r.ringkasan),
            gambar: r.gambarCover || r.gambar_cover || GAMBAR_DEFAULT,
          };
        });

        setDaftarArtikel(mapped);
      })
      .catch(() => {
        // Fallback ke beritaDataFallback jika API belum merespons
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
        const itemKat = String(item.kategori || "").toLocaleLowerCase("id");
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
      <style>
        {`
          .berita-page-content,
          .berita-page-content * {
            font-family: "Times New Roman", Times, serif !important;
          }

          .berita-page-content h1,
          .berita-page-content h2,
          .berita-page-content h3,
          .berita-page-content h4,
          .berita-page-content h5,
          .berita-page-content h6 {
            font-weight: 700 !important;
          }

          .berita-page-content strong,
          .berita-page-content b {
            font-weight: 700 !important;
          }

          .berita-page-content button {
            font-family: "Times New Roman", Times, serif !important;
          }
        `}
      </style>

      <main className="berita-page-content">
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

        <section style={styles.featuredSection}>
          <div style={styles.container}>
            <BeritaUtama />
          </div>
        </section>

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
                  style={{ marginBottom: 12 }}
                />

                <h3 style={{ margin: "0 0 8px" }}>Berita tidak ditemukan</h3>

                <p style={{ margin: 0, lineHeight: 1.7 }}>
                  Coba gunakan kata kunci lain atau pilih kategori berita yang
                  berbeda.
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
                    fontWeight: 600,
                  }}
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>

          <aside style={styles.sidebar}>
            <PengumumanResmi />
            <LayananMedia />
          </aside>
        </section>
      </main>
    </div>
  );
}
