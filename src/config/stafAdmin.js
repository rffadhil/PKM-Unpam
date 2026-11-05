// Konstanta halaman Profil & Staf (admin).
export const STAF_PER_HALAMAN = 5
export const BATAS_FOTO_MB = 2
export const BATAS_SAMBUTAN = 600
export const BATAS_VISI = 300

export const FILTER_STAF_AWAL = { kata: '', rumpun: '', status: '' }

export const RUMPUN_PTK = [
  'Pimpinan Sekolah',
  'Wakil Kepala Sekolah',
  'Guru Mata Pelajaran',
  'Pembina Ekstrakurikuler',
  'Tenaga Kependidikan',
]

// `nilai` dipakai untuk menyaring, `label` untuk tampilan.
export const STATUS_PEGAWAI = [
  { nilai: 'PNS', label: 'PNS' },
  { nilai: 'PPPK', label: 'PPPK' },
  { nilai: 'GTY', label: 'GTY (Guru Tetap Yayasan)' },
  { nilai: 'GTT', label: 'GTT (Guru Tidak Tetap)' },
  { nilai: 'Honorer', label: 'Honorer' },
]

export const TIPE_NOMOR = ['NIP', 'NUPTK']

// Warna lencana jabatan. Dipilih otomatis dari rumpun, bisa ditimpa per orang di data.
export const JABATAN_TONE = {
  primary: 'bg-primary text-white',
  hijau: 'bg-secondary text-white',
  zaitun: 'bg-tertiary-container text-tertiary-fixed',
  biru: 'bg-blue-100 text-blue-900',
  abu: 'bg-slate-200 text-primary',
}

export const TONE_RUMPUN = {
  'Pimpinan Sekolah': 'primary',
  'Wakil Kepala Sekolah': 'hijau',
  'Guru Mata Pelajaran': 'abu',
  'Pembina Ekstrakurikuler': 'zaitun',
  'Tenaga Kependidikan': 'biru',
}

export const JABATAN_KEPALA = 'Kepala Sekolah'

export const GAYA_INPUT =
  'block w-full rounded-xl border border-border-muted bg-surface-white px-3.5 py-2.5 text-sm text-on-surface placeholder:text-text-muted/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20'
