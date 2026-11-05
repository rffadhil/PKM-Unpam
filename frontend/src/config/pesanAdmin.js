// Konstanta halaman Pesan Masuk & Layanan Kontak PTSP (admin).
export const TIKET_PER_HALAMAN = 5
export const FILTER_TIKET_AWAL = { kategori: '', dari: '', sampai: '' }

// Kategori layanan: `kunci` disimpan di data, `tone` = warna kartu kategori.
export const KATEGORI_TIKET = [
  { kunci: 'tu-legalisir', label: 'Tata Usaha & Legalisir', ikon: 'assignment', tone: 'bg-surface-light border-border-muted text-primary', ikonTone: 'text-secondary' },
  { kunci: 'ppdb', label: 'Posko PPDB 2026/2027', ikon: 'school', tone: 'bg-amber-50 border-amber-300 text-amber-900', ikonTone: 'text-amber-700' },
  { kunci: 'wbs', label: 'Layanan Aspirasi & WBS', ikon: 'gavel', tone: 'bg-indigo-50 border-indigo-200 text-indigo-900', ikonTone: 'text-indigo-700' },
  { kunci: 'humas', label: 'Humas & Kemitraan Pers', ikon: 'campaign', tone: 'bg-purple-50 border-purple-200 text-purple-900', ikonTone: 'text-purple-700' },
  { kunci: 'tu-akademik', label: 'Tata Usaha & Akademik', ikon: 'assignment', tone: 'bg-surface-light border-border-muted text-primary', ikonTone: 'text-secondary' },
]


export const STATUS_TIKET = {
  'Belum Dibalas': { label: 'Belum Dibalas' },
  'Sedang Diproses': { label: 'Sedang Diproses' },
  'Selesai': { label: 'Selesai' },
}


export const GAYA_INPUT =
  'block w-full rounded-xl border border-border-muted bg-surface-white px-3.5 py-2.5 text-sm text-on-surface placeholder:text-text-muted/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
