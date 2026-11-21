/** @format */

import { useMemo, useState } from 'react'
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

const latarPutihBertekstur = {
  backgroundColor: '#ffffff',
  backgroundImage:
    'radial-gradient(rgba(47, 107, 25, 0.08) 1px, transparent 1px)',
  backgroundSize: '24px 24px',
}

const gayaVisualGaleri = `
  .gp-hero-block {
    position: relative;
    background: #063b00 !important;
    border-bottom: 4px solid #e2eb24 !important;
    color: #ffffff !important;
    box-shadow: 0 10px 24px rgba(2, 35, 0, 0.14);
  }

  .gp-hero-block *,
  .gp-hero-block *::before,
  .gp-hero-block *::after {
    background-color: transparent !important;
  }

  .gp-hero-block h1,
  .gp-hero-block h2 {
    color: #ffffff !important;
    opacity: 1 !important;
  }

  .gp-hero-block p,
  .gp-hero-block span {
    color: #dbe8d8 !important;
    opacity: 1 !important;
  }

  .gp-card-album {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(47, 107, 25, 0.24);
    border-radius: 16px;
    box-shadow: 0 4px 14px rgba(2, 35, 0, 0.06);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .gp-card-album::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2f6b19 0%, #063b00 65%, #E1E100 100%);
    transform: scaleX(0.35);
    transform-origin: left;
    transition: transform 0.28s ease;
    z-index: 10;
  }

  .gp-card-album:hover {
    transform: translateY(-6px);
    border-color: rgba(47, 107, 25, 0.48);
    box-shadow: 0 14px 28px rgba(2, 35, 0, 0.14), 0 5px 10px rgba(2, 35, 0, 0.08);
  }

  .gp-card-album:hover::before {
    transform: scaleX(1);
  }
`

