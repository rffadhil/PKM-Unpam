import { useState } from 'react'
import Icon from '@/components/ui/Icon'

// Gambar sampul; kalau belum ada / gagal dimuat tampil blok hijau pengganti.
// Pakai `key={src}` di pemanggil supaya status error ter-reset saat sampul diganti.
export default function AlbumCover({ src, alt, className = '' }) {
  const [gagal, setGagal] = useState(false)

  if (!src || gagal) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-primary-container to-secondary ${className}`}
      >
        <Icon name="photo_library" className="text-5xl text-white/40" />
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setGagal(true)} className={`object-cover ${className}`} />
}
