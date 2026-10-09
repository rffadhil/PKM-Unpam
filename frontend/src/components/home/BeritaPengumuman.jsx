import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon'
import SectionHeading from '@/components/ui/SectionHeading'
import { site } from '@/config/site'

// Pengumuman digabung ke tabel posts lewat kategori (PRD v1.2).
const TAB = [
  { key: 'semua', label: 'Semua', cocok: () => true },
  { key: 'berita', label: 'Berita Sekolah', cocok: (b) => b.kategori !== 'Pengumuman' },
  { key: 'pengumuman', label: 'Pengumuman Resmi', cocok: (b) => b.kategori === 'Pengumuman' },
  { key: 'prestasi', label: 'Prestasi', cocok: (b) => b.kategori === 'Prestasi' },
]

// Warna label kategori; kategori lain memakai warna bawaan.
const CHIP_KATEGORI = {
  Prestasi: 'bg-secondary text-surface-white',
  Akademik: 'bg-primary-container text-white',
  Adiwiyata: 'bg-secondary-container text-on-secondary-container',
}
const CHIP_BAWAAN = 'bg-secondary text-surface-white'

const TONE_PENGUMUMAN = {
  gold: { garis: 'border-cta-gold', label: 'text-primary bg-cta-gold' },
  secondary: { garis: 'border-secondary', label: 'text-white bg-secondary' },
  primary: { garis: 'border-primary', label: 'text-white bg-primary' },
}

function KartuUtama({ item }) {
  return (
    <article className="md:col-span-2 bg-surface-white rounded-xl border border-border-muted overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col md:flex-row">
      <div className="md:w-1/2 relative overflow-hidden aspect-[16/10] md:aspect-auto">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={item.gambar}
          alt={item.alt}
          loading="lazy"
        />
        <span
          className={clsx(
            'absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow',
            CHIP_KATEGORI[item.kategori] ?? CHIP_BAWAAN,
          )}
        >
          {item.kategori}
        </span>
      </div>
      <div className="md:w-1/2 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-text-muted text-body-sm font-body-sm mb-2">
            <Icon name="calendar_today" className="text-[16px]" />
            <span>{item.tanggal}</span>
            {item.penulis && (
              <>
                <span aria-hidden="true">•</span>
                <span>Oleh {item.penulis}</span>
              </>
            )}
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-primary group-hover:text-secondary transition-colors mb-3">
            {item.judul}
          </h3>
          <p className="font-body-sm text-body-sm text-text-muted line-clamp-3 mb-4">
            {item.ringkasan}
          </p>
        </div>
        <Link
          to={`/berita/${item.slug}`}
          className="inline-flex items-center gap-1.5 font-bold text-secondary text-body-sm hover:underline"
        >
          Baca Selengkapnya <Icon name="arrow_forward" className="text-[16px]" />
        </Link>
      </div>
    </article>
  )
}

function KartuBiasa({ item }) {
  return (
    <article className="bg-surface-white rounded-xl border border-border-muted overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
      <div>
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={item.gambar}
            alt={item.alt}
            loading="lazy"
          />
          <span
            className={clsx(
              'absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow',
              CHIP_KATEGORI[item.kategori] ?? CHIP_BAWAAN,
            )}
          >
            {item.kategori}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-text-muted text-body-sm font-body-sm mb-2">
            <Icon name="calendar_today" className="text-[16px]" />
            <span>{item.tanggal}</span>
          </div>
          <h4 className="font-headline-sm text-title-md font-bold text-primary group-hover:text-secondary transition-colors mb-2">
            {item.judul}
          </h4>
          <p className="font-body-sm text-body-sm text-text-muted line-clamp-2">{item.ringkasan}</p>
        </div>
      </div>
      <div className="p-5 pt-0">
        <Link
          to={`/berita/${item.slug}`}
          className="inline-flex items-center gap-1 font-bold text-secondary text-body-sm hover:underline"
        >
          Baca Berita <Icon name="arrow_forward" className="text-[16px]" />
        </Link>
      </div>
    </article>
  )
}

export default function BeritaPengumuman({ berita, pengumuman }) {
  const [tabAktif, setTabAktif] = useState('semua')
  const tab = TAB.find((t) => t.key === tabAktif)
  const tampil = berita.filter(tab.cocok)
  const [utama, ...lainnya] = tampil

  return (
    <section id="berita" className="py-16 max-w-7xl mx-auto px-4 lg:px-8 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <SectionHeading eyebrow="Pembaruan Kampus" title="Berita Terkini & Pengumuman Resmi" />
        <div className="flex flex-wrap gap-2 bg-surface-white p-1 rounded-xl border border-border-muted">
          {TAB.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={t.key === tabAktif}
              onClick={() => setTabAktif(t.key)}
              className={clsx(
                'px-4 py-1.5 rounded-lg text-body-sm',
                t.key === tabAktif
                  ? 'bg-primary-container text-surface-container-lowest font-semibold transition-all shadow-sm'
                  : 'hover:bg-surface-light text-text-muted font-medium transition-colors',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daftar berita (8 kolom) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
          {utama ? (
            <>
              <KartuUtama item={utama} />
              {lainnya.map((item) => (
                <KartuBiasa key={item.id} item={item} />
              ))}
            </>
          ) : (
            <p className="md:col-span-2 p-8 text-center text-body-md text-text-muted bg-surface-white rounded-xl border border-border-muted">
              Belum ada berita pada kategori ini.
            </p>
          )}
        </div>

        {/* Sidebar (4 kolom) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-white rounded-xl border-2 border-primary-container/20 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 pb-4 border-b border-border-muted mb-4">
              <div className="p-2 rounded-lg bg-cta-gold/20 text-primary-container">
                <Icon name="notifications_active" filled className="text-2xl" />
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                  Pengumuman Tersemat
                </h3>
                <p className="font-body-sm text-[12px] text-text-muted">
                  Informasi resmi &amp; instruksi mendesak
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {pengumuman.map((p) => {
                const tone = TONE_PENGUMUMAN[p.tone] ?? TONE_PENGUMUMAN.secondary
                return (
                  <div
                    key={p.id}
                    className={clsx(
                      'p-3.5 rounded-lg bg-surface-light border-l-4 hover:bg-surface-container-high transition-colors',
                      tone.garis,
                    )}
                  >
                    <span className={clsx('text-[11px] font-bold px-2 py-0.5 rounded', tone.label)}>
                      {p.label}
                    </span>
                    <Link
                      to={p.to}
                      className="block font-bold text-primary hover:text-secondary text-body-md mt-1.5"
                    >
                      {p.judul}
                    </Link>
                    <p className="text-body-sm text-text-muted mt-1">{p.deskripsi}</p>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-border-muted text-center">
              <Link
                to="/berita?kategori=Pengumuman"
                className="text-body-sm font-label-lg font-bold text-secondary hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                <span>Lihat Arsip Semua Pengumuman</span>
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </div>
          </div>

          <div className="bg-primary-container p-6 rounded-xl text-surface-container-lowest relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-headline-md text-title-md font-bold text-cta-gold">
                Butuh Bantuan PPDB?
              </h4>
              <p className="font-body-sm text-body-sm text-surface-container-low mt-2">
                Hubungi Posko Informasi &amp; Layanan Terpadu Satu Pintu (LTSP) SMA Harapan Jaya.
              </p>
              <a
                href={site.waPpdbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-cta-gold text-primary font-bold rounded-lg text-label-lg hover:bg-white transition-all"
              >
                <Icon name="chat" className="text-[18px]" />
                WhatsApp Posko PPDB
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