function JudulBagian({ judul, deskripsi }) {
  return (
    <div>
      <h2
        style={{ color: '#ffffff' }}
        className="font-headline-md text-headline-md font-bold"
      >
        {judul}
      </h2>

      {deskripsi && (
        <p
          style={{ color: '#e2eb24' }}
          className="mt-2 max-w-2xl text-sm leading-6"
        >
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
      className="gp-card-album group block w-full min-w-0 text-left disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6b19]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f2f7f1]">
        {gambarSrc ? (
          <img
            src={gambarSrc}
            alt={judulTeks}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#5c6d63]">
            <Icon name="photo_library" className="text-4xl" />
          </div>
        )}

        <span
          style={{
            background: '#063b00',
            color: '#e2eb24',
            border: '1px solid rgba(226, 235, 36, 0.5)',
          }}
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm"
        >
          {jumlahFotoNum} Foto
        </span>

        <span className="absolute inset-0 flex items-center justify-center bg-[#022300]/0 opacity-0 transition-all duration-200 group-hover:bg-[#022300]/35 group-hover:opacity-100 group-focus-visible:bg-[#022300]/35 group-focus-visible:opacity-100">
          <span
            style={{
              background: '#ffffff',
              color: '#063b00',
              border: '1px solid rgba(47, 107, 25, 0.25)',
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold shadow"
          >
            <Icon name="zoom_in" className="text-[16px] text-[#2f6b19]" />
            Lihat foto
          </span>
        </span>
      </div>

      <div className="p-4">
        <h3
          style={{ color: '#022300' }}
          className="line-clamp-2 min-h-[42px] text-[15px] font-bold leading-5 transition-colors group-hover:text-[#2f6b19]"
        >
          {judulTeks}
        </h3>

        <div
          style={{ borderColor: 'rgba(47, 107, 25, 0.15)' }}
          className="mt-3 flex items-center justify-between gap-2 border-t pt-3 font-sans text-[11px] text-[#5c6d63]"
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <Icon
              name="photo_camera"
              className="shrink-0 text-[15px] text-[#2f6b19]"
            />
            <span className="truncate font-medium text-[#063b00]">
              {album.kategori}
            </span>
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
    <div style={latarPutihBertekstur}>
      <style>{gayaVisualGaleri}</style>

      {/* Hero halaman dengan blok hijau tua */}
      <div className="gp-hero-block [&_h1]:!font-['Times_New_Roman',Times,serif] [&_p]:!font-['Times_New_Roman',Times,serif]">
        <PageHero
          judul="Galeri Dokumentasi"
          deskripsi="Lihat berbagai dokumentasi kegiatan SMA Harapan Jaya, mulai dari aktivitas belajar mengajar, kegiatan sekolah, prestasi siswa, hingga momen kebersamaan yang menjadi bagian dari pengalaman di sekolah."
        />
      </div>

      {/* Galeri foto */}
      <section
        id="galeri-section"
        className="scroll-mt-24"
        style={{ background: 'transparent' }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:px-8">
          {/* Sub-judul blok hijau + pencarian */}
          <div
            style={{
              background: '#063b00',
              borderBottom: '4px solid #e2eb24',
              borderRadius: '14px',
              padding: '20px 24px',
              boxShadow: '0 8px 20px rgba(2, 35, 0, 0.12)',
            }}
            className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <JudulBagian
              judul="Galeri Foto Interaktif"
              deskripsi="Jelajahi momen pembelajaran, prestasi, kreativitas, dan kebersamaan keluarga besar SMA Harapan Jaya."
            />

            <label className="relative block w-full lg:max-w-xs">
              <span className="sr-only">Cari album foto</span>

              <Icon
                name="search"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#2f6b19]"
              />

              <input
                type="search"
                value={kataKunci}
                onChange={ubahPencarian}
                placeholder="Cari kegiatan atau kategori..."
                style={{
                  background: '#ffffff',
                  color: '#022300',
                  borderColor: 'rgba(226, 235, 36, 0.55)',
                }}
                className="w-full rounded-xl border py-2.5 pl-10 pr-3.5 font-sans text-sm outline-none transition-all placeholder:text-[#6b7d72] focus:border-[#e2eb24] focus:ring-2 focus:ring-[#e2eb24]/30"
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
                  style={
                    aktif
                      ? {
                          background: '#063b00',
                          color: '#e2eb24',
                          borderColor: '#063b00',
                        }
                      : {
                          background: '#ffffff',
                          color: '#022300',
                          borderColor: 'rgba(47, 107, 25, 0.25)',
                        }
                  }
                  className="shrink-0 rounded-full border px-4 py-2 font-sans text-xs font-semibold transition-all hover:border-[#2f6b19]"
                >
                  {kategori}

                  {kategori === 'Semua Album' && (
                    <span className="ml-1.5 opacity-80">
                      ({dataGaleri.length})
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Informasi jumlah album */}
          <div className="mb-5 mt-3 flex items-center justify-between gap-3 font-sans">
            <p className="text-xs text-[#5c6d63]">
              Menampilkan <strong>{albumTampil.length}</strong> dari{' '}
              <strong>{albumTerfilter.length}</strong> album
            </p>

            {(kataKunci || kategoriAktif !== 'Semua Album') && (
              <button
                type="button"
                onClick={resetFilter}
                className="text-xs font-bold text-[#063b00] underline-offset-2 hover:text-[#2f6b19] hover:underline"
              >
                Reset filter
              </button>
            )}
          </div>

          {/* Daftar album */}
          {albumTampil.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
            <div
              style={{
                background: '#ffffff',
                borderColor: 'rgba(47, 107, 25, 0.35)',
              }}
              className="rounded-2xl border border-dashed px-4 py-16 text-center shadow-sm"
            >
              <Icon
                name="photo_library"
                className="text-4xl text-[#5c6d63]"
              />

              <h3 className="mt-3 font-bold text-[#022300]">
                Album tidak ditemukan
              </h3>

              <p className="mt-1 font-sans text-sm text-[#5c6d63]">
                Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
              </p>

              <button
                type="button"
                onClick={resetFilter}
                style={{
                  background: '#063b00',
                  color: '#e2eb24',
                  border: '1px solid rgba(226, 235, 36, 0.45)',
                }}
                className="mt-4 rounded-full px-5 py-2 font-sans text-xs font-bold transition-transform hover:-translate-y-0.5"
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
                style={{
                  background: '#ffffff',
                  color: '#063b00',
                  borderColor: 'rgba(47, 107, 25, 0.35)',
                }}
                className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-sans text-xs font-bold shadow-sm transition-all hover:bg-[#063b00] hover:text-[#e2eb24]"
              >
                <Icon name="refresh" className="text-[15px]" />
                Muat Lebih Banyak Album
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video dokumentasi (dimodifikasi dengan aksen hijau-emas institusi) */}
      <section
        className="px-4 pb-14 pt-6 lg:px-8"
        style={{ background: 'transparent' }}
      >
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f3faf1 100%)',
              border: '1px solid rgba(47, 107, 25, 0.25)',
              borderLeft: '6px solid #063b00',
              borderRadius: '18px',
              boxShadow: '0 8px 22px rgba(2, 35, 0, 0.07)',
            }}
            className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7"
          >
            <div className="flex items-start gap-4">
              <div
                style={{
                  background: '#063b00',
                  color: '#e2eb24',
                  border: '1.5px solid rgba(226, 235, 36, 0.55)',
                }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              >
                <Icon name="play_circle" className="text-2xl" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#022300]">
                  Aset Video Dokumentasi & Siaran Langsung Kegiatan
                </h3>

                <p className="mt-1 max-w-2xl font-sans text-xs leading-5 text-[#55687a]">
                  Saksikan kembali publikasi aktivitas, siaran video kegiatan,
                  liputan upacara bendera, dan rekaman kegiatan resmi sekolah.
                </p>
              </div>
            </div>

            <a
              href="https://youtube.com/@smaharapanjaya2567?si=VwN3Jqm-S1qOsWn3"
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#063b00',
                color: '#e2eb24',
                border: '1px solid rgba(226, 235, 36, 0.55)',
              }}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 font-sans text-xs font-bold shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-[#2f6b19]"
            >
              <Icon name="smart_display" className="text-[17px]" />
              Kunjungi Kanal Video
            </a>
          </div>
        </div>
      </section>

      {/* Loading detail album */}
      {loadingAlbum && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div
            role="status"
            style={{ color: '#063b00' }}
            className="rounded-2xl border border-[#2f6b19]/25 bg-white px-6 py-4 text-sm font-bold shadow-lg"
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
    </div>
  )
}