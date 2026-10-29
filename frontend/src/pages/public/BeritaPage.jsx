/** @format */
import { useMemo, useState } from "react";
import { SearchX } from "lucide-react";

import BeritaHero from "@/components/berita/BeritaHero";
import BeritaFilter from "@/components/berita/BeritaFilter";
import BeritaUtama from "@/components/berita/BeritaUtama";
import KumpulanBerita from "@/components/berita/KumpulanBerita";
import PengumumanResmi from "@/components/berita/PengumumanResmi";
import LayananMedia from "@/components/berita/LayananMedia";

const beritaData = [
  {
    id: 1,
    kategori: "Adiwiyata & Lingkungan",
    tanggal: "22 Feb 2026",
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
    judul: "Penyelenggaraan Donor Darah Sukarela PMR Harapan Jaya",
    deskripsi:
      "Kegiatan sosial yang melibatkan anggota PMR untuk meningkatkan kepedulian sesama.",
    baca: "2 mnt baca",
    gambar:
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
  },
];

const parseTanggal = (tanggal) => {
  const [hari, bulan, tahun] = tanggal.split(" ");

  const nomorBulan = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    Mei: 4,
    Jun: 5,
    Jul: 6,
    Agu: 7,
    Sep: 8,
    Okt: 9,
    Nov: 10,
    Des: 11,
  };

  return new Date(
    Number(tahun),
    nomorBulan[bulan] ?? 0,
    Number(hari)
  ).getTime();
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f9f7",
    color: "#263b2c",
    fontFamily: "Arial, Helvetica, sans-serif",
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
    gridTemplateColumns:
      "minmax(0, 2fr) minmax(260px, 0.92fr)",
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
  const [search, setSearch] = useState("");
  const [kategoriAktif, setKategoriAktif] =
    useState("Semua Berita");
  const [sort, setSort] = useState("terbaru");
  const [halaman, setHalaman] = useState(1);

  const beritaTampil = useMemo(() => {
    let data = [...beritaData];

    if (kategoriAktif !== "Semua Berita") {
      data = data.filter(
        (item) => item.kategori === kategoriAktif
      );
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
          value.toLocaleLowerCase("id").includes(kataKunci)
        )
      );
    }

    data.sort((a, b) => {
      const selisih =
        parseTanggal(b.tanggal) - parseTanggal(a.tanggal);

      return sort === "terlama" ? -selisih : selisih;
    });

    return data;
  }, [search, kategoriAktif, sort]);

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
      <main>
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

                <h3 style={{ margin: "0 0 8px" }}>
                  Berita tidak ditemukan
                </h3>

                <p style={{ margin: 0, lineHeight: 1.7 }}>
                  Coba gunakan kata kunci lain atau pilih
                  kategori berita yang berbeda.
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