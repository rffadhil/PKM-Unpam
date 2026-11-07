// Konstanta halaman Manajemen Dokumen (admin).
export const DOKUMEN_PER_HALAMAN = 4
export const BATAS_BERKAS_MB = 15

export const FILTER_DOKUMEN_AWAL = { kategori: '', status: '' }

export const KATEGORI_DOKUMEN = [
  'PPDB & Calon Siswa',
  'Layanan SIS Siswa',
  'Umum & Siswa',
  'Akademik SIS',
]

export const STATUS_DOKUMEN = [
  { nilai: 'aktif', label: 'Aktif di SIS' },
  { nilai: 'nonaktif', label: 'Nonaktif' },
]

// Format yang boleh diunggah + tampilan ikonnya.
export const FORMAT_DOKUMEN = {
  pdf: { label: 'PDF', ikon: 'picture_as_pdf', tone: 'bg-red-50 text-red-600 border-red-100' },
  docx: { label: 'DOCX', ikon: 'description', tone: 'bg-blue-50 text-blue-600 border-blue-100' },
  xlsx: { label: 'XLSX', ikon: 'table_chart', tone: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
}

export const GAYA_INPUT =
  'block w-full rounded-xl border border-border-muted bg-surface-white px-3.5 py-2.5 text-sm text-on-surface placeholder:text-text-muted/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
