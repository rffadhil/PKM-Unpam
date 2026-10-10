// Pilihan & tampilan status untuk modul Agenda (pola sama dengan config/kategoriBerita.js).
export const KATEGORI_AGENDA = ['Dinas & Komite', 'Kesiswaan & Ekskul', 'Akademik & Ujian', 'Peringatan Hari Besar']

export const PERIODE_AKADEMIK = ['Semester Genap 2025/2026', 'Semester Ganjil 2025/2026']

export const STATUS_AGENDA = {
  mendatang: { label: 'Mendatang', badge: 'bg-secondary-container/60 text-secondary-dark', dot: 'bg-secondary' },
  penting: { label: 'Penting / Wajib', badge: 'bg-cta-gold/30 text-primary', dot: 'bg-cta-gold' },
  selesai: { label: 'Selesai', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
}
