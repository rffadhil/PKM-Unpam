import { useEffect, useRef, useState } from 'react'
import ModalGaleri from '@/components/galeri/ModalGaleri'
import Icon from '@/components/ui/Icon'
import { BATAS_FOTO_MB } from '@/config/galeriAdmin'
import { validasiGambar } from '@/utils/album'

// Upload foto ke album. Saat ini hanya menambah jumlah foto di state lokal.
// TODO: kirim tiap berkas lewat services/upload.service.js lalu POST ke /api/galeri/:id/foto.
export default function AlbumFotoModal({ album, onSimpan, onTutup }) {
  const [baru, setBaru] = useState([])
  const [pesan, setPesan] = useState('')
  const daftar = useRef(baru)
  daftar.current = baru

  // Bersihkan object URL saat modal ditutup.
  useEffect(() => () => daftar.current.forEach((f) => URL.revokeObjectURL(f.url)), [])

  function pilih(e) {
    const berkas = [...(e.target.files ?? [])]
    const valid = []
    let ditolak = 0
    berkas.forEach((f, i) => {
      if (validasiGambar(f)) ditolak += 1
      else valid.push({ id: `${Date.now()}-${i}-${f.name}`, nama: f.name, url: URL.createObjectURL(f) })
    })
    setBaru((b) => [...b, ...valid])
    setPesan(ditolak ? `${ditolak} berkas dilewati (bukan gambar atau lebih dari ${BATAS_FOTO_MB} MB).` : '')
    e.target.value = ''
  }

  function hapus(id) {
    setBaru((b) => {
      const target = b.find((f) => f.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return b.filter((f) => f.id !== id)
    })
  }

  return (
    <ModalGaleri
      judul={`Foto album: ${album.judul}`}
      lebar="max-w-2xl"
      onTutup={onTutup}
      footer={
        <>
          <button type="button" onClick={onTutup} className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container">
            Tutup
          </button>
          <button
            type="button"
            disabled={baru.length === 0}
            onClick={() => onSimpan(album.id, baru.length)}
            className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {baru.length ? `Tambahkan ${baru.length} Foto` : 'Tambahkan Foto'}
          </button>
        </>
      }
    >
      <p className="mb-4 text-sm text-text-muted">
        Album ini berisi <strong className="text-primary">{album.jumlahFoto} foto</strong>. Pilih foto baru untuk ditambahkan.
      </p>

      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border-muted bg-surface-light/60 px-4 py-8 text-center transition-colors hover:border-secondary focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20">
        <Icon name="cloud_upload" className="text-4xl text-secondary" />
        <span className="font-semibold text-primary">Pilih foto dari perangkat</span>
        <span className="text-xs text-text-muted">JPG, PNG, atau WebP, maksimal {BATAS_FOTO_MB} MB per foto</span>
        <input type="file" accept="image/*" multiple onChange={pilih} className="sr-only" />
      </label>

      {pesan && <p role="alert" className="mt-3 text-sm text-error">{pesan}</p>}

      {baru.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {baru.map((f) => (
            <li key={f.id} className="group relative aspect-square overflow-hidden rounded-lg bg-surface-container">
              <img src={f.url} alt={f.nama} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => hapus(f.id)}
                aria-label={`Hapus ${f.nama} dari daftar upload`}
                className="absolute right-1 top-1 rounded-full bg-black/65 p-1 text-white opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
              >
                <Icon name="close" className="text-[16px]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </ModalGaleri>
  )
}
