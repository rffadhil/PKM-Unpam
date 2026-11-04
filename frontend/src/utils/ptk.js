import { BATAS_FOTO_MB, RUMPUN_PTK, TONE_RUMPUN } from '@/config/stafAdmin'

export function labelNomor(p) {
  const nomor = p.nomor ?? p.nip_nuptk

  if (!nomor) return 'NIP/NUPTK: -'

  return `${p.tipeNomor ?? 'NIP/NUPTK'}: ${nomor}`
}

// "Drs. H. Bambang Sudirman, M.Pd" -> "BS" (gelar dilewati)
export function inisialPtk(nama = '') {
  const kata = nama.split(/\s+/).filter((k) => k && !/[.,]$/.test(k) && !/^[A-Z][a-z]?\./.test(k))
  const sumber = kata.length ? kata : nama.split(/\s+/)
  return sumber.slice(0, 2).map((k) => k[0]?.toUpperCase() ?? '').join('') || '?'
}

export function saringPtk(data, { kata = '', rumpun = '', status = '' } = {}) {
  const k = kata.trim().toLowerCase()

  return data.filter((p) => {
    const rumpunData = (p.rumpun ?? '').trim().toLowerCase()
    const rumpunFilter = rumpun.trim().toLowerCase()

    const statusData = (p.statusKepegawaian ?? '').trim().toLowerCase()
    const statusFilter = status.trim().toLowerCase()

    if (rumpunFilter && rumpunData !== rumpunFilter) return false
    if (statusFilter && statusData !== statusFilter) return false

    if (!k) return true

    return [
      p.nama,
      p.nomor,
      p.jabatan,
      p.bidang,
    ].some((t) => (t ?? '').toLowerCase().includes(k))
  })
}

// "Struktur Tertinggi & NIP": urutan kecil dulu, lalu nomor.
export function urutkanPtk(data) {
  return [...data].sort((a, b) => a.urutan - b.urutan || a.nomor.localeCompare(b.nomor))
}

export function ptkKosong() {
  return {
    id: null,
    nama: '',
    tipeNomor: 'NIP',
    nomor: '',
    rumpun: RUMPUN_PTK[2],
    jabatan: '',
    tone: TONE_RUMPUN[RUMPUN_PTK[2]],
    bidang: '',
    pendidikan: '',
    kampus: '',
    kepegawaian: '',
    statusKepegawaian: 'PNS',
    urutan: 99,
    tampil: true,
    foto: '',
  }
}

export function validasiPtk(f) {
  const e = {}
  if (!f.nama.trim()) e.nama = 'Nama lengkap wajib diisi.'
  if (!f.nomor.trim()) e.nomor = `${f.tipeNomor} wajib diisi.`
  else if (!/^[\d\s]+$/.test(f.nomor.trim())) e.nomor = `${f.tipeNomor} hanya boleh berisi angka dan spasi.`
  if (!f.jabatan.trim()) e.jabatan = 'Jabatan wajib diisi.'
  if (!f.kepegawaian.trim()) e.kepegawaian = 'Status kepegawaian wajib diisi.'
  if (!Number.isFinite(Number(f.urutan)) || Number(f.urutan) < 1) e.urutan = 'Urutan minimal 1.'
  return e
}

// Mengembalikan pesan error, atau '' kalau berkas valid.
export function validasiFoto(file) {
  if (!file.type.startsWith('image/')) return 'Berkas harus berupa gambar (JPG, PNG, atau WebP).'
  if (file.size > BATAS_FOTO_MB * 1024 * 1024) return `Ukuran foto maksimal ${BATAS_FOTO_MB} MB.`
  return ''
}
