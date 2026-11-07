import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'

// Sambutan Kepala Sekolah. Data: tabel profil sekolah (belum ada di ERD).
export default function Sambutan({ data }) {
  return (
    <section
      id="sambutan"
      className="py-16 md:py-20 bg-surface-white border-y border-border-muted mt-16 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-surface-light rounded-2xl border border-border-muted overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Kolom potret */}
            <div className="lg:col-span-5 bg-primary-container p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-surface-container-lowest">
              <div className="absolute -top-16 -left-16 w-64 h-64 bg-secondary rounded-full blur-2xl opacity-40" />
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-cta-gold text-primary font-bold text-label-sm font-label-sm rounded uppercase tracking-wider mb-6">
                  Sambutan Pimpinan
                </span>
                <div className="relative mx-auto w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-surface-white shadow-xl mb-6">
                  <img
                    className="w-full h-full object-cover"
                    src={data.foto}
                    alt={data.fotoAlt}
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="relative z-10 text-center">
                <h3 className="font-headline-md text-headline-md font-bold text-surface-white">
                  {data.nama}
                </h3>
                <p className="font-body-sm text-body-sm text-tertiary-fixed font-medium mt-1">
                  {data.jabatan}
                </p>
                <p className="font-body-sm text-[12px] text-surface-container-low opacity-80">
                  {data.nip}
                </p>
              </div>
              <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex justify-around text-center">
                {data.capaian.map((c, i) => (
                  <Fragment key={c.label}>
                    {i > 0 && <div className="h-8 w-px bg-white/20" />}
                    <div>
                      <div className="font-headline-sm font-bold text-cta-gold">{c.nilai}</div>
                      <div className="text-[11px] text-surface-container-low">{c.label}</div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Kolom isi sambutan */}
            <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-secondary mb-3">
                <Icon name="format_quote" className="text-[28px]" />
                <span className="text-label-lg font-label-lg uppercase tracking-wider font-bold">
                  {data.tagline}
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg font-semibold text-primary mb-6">
                {data.judul}
              </h2>
              <div className="space-y-4 font-body-md text-body-md text-on-surface leading-relaxed">
                <p>
                  <em>{data.salam}</em>
                </p>
                {data.paragraf.map((teks) => (
                  <p key={teks.slice(0, 24)}>{teks}</p>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-border-muted flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                    <Icon name="school" className="text-[20px]" />
                  </div>
                  <div>
                    <div className="text-label-lg font-label-lg font-bold text-primary">
                      {data.program.judul}
                    </div>
                    <div className="text-body-sm font-body-sm text-text-muted">
                      {data.program.deskripsi}
                    </div>
                  </div>
                </div>
                <Link
                  to="/profil#visi-misi"
                  className="text-secondary font-bold text-body-sm inline-flex items-center gap-1 hover:underline"
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
  )
}
