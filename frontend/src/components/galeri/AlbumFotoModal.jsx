import { useEffect, useRef, useState } from 'react'
import ModalGaleri from '@/components/galeri/ModalGaleri'
import Icon from '@/components/ui/Icon'
import { BATAS_FOTO_MB } from '@/config/galeriAdmin'
import { validasiGambar } from '@/utils/album'

export default function AlbumFotoModal({
  album,
  onSimpan,
  onTutup,
  sedangMenyimpan = false,
}) {
  const [baru, setBaru] = useState([])
  const [pesan, setPesan] = useState('')
  const daftar = useRef(baru)

  daftar.current = baru

  // Bersihkan object URL setelah modal ditutup
  useEffect(() => {
    return () => {
      daftar.current.forEach((f) => {
        URL.revokeObjectURL(f.url)
      })
    }
  }, [])

  function pilih(e) {
    const berkas = [...(e.target.files ?? [])]
    const valid = []
    let ditolak = 0

    berkas.forEach((f, i) => {
      if (validasiGambar(f)) {
        ditolak += 1
      } else {
        valid.push({
          id: `${Date.now()}-${i}-${f.name}`,
          nama: f.name,
          file: f,
          url: URL.createObjectURL(f),
        })
      }
    })

    setBaru((b) => [...b, ...valid])

    setPesan(
      ditolak
        ? `${ditolak} berkas dilewati (bukan gambar atau lebih dari ${BATAS_FOTO_MB} MB).`
        : ''
    )

    e.target.value = ''
  }

  function hapus(id) {
    if (sedangMenyimpan) return

    setBaru((b) => {
      const target = b.find((f) => f.id === id)

      if (target) {
        URL.revokeObjectURL(target.url)
      }

      return b.filter((f) => f.id !== id)
    })
  }

  function simpan() {
    if (baru.length === 0 || sedangMenyimpan) return

    // Kirim file asli, bukan URL preview
    onSimpan(
      album.id,
      baru.map((f) => f.file)
    )
  }

  return (
    <ModalGaleri
      judul={`Foto album: ${album.judul}`}
      lebar="max-w-2xl"
      onTutup={sedangMenyimpan ? undefined : onTutup}
      footer={
        <>
          <button
            type="button"
            disabled={sedangMenyimpan}
            onClick={onTutup}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container disabled:opacity-50"
          >
            Tutup
          </button>

          <button
            type="button"
            disabled={baru.length === 0 || sedangMenyimpan}
            onClick={simpan}
            className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sedangMenyimpan
              ? 'Mengunggah foto...'
              : baru.length
                ? `Tambahkan ${baru.length} Foto`
                : 'Tambahkan Foto'}
          </button>
        </>
      }
    >
      <p className="mb-4 text-sm text-text-muted">
        Album ini berisi{' '}
        <strong className="text-primary">
          {album.jumlahFoto} foto
        </strong>
        . Pilih foto baru untuk ditambahkan.
      </p>

      <label
        className={`flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border-muted bg-surface-light/60 px-4 py-8 text-center transition-colors ${
          sedangMenyimpan
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
          disabled={sedangMenyimpan}
          onChange={pilih}
          className="sr-only"
        />
      </label>

      {pesan && (
        <p role="alert" className="mt-3 text-sm text-error">
          {pesan}
        </p>
      )}

      {baru.length > 0 && (
        <>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-primary">
              Foto yang akan diunggah ({baru.length})
            </p>
          </div>

          <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {baru.map((f) => (
              <li
                key={f.id}
                className="group relative aspect-square overflow-hidden rounded-lg bg-surface-container"
              >
                <img
                  src={f.url}
                  alt={f.nama}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  disabled={sedangMenyimpan}
                  onClick={() => hapus(f.id)}
                  aria-label={`Hapus ${f.nama} dari daftar upload`}
                  className="absolute right-1 top-1 rounded-full bg-black/65 p-1 text-white opacity-100 transition-opacity hover:bg-black disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Icon
                    name="close"
                    className="text-[16px]"
                  />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </ModalGaleri>
  )
}