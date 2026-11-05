// Pilihan & tampilan untuk modul Profil & Staf.
export const RUMPUN_STAF = ['Pimpinan Sekolah', 'Guru Mata Pelajaran', 'Pembina Ekstrakurikuler', 'Tenaga Kependidikan']
export const RUMPUN_TU = 'Tenaga Kependidikan'

export const STATUS_KEPEGAWAIAN = {
  PNS: 'PNS',
  PPPK: 'PPPK',
  GTY: 'GTY (Guru Tetap)',
  GTT: 'GTT (Guru Tidak Tetap)',
}

// Warna lencana jabatan (class ditulis utuh agar terbaca Tailwind).
export const LENCANA_JABATAN = {
  kepala: 'bg-primary text-white',
  waka: 'bg-secondary-dark text-white',
  pembina: 'bg-tertiary-container text-white',
  ekskul: 'bg-blue-100 text-blue-800',
  guru: 'bg-surface-container text-primary',
  tu: 'bg-amber-100 text-amber-800',
}

export const BADGE_KEPEGAWAIAN = {
  PNS: 'bg-secondary-container text-secondary-dark',
  PPPK: 'bg-tertiary-fixed/50 text-tertiary',
  GTY: 'bg-secondary-container/60 text-secondary-dark',
  GTT: 'bg-amber-100 text-amber-800',
}

export const TAB_PROFIL = [
  { id: 'direktori', label: '1. Direktori Guru & Staf', ikon: 'groups', hitung: true },
  { id: 'umum', label: '2. Informasi Umum & Visi Misi', ikon: 'menu_book' },
  { id: 'struktur', label: '3. Struktur Pimpinan', ikon: 'account_tree' },
  { id: 'sarana', label: '4. Sarana & Adiwiyata', ikon: 'eco' },
]

export const BATAS_SAMBUTAN = 600
