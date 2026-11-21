import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import SectionHeading from "@/components/ui/SectionHeading";
import { useDaftarGaleri } from "@/hooks/useGaleri";

const JUMLAH_TAMPIL = 6;

// Satu foto pratinjau. Kalau sampul album gagal dimuat (file belum diunggah),
// pakai gambar cadangan dari mock; kalau itu juga gagal, tampil kotak kosong.
function FotoPratinjau({ foto }) {
  const [utamaGagal, setUtamaGagal] = useState(false);
  const [cadanganGagal, setCadanganGagal] = useState(false);

  const pakaiCadangan = !foto.gambar || utamaGagal;
  const src = pakaiCadangan ? foto.cadangan : foto.gambar;
  const rusak = !src || (pakaiCadangan && cadanganGagal);

  return (
    <Link
      to="/galeri"
      aria-label={`Lihat galeri: ${foto.judul}`}
      className="relative group block rounded-xl overflow-hidden aspect-[4/3] bg-surface-white shadow-sm border border-secondary/20 hover:border-secondary hover:shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    >
      {rusak ? (
        <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface-light">
          <Icon name="photo_library" className="text-4xl" />
        </div>
      ) : (
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={src}
          alt={foto.alt}
          loading="lazy"
          onError={() =>
            pakaiCadangan ? setCadanganGagal(true) : setUtamaGagal(true)
          }
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <span className="inline-block w-fit px-2 py-0.5 rounded bg-cta-gold text-primary font-bold text-[11px] uppercase tracking-wider mb-1">
          {foto.kategori}
        </span>
        <h4 className="text-surface-white font-bold text-title-md">
          {foto.judul}
        </h4>
      </div>
    </Link>
  );
}

// `data` = mock galeri dari home.js (dipakai sebagai gambar cadangan & data awal).
export default function GaleriPreview({ data }) {
  const { data: daftarGaleri = [] } = useDaftarGaleri({ status: "tayang" });
  const album = Array.isArray(daftarGaleri) ? daftarGaleri : [];
  const cadangan = data?.foto ?? [];

  const sumber = album.length > 0 ? album : cadangan;

  const totalFoto =
    album.length > 0
      ? album.reduce(
          (acc, a) => acc + (Number(a.jumlahFoto ?? a.jumlah_foto) || 1),
          0,
        )
      : data?.totalFoto || 0;

  const items = sumber.slice(0, JUMLAH_TAMPIL).map((f, i) => ({
    id: f.id,
    judul: f.judul || f.judul_foto || "",
    kategori: f.kategori || "Kegiatan",
    gambar: f.gambar || f.cover || f.image_url || "",
    cadangan: cadangan[i]?.gambar || "",
    alt: f.alt || f.judul || f.judul_foto || "Dokumentasi Sekolah",
  }));

  return (
    <section
      id="galeri"
      className="py-14 md:py-20 bg-surface-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Pembatas bagian berbingkai lembut + aksen garis hijau-emas */}
        <div className="rounded-2xl border border-secondary/25 bg-surface-light/80 p-6 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b-2 border-secondary/20 gap-4">
            <div>
              <SectionHeading
                eyebrow="Aktivitas & Kreativitas"
                title="Galeri Kegiatan Siswa"
              />
              <div className="mt-3 flex items-center gap-1.5">
                <span className="h-1 w-14 rounded-full bg-secondary" />
                <span className="h-1 w-4 rounded-full bg-cta-gold" />
              </div>
            </div>

            <Link
              to="/galeri"
              className="px-5 py-2.5 bg-primary-container text-surface-white font-semibold rounded-lg hover:bg-secondary transition-all text-body-sm inline-flex items-center gap-2 self-start sm:self-auto shadow-sm"
            >
              <span>Lihat Galeri Lengkap ({totalFoto} Foto)</span>
              <Icon name="photo_library" className="text-[18px] text-cta-gold" />
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-secondary/30 bg-surface-white p-10 text-center">
              <Icon
                name="photo_library"
                className="mx-auto text-4xl text-text-muted mb-2"
              />
              <p className="text-body-sm font-semibold text-text-muted">
                Belum ada dokumentasi galeri yang diterbitkan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((f) => (
                <FotoPratinjau key={f.id} foto={f} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}