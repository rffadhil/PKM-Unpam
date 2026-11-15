import { BATAS_ASET_MB } from '@/config/pengaturanAdmin'
import { isDateOnlyValid } from '@/utils/ppdb'

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function adalahSuperAdmin(peran = '') {
  return /super/i.test(peran)
}

export function inisialAdmin(nama = '') {
  const kata = nama.split(/\s+/).filter((k) => k && !/[.,]$/.test(k))
  const sumber = kata.length ? kata : nama.split(/\s+/)
  return sumber.slice(0, 2).map((k) => k[0]?.toUpperCase() ?? '').join('') || '?'
}

export function inisialInstitusi(nama = '') {
  const kata = nama.trim().split(/\s+/).filter(Boolean)
  return kata.slice(-2).map((k) => k[0].toUpperCase()).join('') || '?'
}

// Apakah dua objek datar sama isinya.
export function samaIsi(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function validasiPengaturan(f = {}) {
  const e = {}

  if (!f.namaInstitusi?.trim()) {
    e.namaInstitusi = 'Nama institusi wajib diisi.'
  } else if (!/^[a-zA-Z0-9\s.,\-&()]+$/.test(f.namaInstitusi.trim())) {
    e.namaInstitusi = 'Nama institusi tidak boleh mengandung karakter khusus.'
  }

  if (!/^\d{8}$/.test((f.npsn || '').trim())) {
    e.npsn = 'NPSN terdiri dari 8 digit angka.'
  }

  if ((f.slogan || '').length > 120) {
    e.slogan = 'Slogan maksimal 120 karakter.'
  } else if (
    f.slogan?.trim() &&
    !/^[a-zA-Z0-9\s.,!?'"\-()]+$/.test(f.slogan.trim())
  ) {
    e.slogan = 'Slogan tidak boleh mengandung karakter khusus.'
  }

  // Validasi email resmi
  if (!RE_EMAIL.test((f.email || '').trim())) {
    e.email = 'Format email tidak valid.'
  }

  // Validasi nomor telepon kantor
  if (!f.telepon?.trim()) {
    e.telepon = 'Nomor telepon kantor wajib diisi.'
  } else if (!/^[0-9+\s\-()]+$/.test(f.telepon.trim())) {
    e.telepon = 'Format nomor telepon tidak valid.'
  } else if (f.telepon.replace(/\D/g, '').length < 6) {
    e.telepon = 'Nomor telepon minimal terdiri dari 6 digit.'
  }


  if (!f.alamat?.trim()) {
    e.alamat = 'Alamat kampus wajib diisi.'
  } else if (!/^[a-zA-Z0-9\s.,'/\-()#]+$/.test(f.alamat.trim())) {
    e.alamat = 'Alamat tidak boleh mengandung karakter khusus.'
  }

  // Validasi WhatsApp PPDB
  if (!f.whatsapp?.trim()) {
    e.whatsapp = 'Nomor WhatsApp PPDB wajib diisi.'
  } else if (!/^[0-9+\s\-()]+$/.test(f.whatsapp.trim())) {
    e.whatsapp = 'Format nomor WhatsApp tidak valid.'
  } else if (f.whatsapp.replace(/\D/g, '').length < 6) {
    e.whatsapp = 'Nomor WhatsApp minimal terdiri dari 6 digit.'
  }

  // Validasi alamat dan tautan peta
  if (f.peta?.trim() && !/^https?:\/\/\S+$/i.test(f.peta.trim())) {
    e.peta = 'Tautan Google Maps harus berupa URL yang valid.'
  }

  const ppdbTanggalMulai = (f.ppdbTanggalMulai || '').trim()
  const ppdbTanggalSelesai = (f.ppdbTanggalSelesai || '').trim()
  const ppdbTanggalTayang = (f.ppdbTanggalTayang || '').trim()
  if (ppdbTanggalTayang || ppdbTanggalMulai || ppdbTanggalSelesai) {
    if (!f.ppdbTahunAjaran?.trim()) {
      e.ppdbTahunAjaran = 'Tahun ajaran wajib diisi saat periode PPDB diatur.'
    }

    if (!isDateOnlyValid(ppdbTanggalMulai)) {
      e.ppdbTanggalMulai = 'Tanggal mulai PPDB wajib diisi dengan tanggal yang valid.'
    }

    if (!isDateOnlyValid(ppdbTanggalSelesai)) {
      e.ppdbTanggalSelesai = 'Tanggal selesai PPDB wajib diisi dengan tanggal yang valid.'
    } else if (
      isDateOnlyValid(ppdbTanggalMulai) &&
      ppdbTanggalSelesai < ppdbTanggalMulai
    ) {
      e.ppdbTanggalSelesai = 'Tanggal selesai harus sama atau setelah tanggal mulai.'
    }

    if (ppdbTanggalTayang && !isDateOnlyValid(ppdbTanggalTayang)) {
      e.ppdbTanggalTayang = 'Tanggal tayang harus berupa tanggal yang valid.'
    } else if (
      ppdbTanggalTayang &&
      isDateOnlyValid(ppdbTanggalMulai) &&
      ppdbTanggalTayang > ppdbTanggalMulai
    ) {
      e.ppdbTanggalTayang = 'Tanggal tayang harus sama atau sebelum tanggal mulai pendaftaran.'
    }

    if (!f.ppdbPengumuman?.trim()) {
      e.ppdbPengumuman = 'Teks pengumuman wajib diisi saat periode PPDB diatur.'
    } else if (f.ppdbPengumuman.length > 300) {
      e.ppdbPengumuman = 'Teks pengumuman maksimal 300 karakter.'
    }

  }

  // Validasi tiga saluran kontak
  if (Array.isArray(f.saluranKontak)) {
    f.saluranKontak.forEach((item, index) => {
      if (!item.judul?.trim()) {
        e[`saluranKontak.${index}.judul`] = 'Judul saluran wajib diisi.'
      }

      if (!item.deskripsi?.trim()) {
        e[`saluranKontak.${index}.deskripsi`] = 'Deskripsi saluran wajib diisi.'
      }

      if (!item.href?.trim()) {
        e[`saluranKontak.${index}.href`] = 'Tautan tujuan wajib diisi.'
      }
    })
  }

  return e
}

export function validasiAset(file, formatBoleh) {
  const ekstensi = (file.name.split('.').pop() ?? '').toLowerCase()
  if (!formatBoleh.includes(ekstensi)) {
    return `Format tidak didukung. Gunakan ${formatBoleh.join(', ').toUpperCase()}.`
  }
  if (file.size > BATAS_ASET_MB * 1024 * 1024) {
    return `Ukuran berkas maksimal ${BATAS_ASET_MB} MB.`
  }
  return ''
}

export function validasiAdmin(f, { baru }) {
  const e = {}
  if (!f.nama?.trim()) {
    e.nama = 'Nama lengkap wajib diisi.'
  } else if (!/^[a-zA-Z\s.,'-]+$/.test(f.nama.trim())) {
    e.nama = 'Nama lengkap hanya boleh berisi huruf, spasi, titik, koma, strip, dan petik.'
  }

  if (!f.nomor?.trim()) {
    e.nomor = `${f.tipeNomor} wajib diisi.`
  } else if (!/^[\d\s]+$/.test(f.nomor.trim())) {
    e.nomor = `${f.tipeNomor} hanya boleh berisi angka dan spasi.`
  }

  if (!RE_EMAIL.test((f.email || '').trim())) {
    e.email = 'Format email tidak valid.'
  }

  if (baru) {
    const sandi = f.sandi ?? ''
    if (sandi.length < 8) {
      e.sandi = 'Kata sandi sementara minimal 8 karakter.'
    } else if (!/[A-Za-z]/.test(sandi) || !/\d/.test(sandi)) {
      e.sandi = 'Gunakan kombinasi huruf dan angka.'
    }
  }

  return e
}

export function adminKosong() {
  return {
    id: null,
    nama: '',
    tipeNomor: 'NIP',
    nomor: '',
    email: '',
    role: 'subadmin',
    aktif: true,
    foto: '',
    sandi: '',
  }
}