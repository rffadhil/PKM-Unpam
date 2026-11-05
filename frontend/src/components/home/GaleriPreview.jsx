import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import SectionHeading from '@/components/ui/SectionHeading'
import { useDaftarGaleri } from '@/hooks/useGaleri'

const JUMLAH_TAMPIL = 6

// Satu foto pratinjau. Kalau sampul album gagal dimuat (file belum diunggah),
// pakai gambar cadangan dari mock; kalau itu juga gagal, tampil kotak kosong.
function FotoPratinjau({ foto }) {
  const [utamaGagal, setUtamaGagal] = useState(false)
  const [cadanganGagal, setCadanganGagal] = useState(false)

  const pakaiCadangan = !foto.gambar || utamaGagal
  const src = pakaiCadangan ? foto.cadangan : foto.gambar
  const rusak = !src || (pakaiCadangan && cadanganGagal)

  return (
    <Link
      to="/galeri"
      aria-label={`Lihat galeri: ${foto.judul}`}
      className="relative group block rounded-xl overflow-hidden aspect-[4/3] bg-surface-container shadow-sm border border-border-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    >
      {rusak ? (
        <div className="w-full h-full flex items-center justify-center text-text-muted">
          <Icon name="photo_library" className="text-4xl" />
        </div>
      ) : (
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={src}
          alt={foto.alt}
          loading="lazy"
          onError={() => (pakaiCadangan ? setCadanganGagal(true) : setUtamaGagal(true))}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <span className="text-cta-gold font-bold text-xs uppercase tracking-wider">{foto.kategori}</span>
        <h4 className="text-surface-white font-bold text-title-md">{foto.judul}</h4>
      </div>
    </Link>
  )
}

// `data` = mock galeri dari home.js (dipakai sebagai gambar cadangan & data awal).
export default function GaleriPreview({ data }) {
  const { data: daftarGaleri = [] } = useDaftarGaleri({ status: 'tayang' })
  const album = Array.isArray(daftarGaleri) ? daftarGaleri : []
  const cadangan = data?.foto ?? []

  const sumber = album.length > 0 ? album : cadangan

  const totalFoto =
    album.length > 0
      ? album.reduce((acc, a) => acc + (Number(a.jumlahFoto ?? a.jumlah_foto) || 1), 0)
      : data?.totalFoto || 0

  const items = sumber.slice(0, JUMLAH_TAMPIL).map((f, i) => ({
    id: f.id,
    judul: f.judul || f.judul_foto || '',
    kategori: f.kategori || 'Kegiatan',
    gambar: f.gambar || f.cover || f.image_url || '',
    cadangan: cadangan[i]?.gambar || '',
    alt: f.alt || f.judul || f.judul_foto || 'Dokumentasi Sekolah',
  }))

  return (
    <section id="galeri" className="py-16 max-w-7xl mx-auto px-4 lg:px-8 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <SectionHeading eyebrow="Aktivitas & Kreativitas" title="Galeri Kegiatan Siswa" />
        <Link
          to="/galeri"
          className="px-5 py-2.5 bg-secondary text-surface-white font-semibold rounded-lg hover:bg-primary transition-all text-body-sm inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Lihat Galeri Lengkap ({totalFoto} Foto)</span>
          <Icon name="photo_library" className="text-[18px]" />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-muted bg-surface-container/40 p-10 text-center">
          <Icon name="photo_library" className="mx-auto text-4xl text-text-muted mb-2" />
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
    </section>
  )
}
