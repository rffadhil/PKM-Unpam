// Konstanta halaman Manajemen Galeri (admin). Label & pilihan dipusatkan di sini
// supaya gampang diubah / diganti dari API nanti.
export const KATEGORI_ALBUM = [
  'Adiwiyata',
  'Prestasi',
  'Riset',
  'Olahraga',
  'Seni Budaya',
  'Teknologi & Riset',
]

export const STATUS_ALBUM = {
  tayang: { label: 'Tayang', ikon: 'public' },
  draft: { label: 'Draft', ikon: 'edit_note' },
}

export const ALBUM_PER_HALAMAN = 6
export const BATAS_FOTO_MB = 2

export const TAMPILAN_ALBUM = [
  { nilai: 'grid', label: 'Tampilan kartu', ikon: 'grid_view' },
  { nilai: 'list', label: 'Tampilan daftar', ikon: 'view_list' },
]

// Gaya input form (dipakai AlbumFormModal).
export const GAYA_INPUT =
  'block w-full rounded-xl border border-border-muted bg-surface-white px-3.5 py-2.5 text-sm text-on-surface placeholder:text-text-muted/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
