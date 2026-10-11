// Pilihan & tampilan untuk modul Galeri.
export const KATEGORI_GALERI = ['Kegiatan Adiwiyata', 'Prestasi & Lomba', 'Pembelajaran & Riset', 'Seni & Budaya']

// Label singkat di lencana sampul untuk tiap kategori (bisa diganti per album).
export const LENCANA_DEFAULT = {
  'Kegiatan Adiwiyata': 'ADIWIYATA',
  'Prestasi & Lomba': 'PRESTASI',
  'Pembelajaran & Riset': 'RISET',
  'Seni & Budaya': 'SENI BUDAYA',
}

// Gradasi pengganti sampul selama foto asli belum ada (class ditulis utuh agar terbaca Tailwind).
export const GRADASI_KATEGORI = {
  'Kegiatan Adiwiyata': 'from-secondary to-tertiary-fixed-dim',
  'Prestasi & Lomba': 'from-primary-container to-secondary',
  'Pembelajaran & Riset': 'from-blue-800 to-cyan-500',
  'Seni & Budaya': 'from-amber-600 to-rose-500',
}

export const STATUS_ALBUM = {
  tayang: { label: 'Tayang', ikon: 'public', badge: 'bg-primary-container/90 text-white' },
  draft: { label: 'Draft', ikon: 'edit_note', badge: 'bg-amber-500 text-white' },
}

export const URUTAN_ALBUM = [
  { value: 'terbaru', label: 'Urutan: Terbaru' },
  { value: 'terlama', label: 'Urutan: Terlama' },
  { value: 'nama', label: 'Urutan: Nama A-Z' },
  { value: 'foto', label: 'Urutan: Foto Terbanyak' },
]

export const BATAS_UKURAN_FOTO_MB = 5
