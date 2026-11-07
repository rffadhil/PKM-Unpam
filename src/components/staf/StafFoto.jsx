import { useState } from 'react'
import { inisialPtk } from '@/utils/ptk'

// Foto bulat; kalau belum ada / gagal dimuat tampil inisial.
// Pakai `key={foto}` di pemanggil supaya status error ter-reset saat foto diganti.
export default function StafFoto({ nama, src, className = 'h-12 w-12 text-sm' }) {
  const [gagal, setGagal] = useState(false)
  const dasar = `shrink-0 rounded-full border border-border-muted ${className}`

  if (!src || gagal) {
    return (
      <span aria-hidden="true" className={`inline-flex items-center justify-center bg-surface-container-high font-bold text-primary ${dasar}`}>
        {inisialPtk(nama)}
      </span>
    )
  }
  return <img src={src} alt={`Foto ${nama}`} loading="lazy" onError={() => setGagal(true)} className={`object-cover ${dasar}`} />
}
