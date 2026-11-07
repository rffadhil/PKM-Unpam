import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '@/components/ui/Icon'
import { useDetailGaleri } from '@/hooks/useGaleri'
import { formatTanggalLengkap, normalisasiFoto } from '@/utils/fotoAlbum'

// Lightbox album untuk halaman publik: foto besar, navigasi, thumbnail,
// serta judul & deskripsi album. Tutup dengan Esc, tombol X, atau klik latar.
export default function LightboxAlbum({ album, onTutup }) {
  const { data: detail, isFetching } = useDetailGaleri(album?.id)
  const { daftar: foto, lengkap } = useMemo(() => normalisasiFoto(detail, album), [detail, album])

  const [indeks, setIndeks] = useState(0)
  const [gagal, setGagal] = useState({})
  const tombolTutup = useRef(null)
  const stripRef = useRef(null)

  const total = foto.length
  const aktif = foto[Math.min(indeks, Math.max(total - 1, 0))]
  const jumlahResmi = Number(album?.jumlahFoto ?? album?.jumlah_foto ?? total)

  const sebelumnya = useCallback(() => setIndeks((i) => (total ? (i - 1 + total) % total : 0)), [total])
  const berikutnya = useCallback(() => setIndeks((i) => (total ? (i + 1) % total : 0)), [total])

  // Papan ketik: Esc, panah kiri/kanan, Home, End.
  useEffect(() => {
    function tekan(e) {
      if (e.key === 'Escape') onTutup()
      else if (e.key === 'ArrowLeft') sebelumnya()
      else if (e.key === 'ArrowRight') berikutnya()
      else if (e.key === 'Home') setIndeks(0)
      else if (e.key === 'End') setIndeks(Math.max(total - 1, 0))
    }

    document.addEventListener('keydown', tekan)
    return () => document.removeEventListener('keydown', tekan)
  }, [onTutup, sebelumnya, berikutnya, total])

  // Kunci scroll halaman selama modal terbuka & fokuskan tombol tutup.
  useEffect(() => {
    const awal = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    tombolTutup.current?.focus()

    return () => {
      document.body.style.overflow = awal
    }
  }, [])

  // Thumbnail aktif selalu terlihat di strip.
  useEffect(() => {
    const el = stripRef.current?.querySelector('[data-aktif="true"]')
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [indeks])

  // Muat lebih dulu foto sebelum/sesudahnya agar perpindahan terasa cepat.
  useEffect(() => {
    if (total < 2) return

    ;[(indeks + 1) % total, (indeks - 1 + total) % total].forEach((i) => {
      const img = new Image()
      img.src = foto[i].url
    })
  }, [indeks, total, foto])

  if (!album) return null

  const tanggal = formatTanggalLengkap(album.tanggal)
  const rusak = aktif && gagal[aktif.id]

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-0 sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onTutup()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Album: ${album.judul}`}
        className="flex h-[100dvh] w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl sm:h-[88vh] sm:rounded-2xl lg:flex-row"
      >
        {/* Area foto */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-neutral-950">
          <div className="relative min-h-0 flex-1">
            {aktif && !rusak ? (
              <img
                key={aktif.id}
                src={aktif.url}
                alt={aktif.caption || `${album.judul} - foto ${indeks + 1}`}
                onError={() => setGagal((g) => ({ ...g, [aktif.id]: true }))}
                className="absolute inset-0 h-full w-full object-contain p-2 sm:p-4"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70">
                <Icon name="broken_image" className="text-5xl" />
                <p className="text-sm">
                  {aktif ? 'Foto tidak dapat dimuat.' : 'Belum ada foto di album ini.'}
                </p>
              </div>
            )}

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={sebelumnya}
                  aria-label="Foto sebelumnya"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cta-gold sm:left-4 sm:h-10 sm:w-10"
                >
                  <Icon name="chevron_left" className="text-[26px]" />
                </button>

                <button
                  type="button"
                  onClick={berikutnya}
                  aria-label="Foto berikutnya"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cta-gold sm:right-4 sm:h-10 sm:w-10"
                >
                  <Icon name="chevron_right" className="text-[26px]" />
                </button>
              </>
            )}

            {total > 0 && (
              <span className="absolute bottom-3 left-3 rounded-md bg-black/65 px-2.5 py-1 text-xs font-semibold text-white">
                {Math.min(indeks, total - 1) + 1} / {total}
              </span>
            )}

            {/* Tombol tutup khusus layar kecil */}
            <button
              type="button"
              onClick={onTutup}
              aria-label="Tutup"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/85 lg:hidden"
            >
              <Icon name="close" className="text-[22px]" />
            </button>
          </div>

          {/* Strip thumbnail */}
          {total > 1 && (
            <div
              ref={stripRef}
              className="custom-scrollbar flex max-w-full shrink-0 gap-2 overflow-x-auto border-t border-white/10 bg-black/40 p-2 sm:p-3"
            >
              {foto.map((f, i) => {
                const sedangAktif = i === indeks

                return (
                  <button
                    key={f.id}
                    type="button"
                    data-aktif={sedangAktif}
                    onClick={() => setIndeks(i)}
                    aria-label={`Lihat foto ${i + 1}`}
                    aria-current={sedangAktif}
                    className={`h-12 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-opacity sm:h-14 sm:w-20 ${
                      sedangAktif
                        ? 'border-cta-gold opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={f.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Panel info */}
        <aside className="flex h-[36dvh] max-h-[36dvh] min-h-[150px] w-full shrink-0 flex-col bg-white lg:h-auto lg:max-h-none lg:min-h-0 lg:w-80">
          <div className="flex shrink-0 items-start justify-end gap-3 border-b border-border-muted px-4 py-3 sm:px-5 sm:py-4">
            <button
              ref={tombolTutup}
              type="button"
              onClick={onTutup}
              aria-label="Tutup"
              className="hidden rounded-full p-1.5 text-text-muted hover:bg-surface-light hover:text-primary lg:block"
            >
              <Icon name="close" className="text-[22px]" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5 sm:py-4">
            <h2 className="text-lg font-bold leading-snug text-primary">{album.judul}</h2>

            <div className="mt-3 space-y-1.5 text-xs text-text-muted">
              {tanggal && (
                <p className="flex items-center gap-2">
                  <Icon name="calendar_month" className="text-[15px] text-secondary" />
                  {tanggal}
                </p>
              )}

              <p className="flex items-center gap-2">
                <Icon name="photo_library" className="text-[15px] text-secondary" />
                {jumlahResmi} foto dalam album
              </p>
            </div>

            {album.deskripsi && (
              <p className="mt-4 text-sm leading-6 text-on-surface">{album.deskripsi}</p>
            )}

            {aktif?.caption && (
              <div className="mt-4 rounded-lg bg-surface-light px-3 py-2.5">
                <p className="text-[11px] font-semibold text-text-muted">Keterangan foto</p>
                <p className="mt-0.5 text-sm text-primary">{aktif.caption}</p>
              </div>
            )}

            {!lengkap && (
              <p className="mt-4 text-xs leading-5 text-text-muted">
                {isFetching
                  ? 'Memuat foto album...'
                  : 'Foto lengkap album ini belum tersedia, yang tampil baru foto sampul.'}
              </p>
            )}
          </div>

          <p className="hidden shrink-0 border-t border-border-muted px-5 py-3 text-[11px] text-text-muted lg:block">
            Gunakan tombol panah kiri/kanan untuk berpindah foto, Esc untuk menutup.
          </p>
        </aside>
      </div>
    </div>,
    document.body,
  )
}
