import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, FileText, CalendarDays, ArrowRight } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { daftarBerita } from "@/services/berita.service";
import { agendaSekolah } from "@/data/agenda";

const halamanPublik = [
  {
    judul: "Beranda",
    deskripsi: "Halaman utama SMA Harapan Jaya.",
    kataKunci: "beranda utama sekolah sambutan informasi",
    url: "/",
    kategori: "Halaman",
  },
  {
    judul: "Profil Sekolah",
    deskripsi: "Informasi profil dan identitas SMA Harapan Jaya.",
    kataKunci: "profil sekolah sejarah identitas sma harapan jaya",
    url: "/profil",
    kategori: "Halaman",
  },
  {
    judul: "Visi, Misi & Budaya Sekolah",
    deskripsi: "Informasi visi, misi, dan budaya sekolah.",
    kataKunci: "visi misi budaya tujuan sekolah",
    url: "/profil/visi-misi",
    kategori: "Halaman",
  },
  {
    judul: "Guru & Tenaga Kependidikan",
    deskripsi: "Informasi guru dan tenaga kependidikan sekolah.",
    kataKunci: "guru tenaga pendidik tenaga kependidikan staf pengajar",
    url: "/profil/guru",
    kategori: "Halaman",
  },
  {
    judul: "Berita Sekolah",
    deskripsi: "Kumpulan berita dan informasi terbaru sekolah.",
    kataKunci: "berita artikel informasi kabar kegiatan",
    url: "/berita",
    kategori: "Halaman",
  },
  {
    judul: "Agenda Sekolah",
    deskripsi: "Jadwal kegiatan dan agenda akademik sekolah.",
    kataKunci: "agenda jadwal kegiatan kalender acara sekolah",
    url: "/agenda",
    kategori: "Halaman",
  },
  {
    judul: "Galeri Sekolah",
    deskripsi: "Dokumentasi foto dan kegiatan SMA Harapan Jaya.",
    kataKunci: "galeri foto dokumentasi gambar kegiatan",
    url: "/galeri",
    kategori: "Halaman",
  },
  {
    judul: "PPDB",
    deskripsi: "Informasi penerimaan peserta didik baru.",
    kataKunci: "ppdb pendaftaran siswa baru peserta didik persyaratan seleksi",
    url: "/ppdb",
    kategori: "Halaman",
  },
  {
    judul: "Kontak Sekolah",
    deskripsi: "Informasi kontak dan alamat sekolah.",
    kataKunci: "kontak alamat telepon email hubungi sekolah",
    url: "/kontak",
    kategori: "Halaman",
  },
];

