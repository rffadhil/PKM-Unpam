
import { useEffect, useRef, useState } from 'react'
import ModalGaleri from '@/components/galeri/ModalGaleri'
import Icon from '@/components/ui/Icon'
import { BATAS_FOTO_MB } from '@/config/galeriAdmin'
import { validasiGambar } from '@/utils/album'
import { useDetailGaleri } from '@/hooks/useGaleri'

export default function AlbumFotoModal({
  album,
  onSimpan,
  onTutup,
  onHapusFoto,
  sedangMenyimpan = false,
  sedangMenghapusFoto = false,
}) {
  const [baru, setBaru] = useState([])
  const [pesan, setPesan] = useState('')
  const [pratinjau, setPratinjau] = useState(null)
  const daftar = useRef([])

  // Mengambil detail album beserta foto yang sudah tersimpan.
  const {
    data: detailAlbum,
    isLoading: memuatFoto,
    isError: gagalMemuatFoto,
    error: errorFoto,
  } = useDetailGaleri(album?.id)

  const fotoTersimpan = Array.isArray(detailAlbum?.fotos)
    ? detailAlbum.fotos
    : Array.isArray(album?.fotos)
      ? album.fotos
      : []

  // Menyimpan daftar foto baru untuk kebutuhan cleanup URL.
  useEffect(() => {
    daftar.current = baru
  }, [baru])

  // Membersihkan URL preview saat modal ditutup.
  useEffect(() => {
    return () => {
      daftar.current.forEach((foto) => {
        URL.revokeObjectURL(foto.url)
      })
    }
  }, [])

  // Memilih foto baru dari perangkat.
  function pilih(e) {
    const berkas = Array.from(e.target.files || [])
    const valid = []
    let ditolak = 0

    berkas.forEach((file, index) => {
      const pesanValidasi = validasiGambar(file)

      if (pesanValidasi) {
        ditolak += 1
        return
      }

      valid.push({
        id: `${Date.now()}-${index}-${file.name}`,
        nama: file.name,
        file,
        url: URL.createObjectURL(file),
      })
    })

    setBaru((sebelumnya) => [...sebelumnya, ...valid])

    setPesan(
      ditolak > 0
        ? `${ditolak} foto dilewati. Pastikan format JPG, PNG, atau WebP dan ukuran tidak melebihi ${BATAS_FOTO_MB} MB.`
        : ''
    )

    // Agar file yang sama bisa dipilih kembali.
    e.target.value = ''
  }

  // Menghapus foto yang belum diunggah.
  function hapusBaru(id) {
    if (sedangMenyimpan) return

    const target = daftar.current.find(
      (foto) => foto.id === id
    )

    if (target) {
      URL.revokeObjectURL(target.url)
    }

    setBaru((sebelumnya) =>
      sebelumnya.filter((foto) => foto.id !== id)
    )
  }

  // Mengunggah foto baru.
  function simpan() {
    if (!baru.length || sedangMenyimpan) return

    onSimpan(
      album.id,
      baru.map((foto) => foto.file)
    )
  }

  return (
    <>
    <ModalGaleri
      judul={`Foto album: ${album.judul || album.judul_foto}`}
      lebar="max-w-3xl"
      onTutup={
        sedangMenyimpan || sedangMenghapusFoto
          ? undefined
          : onTutup
      }
        footer={
          <>
            <button
              type="button"
              disabled={sedangMenyimpan || sedangMenghapusFoto}
              onClick={onTutup}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container disabled:opacity-50"
            >
              Tutup
            </button>

            <button
              type="button"
              disabled={
                baru.length === 0 ||
                sedangMenyimpan ||
                sedangMenghapusFoto
              }
              onClick={simpan}
              className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sedangMenyimpan
                ? 'Mengunggah foto...'
                : baru.length > 0
                  ? `Tambahkan ${baru.length} Foto`
                  : 'Tambahkan Foto'}
            </button>
          </>
        }
      >
        {/* JUMLAH FOTO */}
        <p className="mb-4 text-sm text-text-muted">
          Album ini berisi{' '}
          <strong className="text-primary">
            {fotoTersimpan.length} foto
          </strong>
          .
        </p>

        {/* FOTO YANG SUDAH TERSIMPAN */}
        <section className="mb-6">
          <h3 className="mb-3 text-sm font-bold text-primary">
            Foto yang Sudah Diunggah
          </h3>

          {memuatFoto ? (
            <p className="py-6 text-center text-sm text-text-muted">
              Memuat foto album...
            </p>
          ) : gagalMemuatFoto ? (
            <p role="alert" className="py-4 text-sm text-error">
              Gagal memuat foto:{' '}
              {errorFoto?.message || 'Terjadi kesalahan.'}
            </p>
          ) : fotoTersimpan.length === 0 ? (
            <p className="rounded-lg bg-surface-container px-4 py-6 text-center text-sm text-text-muted">
              Belum ada foto yang diunggah ke album ini.
            </p>
          ) : (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {fotoTersimpan.map((foto) => {
                const url = foto.url || foto.image_url

                if (!url) return null

                return (
                  <li
                    key={foto.id}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-surface-container"
                  >
                    {/* Klik foto untuk melihat pratinjau */}
                    <button
                      type="button"
                      onClick={() =>
                        setPratinjau({
                          url,
                          nama: `Foto album ${album.judul || album.judul_foto}`,
                        })
                      }
                      className="h-full w-full"
                      aria-label="Lihat pratinjau foto"
                    >
                      <img
                        src={url}
                        alt={`Foto album ${album.judul || album.judul_foto}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </button>

                    {/* Hapus satu foto */}
                    <button
                      type="button"
                      disabled={
                        sedangMenghapusFoto || sedangMenyimpan
                      }
                      onClick={() => onHapusFoto?.(foto)}
                      aria-label="Hapus foto dari album"
                      className="absolute right-1 top-1 rounded-full bg-red-600 p-2 text-white shadow hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Icon name="close" className="text-base" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* UPLOAD FOTO BARU */}
        <section>
          <h3 className="mb-3 text-sm font-bold text-primary">
            Unggah Foto Baru
          </h3>

          <label
            className={`flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border-muted bg-surface-light/60 px-4 py-8 text-center transition-colors ${
              sedangMenyimpan || sedangMenghapusFoto
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer hover:border-secondary'
            }`}
          >
            <Icon
              name="cloud_upload"
              className="text-4xl text-secondary"
            />

            <span className="font-semibold text-primary">
              Pilih foto dari perangkat
            </span>

            <span className="text-xs text-text-muted">
              JPG, PNG, atau WebP, maksimal {BATAS_FOTO_MB} MB per foto
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={sedangMenyimpan || sedangMenghapusFoto}
              onChange={pilih}
              className="sr-only"
            />
          </label>

          {pesan && (
            <p role="alert" className="mt-3 text-sm text-error">
              {pesan}
            </p>
          )}

          {/* PREVIEW FOTO BARU */}
          {baru.length > 0 && (
            <>
              <p className="mt-4 text-sm font-semibold text-primary">
                Foto yang akan diunggah ({baru.length})
              </p>

              <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {baru.map((foto) => (
                  <li
                    key={foto.id}
                    className="group relative aspect-square overflow-hidden rounded-lg bg-surface-container"
                  >
                    <img
                      src={foto.url}
                      alt={foto.nama}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      disabled={sedangMenyimpan}
                      onClick={() => hapusBaru(foto.id)}
                      aria-label={`Hapus ${foto.nama} dari daftar upload`}
                      className="absolute right-1 top-1 rounded-full bg-black/65 p-1 text-white hover:bg-black disabled:opacity-50"
                    >
                      <Icon name="close" className="text-[16px]" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </ModalGaleri>

      {/* PRATINJAU FOTO LAMA */}
      {pratinjau && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPratinjau(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPratinjau(null)}
              className="absolute -right-3 -top-3 z-10 rounded-full bg-white p-2 text-black shadow"
              aria-label="Tutup pratinjau"
            >
              <Icon name="close" />
            </button>

            <img
              src={pratinjau.url}
              alt={pratinjau.nama}
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
