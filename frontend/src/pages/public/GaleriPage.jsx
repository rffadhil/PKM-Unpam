import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import PageHero from '@/components/ui/PageHero'
import LightboxAlbum from '@/components/galeri/LightboxAlbum'
import { useDaftarGaleri } from '@/hooks/useGaleri'
import { ambilGaleri } from '@/services/galeri.service.js'

const kategoriAlbum = [
  'Semua Album',
  'Adiwiyata',
  'Prestasi',
  'Riset',
  'Olahraga',
  'Seni & Budaya',
  'Kesiswaan',
  'Teknologi',
  'Institusi',
  'Pembelajaran',
]

function JudulBagian({ label, judul, deskripsi }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
        {label}
      </p>

      <h2 className="mt-2 font-headline-md text-headline-md font-bold text-primary">
        {judul}
      </h2>

      {deskripsi && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
          {deskripsi}
        </p>
      )}
    </div>
  )
}

// Kartu album: seluruh kartu membuka detail album.
function KartuAlbum({ album, onBuka, disabled }) {
  const gambarSrc = album.gambar || album.cover || album.image_url || ''
  const judulTeks = album.judul || album.judul_foto || ''

  const jumlahFotoNum = Number(
    album.jumlahFoto ?? album.jumlah_foto ?? 1,
  )

  return (
    <button
      type="button"
      onClick={() => onBuka(album)}
      disabled={disabled}
      aria-haspopup="dialog"
      aria-label={`Buka album ${judulTeks}, ${jumlahFotoNum} foto`}
      className="group block w-full min-w-0 overflow-hidden rounded-xl border border-border-muted bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
        {gambarSrc ? (
          <img
            src={gambarSrc}
            alt={judulTeks}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <Icon name="photo_library" className="text-4xl" />
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-md bg-primary/90 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
          {jumlahFotoNum} Foto
        </span>

        <span className="absolute inset-0 flex items-center justify-center bg-primary/0 opacity-0 transition-all duration-200 group-hover:bg-primary/35 group-hover:opacity-100 group-focus-visible:bg-primary/35 group-focus-visible:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-primary shadow">
            <Icon name="zoom_in" className="text-[16px]" />
            Lihat foto
          </span>
        </span>
      </div>

      <div className="p-3.5">
        <h3 className="line-clamp-2 min-h-[42px] text-sm font-bold leading-5 text-primary transition-colors group-hover:text-secondary">
          {judulTeks}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border-muted pt-3 text-[10px] text-text-muted">
          <span className="flex min-w-0 items-center gap-1">
            <Icon
              name="photo_camera"
              className="shrink-0 text-[14px] text-secondary"
            />
            <span className="truncate">{album.kategori}</span>
          </span>

          <span className="shrink-0">{album.tanggal}</span>
        </div>
      </div>
    </button>
  )
}

export default function GaleriPage() {
  const { data: dataGaleri = [] } = useDaftarGaleri({
    status: 'tayang',
  })

  const [kategoriAktif, setKategoriAktif] = useState('Semua Album')
  const [kataKunci, setKataKunci] = useState('')
  const [jumlahTampil, setJumlahTampil] = useState(8)

  const [albumDibuka, setAlbumDibuka] = useState(null)
  const [loadingAlbum, setLoadingAlbum] = useState(false)

  // Mengambil detail album beserta seluruh foto dari backend.
  async function bukaAlbum(album) {
    if (!album?.id || loadingAlbum) return

    try {
      setLoadingAlbum(true)

      const detail = await ambilGaleri(album.id)

      if (!detail || !detail.id) {
        throw new Error('Detail album tidak ditemukan.')
      }

      setAlbumDibuka(detail)
    } catch (error) {
      console.error('Gagal mengambil detail album:', error)

      alert(
        error.message ||
          'Gagal memuat foto album. Silakan coba lagi.',
      )
    } finally {
      setLoadingAlbum(false)
    }
  }

  // Filter album berdasarkan kategori dan pencarian.
  const albumTerfilter = useMemo(() => {
    const kata = kataKunci.trim().toLowerCase()
    const list = Array.isArray(dataGaleri) ? dataGaleri : []

    return list.filter((album) => {
      const sesuaiKategori =
        kategoriAktif === 'Semua Album' ||
        String(album.kategori || '').toLowerCase() ===
          String(kategoriAktif).toLowerCase()

      const judulTeks = String(
        album.judul || album.judul_foto || '',
      ).toLowerCase()

      const katTeks = String(album.kategori || '').toLowerCase()
      const deskTeks = String(album.deskripsi || '').toLowerCase()

      const sesuaiKata =
        !kata ||
        judulTeks.includes(kata) ||
        katTeks.includes(kata) ||
        deskTeks.includes(kata)

      return sesuaiKategori && sesuaiKata
    })
  }, [dataGaleri, kategoriAktif, kataKunci])

  const albumTampil = albumTerfilter.slice(0, jumlahTampil)

  function ubahKategori(kategori) {
    setKategoriAktif(kategori)
    setJumlahTampil(8)
  }

  function ubahPencarian(event) {
    setKataKunci(event.target.value)
    setJumlahTampil(8)
  }

  function resetFilter() {
    setKataKunci('')
    setKategoriAktif('Semua Album')
    setJumlahTampil(8)
  }

  return (
    <>
      {/* Hero halaman (judul & deskripsi memakai Times New Roman) */}
      <div className="[&_h1]:!font-['Times_New_Roman',Times,serif] [&_p]:!font-['Times_New_Roman',Times,serif]">
        <PageHero
          judul="Galeri Dokumentasi"
          deskripsi="Lihat berbagai dokumentasi kegiatan SMA Harapan Jaya, mulai dari aktivitas belajar mengajar, kegiatan sekolah, prestasi siswa, hingga momen kebersamaan yang menjadi bagian dari pengalaman di sekolah."
        />
      </div>

      {/* Galeri foto */}
      <section
        id="galeri-section"
        className="scroll-mt-24 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <JudulBagian
              label="Arsip Visual & Aktivitas Siswa"
              judul="Galeri Foto Interaktif"
              deskripsi="Jelajahi momen pembelajaran, prestasi, kreativitas, dan kebersamaan keluarga besar SMA Harapan Jaya."
            />

            <label className="relative block w-full lg:max-w-xs">
              <span className="sr-only">Cari album foto</span>

              <Icon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-text-muted"
              />

              <input
                type="search"
                value={kataKunci}
                onChange={ubahPencarian}
                placeholder="Cari kegiatan atau kategori..."
                className="w-full rounded-lg border border-border-muted bg-white py-3 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              />
            </label>
          </div>

          {/* Filter kategori */}
          <div className="custom-scrollbar mt-7 flex gap-2 overflow-x-auto pb-3">
            {kategoriAlbum.map((kategori) => {
              const aktif = kategoriAktif === kategori

              return (
                <button
                  key={kategori}
                  type="button"
                  onClick={() => ubahKategori(kategori)}
                  aria-pressed={aktif}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    aktif
                      ? 'border-primary bg-primary text-white'
                      : 'border-border-muted bg-surface-light text-on-surface hover:border-secondary hover:text-secondary'
                  }`}
                >
                  {kategori}

                  {kategori === 'Semua Album' && (
                    <span className="ml-1.5 opacity-75">
                      ({dataGaleri.length})
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Informasi jumlah album */}
          <div className="mb-5 mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              Menampilkan <strong>{albumTampil.length}</strong> dari{' '}
              <strong>{albumTerfilter.length}</strong> album
            </p>

            {(kataKunci || kategoriAktif !== 'Semua Album') && (
              <button
                type="button"
                onClick={resetFilter}
                className="text-xs font-semibold text-secondary hover:text-primary"
              >
                Reset filter
              </button>
            )}
          </div>

          {/* Daftar album */}
          {albumTampil.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {albumTampil.map((album) => (
                <KartuAlbum
                  key={album.id}
                  album={album}
                  onBuka={bukaAlbum}
                  disabled={loadingAlbum}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border-muted px-4 py-16 text-center">
              <Icon
                name="photo_library"
                className="text-4xl text-text-muted"
              />

              <h3 className="mt-3 font-bold text-primary">
                Album tidak ditemukan
              </h3>

              <p className="mt-1 text-sm text-text-muted">
                Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
              </p>

              <button
                type="button"
                onClick={resetFilter}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-secondary"
              >
                Tampilkan Semua Album
              </button>
            </div>
          )}

          {/* Tombol muat lebih banyak */}
          {jumlahTampil < albumTerfilter.length && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setJumlahTampil((jumlah) => jumlah + 4)
                }
                className="inline-flex items-center gap-2 rounded-full border border-secondary px-5 py-2.5 text-xs font-semibold text-secondary transition-colors hover:bg-secondary hover:text-white"
              >
                <Icon name="refresh" className="text-[15px]" />
                Muat Lebih Banyak Album
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video dokumentasi */}
      <section className="bg-surface-light px-4 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-xl border border-border-muted bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Icon name="play_circle" className="text-2xl" />
            </div>

            <div>
              <h3 className="font-bold text-primary">
                Aset Video Dokumentasi & Siaran Langsung Kegiatan
              </h3>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-text-muted">
                Saksikan kembali publikasi aktivitas, siaran video kegiatan,
                liputan upacara bendera, dan rekaman kegiatan resmi sekolah.
              </p>
            </div>
          </div>

          <a
            href="https://youtube.com/@smaharapanjaya2567?si=VwN3Jqm-S1qOsWn3"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-red-800"
          >
            <Icon name="smart_display" className="text-[17px]" />
            Kunjungi Kanal Video
          </a>
        </div>
      </section>

      {/* Ajakan mengirim dokumentasi */}
      <section className="custom-pattern bg-primary-container text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">

            <h2 className="mt-3 font-headline-md text-headline-md font-bold leading-tight">
              Punya Dokumentasi Kegiatan Sekolah?
              <br className="hidden sm:block" /> Kirimkan ke Tim Redaksi Warta
              Kampus
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/75">
              Bagikan momen pembelajaran, prestasi, dan kebersamaan agar
              dokumentasi kegiatan sekolah dapat dinikmati oleh seluruh warga
              sekolah.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              to="/kontak"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta-gold px-4 py-3 text-xs font-bold text-primary transition-colors hover:bg-yellow-300"
            >
              <Icon name="upload_file" className="text-[17px]" />
              Kirimkan Dokumentasi
            </Link>
          </div>
        </div>
      </section>

      {/* Loading detail album */}
      {loadingAlbum && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div
            role="status"
            className="rounded-xl bg-white px-6 py-4 text-sm font-semibold text-primary shadow-lg"
          >
            Memuat foto album...
          </div>
        </div>
      )}

      {/* Lightbox album */}
      {albumDibuka && !loadingAlbum && (
        <LightboxAlbum
          album={albumDibuka}
          onTutup={() => setAlbumDibuka(null)}
        />
      )}
    </>
  )
}