function cocok(teks, kataKunci) {
  const sumber = String(teks || "").toLowerCase();
  const kata = String(kataKunci || "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return kata.every((item) => sumber.includes(item));
}

function normalisasiBerita(item) {
  return {
    id: item.id,
    slug: item.slug,
    judul: item.judul || "Berita tanpa judul",
    kategori: item.kategori || "Berita",
    deskripsi:
      item.ringkasan ||
      item.cuplikan ||
      item.deskripsi ||
      item.konten ||
      item.isi ||
      "",
    tanggal: item.created_at || item.tanggal || "",
    url: item.slug ? `/berita/${item.slug}` : "/berita",
  };
}

function KartuHasil({ item, tipe }) {
  const berita = tipe === "Berita";
  const agenda = tipe === "Agenda";

  return (
    <Link
      to={item.url}
      className="group flex items-start gap-4 rounded-xl border border-border-muted bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
      style={{ textDecoration: "none" }}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
        {berita ? (
          <FileText size={20} />
        ) : agenda ? (
          <CalendarDays size={20} />
        ) : (
          <Icon name="language" className="text-xl" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-bold text-secondary">
            {item.kategori || tipe}
          </span>

          {item.tanggal && (
            <span className="text-[11px] text-text-muted">
              {item.tanggal}
            </span>
          )}
        </div>

        <h3 className="mt-2 text-[15px] font-bold text-primary group-hover:text-secondary">
          {item.judul}
        </h3>

        <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-text-muted">
          {item.deskripsi || item.ringkasan || "Buka halaman untuk melihat informasi lebih lanjut."}
        </p>
      </div>

      <ArrowRight
        size={17}
        className="mt-2 shrink-0 text-text-muted transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}

export default function PencarianPage() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const kataKunci = params.get("q") || "";

  const [berita, setBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let aktif = true;

    async function ambilBerita() {
      try {
        setLoading(true);
        setError(false);

        const hasil = await daftarBerita();

        if (!aktif) return;

        const data = Array.isArray(hasil)
          ? hasil
          : Array.isArray(hasil?.data)
            ? hasil.data
            : [];

        setBerita(data.map(normalisasiBerita));
      } catch (err) {
        console.error("Gagal mengambil berita untuk pencarian:", err);

        if (aktif) {
          setBerita([]);
          setError(true);
        }
      } finally {
        if (aktif) setLoading(false);
      }
    }

    ambilBerita();

    return () => {
      aktif = false;
    };
  }, []);

  const hasilHalaman = useMemo(
    () =>
      halamanPublik.filter((item) =>
        cocok(
          `${item.judul} ${item.deskripsi} ${item.kataKunci}`,
          kataKunci,
        ),
      ),
    [kataKunci],
  );

  const hasilBerita = useMemo(
    () =>
      berita.filter((item) =>
        cocok(
          `${item.judul} ${item.kategori} ${item.deskripsi} ${item.tanggal}`,
          kataKunci,
        ),
      ),
    [berita, kataKunci],
  );

  const hasilAgenda = useMemo(
    () =>
      agendaSekolah.filter((item) =>
        cocok(
          `${item.judul} ${item.kategori} ${item.deskripsi} ${item.lokasi} ${item.waktu} ${item.hari} ${item.bulan}`,
          kataKunci,
        ),
      ),
    [kataKunci],
  );

  const totalHasil =
    hasilHalaman.length + hasilBerita.length + hasilAgenda.length;

  return (
    <main
      className="min-h-screen bg-surface-light"
      style={{ fontFamily: '"Times New Roman", Times, serif' }}
    >
      <section className="border-b border-border-muted bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs text-text-muted">
            <Link to="/" className="hover:text-secondary">
              Beranda
            </Link>
            <Icon name="chevron_right" className="text-[15px]" />
            <span>Hasil Pencarian</span>
          </nav>

          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
              Pencarian Website
            </span>

            <h1 className="mt-2 text-3xl font-bold text-primary">
              Hasil Pencarian
            </h1>

            <p className="mt-3 text-sm leading-6 text-text-muted">
              Hasil pencarian untuk kata kunci{" "}
              <strong className="text-primary">
                "{kataKunci || "-"}"
              </strong>
            </p>

            <div className="mt-5 flex items-center gap-3 rounded-lg border border-border-muted bg-surface-light px-4 py-3">
              <Search size={18} className="shrink-0 text-secondary" />
              <span className="text-sm text-primary">
                {kataKunci || "Masukkan kata kunci pencarian"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        {loading ? (
          <div className="rounded-xl border border-border-muted bg-white p-8 text-center text-sm text-text-muted">
            Sedang memuat hasil pencarian...
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-text-muted">
              Ditemukan{" "}
              <strong className="text-primary">{totalHasil}</strong>{" "}
              hasil pencarian.
            </p>

            {error && (
              <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Data berita belum berhasil dimuat. Hasil halaman dan agenda tetap dapat ditampilkan.
              </p>
            )}

            {totalHasil === 0 ? (
              <div className="rounded-xl border border-border-muted bg-white px-5 py-12 text-center">
                <Search
                  size={32}
                  className="mx-auto text-text-muted"
                />
                <h2 className="mt-4 text-lg font-bold text-primary">
                  Hasil tidak ditemukan
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                  Coba gunakan kata kunci lain yang lebih umum.
                </p>
                <Link
                  to="/"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-secondary"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            ) : (
              <div className="space-y-9">
                {hasilHalaman.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-lg font-bold text-primary">
                      Halaman Website ({hasilHalaman.length})
                    </h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      {hasilHalaman.map((item) => (
                        <KartuHasil
                          key={item.url}
                          item={item}
                          tipe="Halaman"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {hasilBerita.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-lg font-bold text-primary">
                      Berita ({hasilBerita.length})
                    </h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      {hasilBerita.map((item, index) => (
                        <KartuHasil
                          key={item.id || item.slug || index}
                          item={item}
                          tipe="Berita"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {hasilAgenda.length > 0 && (
                  <section>
                    <h2 className="mb-4 text-lg font-bold text-primary">
                      Agenda ({hasilAgenda.length})
                    </h2>
                    <div className="grid gap-3 md:grid-cols-2">
                      {hasilAgenda.map((item) => (
                        <KartuHasil
                          key={item.id}
                          item={{
                            ...item,
                            url: `/agenda/${item.id}`,
                            tanggal: `${item.tanggal} ${item.bulan}`,
                          }}
                          tipe="Agenda"
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}