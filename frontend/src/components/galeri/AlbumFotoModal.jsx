
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
  const daftar = useRef([])

  useEffect(() => {
    daftar.current = baru
  }, [baru])

  useEffect(() => {
    return () => {
      daftar.current.forEach((foto) => {
        URL.revokeObjectURL(foto.url)
      })
    }
  }, [])

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

    e.target.value = ''
  }

  function hapus(id) {
    if (sedangMenyimpan) return

    const target = daftar.current.find((foto) => foto.id === id)

    if (target) {
      URL.revokeObjectURL(target.url)
    }

    setBaru((sebelumnya) =>
      sebelumnya.filter((foto) => foto.id !== id)
    )
  }

  function simpan() {
    if (baru.length === 0 || sedangMenyimpan) return

    onSimpan(
      album.id,
      baru.map((foto) => foto.file)
    )
  }

  return (
    <ModalGaleri
      judul={`Foto album: ${album.judul || album.judul_foto}`}
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
              : baru.length > 0
                ? `Tambahkan ${baru.length} Foto`
                : 'Tambahkan Foto'}
          </button>
        </>
      }
    >
      <p className="mb-4 text-sm text-text-muted">
        Album ini berisi{' '}
        <strong className="text-primary">
          {album.jumlahFoto ?? album.jumlah_foto ?? 0} foto
        </strong>
        . Pilih satu atau beberapa foto untuk ditambahkan.
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
                  onClick={() => hapus(foto.id)}
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
    </ModalGaleri>
  )
}
