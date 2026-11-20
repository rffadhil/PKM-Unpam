import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";

// Sambutan Kepala Sekolah.
export default function Sambutan({ data }) {
  const paragraf = data?.paragraf || [];
  const program = data?.program || {};

  return (
    <section
      id="sambutan"
      className="py-16 md:py-20 bg-surface-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-surface-light rounded-2xl border border-border-muted overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Kolom potret */}
            <div className="lg:col-span-5 bg-primary-container p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-surface-container-lowest">
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-secondary rounded-full blur-2xl opacity-35" />
              <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-cta-gold/20 rounded-full blur-2xl" />

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-cta-gold text-primary font-bold text-label-sm font-label-sm rounded uppercase tracking-wider mb-6">
                  Sambutan Pimpinan
                </span>

                <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-cta-gold shadow-xl mb-6">
                  {data?.foto ? (
                    <img
                      className="w-full h-full object-cover"
                      src={data.foto}
                      alt={data.fotoAlt || "Foto Kepala Sekolah"}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-surface-white">
                      <Icon name="user" className="text-6xl" />
                    </div>
                  )}
                </div>
              </div>

              <div className="relative z-10 text-center">
                <h3 className="font-headline-md text-headline-md font-bold text-surface-white">
                  {data?.nama || "Kepala Sekolah"}
                </h3>

                <p className="font-body-sm text-body-sm text-cta-gold font-semibold mt-1">
                  {data?.jabatan || "Pimpinan Sekolah"}
                </p>

                <p className="font-body-sm text-[12px] text-surface-container-low/80 mt-0.5">
                  {data?.nip || "-"}
                </p>
              </div>
            </div>

            {/* Kolom isi sambutan */}
            <div className="lg:col-span-7 p-8 md:p-12 bg-surface-white flex flex-col justify-center">
              <div className="flex items-center gap-2 text-secondary mb-3">
                <Icon name="format_quote" className="text-[28px]" />

                <span className="text-label-lg font-label-lg uppercase tracking-wider font-bold">
                  {data?.tagline || "Sambutan Kepala Sekolah"}
                </span>
              </div>

              <h2 className="font-headline-lg text-headline-lg font-semibold text-primary mb-6">
                {data?.judul || "Sambutan Kepala Sekolah"}
              </h2>

              <div className="space-y-4 font-body-md text-body-md text-on-surface leading-relaxed text-justify">
                {data?.salam && (
                  <p>
                    <em>{data.salam}</em>
                  </p>
                )}

                {paragraf.map((teks, index) => (
                  <p key={index}>{teks}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border-muted flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                    <Icon name="school" className="text-[20px]" />
                  </div>

                  <div>
                    <div className="text-label-lg font-label-lg font-bold text-primary">
                      {program.judul || "Profil Sekolah"}
                    </div>

                    <div className="text-body-sm font-body-sm text-text-muted">
                      {program.deskripsi || "Mengenal visi dan misi sekolah"}
                    </div>
                  </div>
                </div>

                <Link
                  to="/profil/visi-misi"
                  className="px-4 py-2 rounded-lg bg-secondary-container/60 text-primary font-bold text-body-sm inline-flex items-center gap-1 hover:bg-secondary-container transition-colors"
                >
                  Profil Visi &amp; Misi Lengkap
                  <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}