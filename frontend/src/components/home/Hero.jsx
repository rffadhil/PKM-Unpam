import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Icon from "@/components/ui/Icon";

// Carousel manual (tanpa autoplay).
// slides berisi highlight berita dari CMS.
export default function Hero({ slides = [] }) {
  const { portal, bukaModalPpdb } = useOutletContext() || {};

  const isPpdbAktif =
    portal?.ppdb !== false &&
    portal?.ppdb_online_aktif !== false &&
    portal?.ppdb !== "false" &&
    portal?.ppdb_online_aktif !== "false";

  const [indeks, setIndeks] = useState(0);

  // Pastikan slides selalu berupa array dan tidak berisi data kosong.
  const daftarSlide = Array.isArray(slides) ? slides.filter(Boolean) : [];

  const adaSlide = daftarSlide.length > 0;

  // Pastikan indeks selalu berada dalam rentang array.
  const indeksAman = adaSlide ? indeks % daftarSlide.length : 0;

  const slide = adaSlide ? daftarSlide[indeksAman] : null;

  const nomor = adaSlide ? String(indeksAman + 1).padStart(2, "0") : "--";

  const sebelumnya = () => {
    if (!adaSlide) return;

    setIndeks((i) => (i - 1 + daftarSlide.length) % daftarSlide.length);
  };

  const berikutnya = () => {
    if (!adaSlide) return;

    setIndeks((i) => (i + 1) % daftarSlide.length);
  };

  return (
    <section className="relative bg-primary-container overflow-hidden text-surface-container-lowest">
      <div className="absolute inset-0 opacity-15 custom-pattern" />
      <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-surface-white font-bold tracking-tight">
              Membentuk Generasi Unggul, Berkarakter Pancasila, dan Berwawasan
              Lingkungan Global
            </h1>

            <p className="font-body-lg text-body-lg text-surface-container-low max-w-2xl">
              SMA Harapan Jaya berkomitmen memberikan pendidikan berkualitas
              yang mendorong siswa untuk berprestasi, mengembangkan kemampuan di
              bidang teknologi, serta membangun karakter yang baik dan peduli
              terhadap lingkungan.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              {isPpdbAktif ? (
                <Link
                  to="/ppdb"
                  className="px-6 py-3.5 bg-cta-gold text-primary font-bold rounded-lg shadow-md hover:bg-[#dcd000] transition-all duration-200 active:scale-95 text-label-lg font-label-lg flex items-center gap-2"
                >
                  <Icon name="assignment_ind" />
                  Informasi PPDB
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (bukaModalPpdb) {
                      bukaModalPpdb();
                    } else {
                      window.dispatchEvent(new CustomEvent("buka_modal_ppdb"));
                    }
                  }}
                  className="px-6 py-3.5 bg-cta-gold text-primary font-bold rounded-lg shadow-md hover:bg-[#dcd000] transition-all duration-200 active:scale-95 text-label-lg font-label-lg flex items-center gap-2"
                >
                  <Icon name="assignment_ind" />
                  Informasi PPDB
                </button>
              )}

              <Link
                to="/profil"
                className="px-6 py-3.5 bg-transparent border-2 border-surface-white text-surface-white font-semibold rounded-lg hover:bg-surface-white/10 transition-all duration-200 active:scale-95 text-label-lg font-label-lg flex items-center gap-2"
              >
                <span>Jelajahi Profil Sekolah</span>
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>

            {/* Indikator slide */}
            <div className="flex items-center gap-3 pt-6 text-body-sm font-body-sm text-surface-container-low">
              <span className="flex items-center gap-1 font-bold text-cta-gold">
                <span className="w-8 h-1.5 bg-cta-gold rounded-full" />
                Slide {nomor}
              </span>

              <span className="text-surface-container-low/50">/</span>

              <span aria-live="polite">
                {slide?.label || "Belum ada berita yang disematkan."}
              </span>

              <div className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Slide sebelumnya"
                  onClick={sebelumnya}
                  disabled={!adaSlide || daftarSlide.length < 2}
                  className="p-1 rounded hover:bg-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon name="chevron_left" className="text-[20px]" />
                </button>

                <button
                  type="button"
                  aria-label="Slide berikutnya"
                  onClick={berikutnya}
                  disabled={!adaSlide || daftarSlide.length < 2}
                  className="p-1 rounded hover:bg-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Icon name="chevron_right" className="text-[20px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Kartu visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-surface-white/20 bg-secondary/40 aspect-[4/3] group">
              {slide ? (
                <>
                  {slide.gambar ? (
                    <img
                      key={slide.id || slide.gambar}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={slide.gambar}
                      alt={
                        slide.alt || slide.judul || "Highlight berita sekolah"
                      }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-white/70">
                      <Icon name="newspaper" className="text-6xl" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 bg-surface-white/95 backdrop-blur-md p-4 rounded-xl border border-white text-on-surface shadow-lg">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 shrink-0 rounded-lg bg-primary-container text-cta-gold flex items-center justify-center">
                          <Icon name={slide.ikon || "newspaper"} />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-headline-sm text-sm font-bold text-primary line-clamp-2">
                            {slide.judul || "Berita Sekolah"}
                          </h4>

                          <p className="font-body-sm text-[12px] text-text-muted line-clamp-2">
                            {slide.keterangan || slide.ringkasan || ""}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 px-2.5 py-1 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-full">
                        {slide.badge || "Berita"}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-surface-white/80">
                  <Icon name="newspaper" className="text-6xl" />
                  <p className="text-sm font-medium">
                    Belum ada berita highlight
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
