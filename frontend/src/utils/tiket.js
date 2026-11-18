import { KATEGORI_TIKET } from '@/config/pesanAdmin'

const ZONA = 'Asia/Jakarta'

// Menyamakan kategori lama/alias dengan kategori terbaru.
const PEMETAAN_KATEGORI = {
  // Tata Usaha & Akademik
  'tu-akademik': 'Tata Usaha & Akademik',
  akademik: 'Tata Usaha & Akademik',
  'tata usaha dan akademik': 'Tata Usaha & Akademik',

  // PPDB/SPMB
  ppdb: 'PPDB/SPMB',
  'ppdb / spmb': 'PPDB/SPMB',

  // Humas dan Kemitraan
  humas: 'Humas dan Kemitraan',
  'humas & kemitraan': 'Humas dan Kemitraan',

  // Permohonan Dokumen
  'tu-legalisir': 'Permohonan Dokumen',
  dokumen: 'Permohonan Dokumen',
  'tata usaha & legalisir': 'Permohonan Dokumen',

  // Aspirasi dan Pengaduan
  wbs: 'Aspirasi dan Pengaduan',
  pengaduan: 'Aspirasi dan Pengaduan',
  'aspirasi & pengaduan': 'Aspirasi dan Pengaduan',

  // Lainnya
  lainnya: 'Lainnya',
}

// Menyamakan kategori dari API/database ke kunci kategori resmi.
export function normalisasiKategori(kategori) {
  const nilai = String(kategori ?? '').trim()

  if (!nilai) return ''

  const rendah = nilai.toLowerCase()

  const kategoriResmi = KATEGORI_TIKET.find(
    (item) =>
      item.kunci.toLowerCase() === rendah ||
      item.label.toLowerCase() === rendah,
  )

  if (kategoriResmi) {
    return kategoriResmi.kunci
  }

  const dipetakan = PEMETAAN_KATEGORI[rendah] ?? nilai

  const cocokConfig = KATEGORI_TIKET.find(
    (item) =>
      item.kunci.toLowerCase() === dipetakan.toLowerCase() ||
      item.label.toLowerCase() === dipetakan.toLowerCase(),
  )

  return cocokConfig?.kunci ?? dipetakan
}

// Memetakan pesan dari API.
export function mapPesanDariApi(pesan) {
  return {
    ...pesan,

    kategori: normalisasiKategori(
      pesan.kategori_layanan ?? pesan.kategori ?? '',
    ),

    dibaca: pesan.dibaca === true,

    status: pesan.status ?? 'Belum Dibalas',

    catatan: pesan.catatan_admin ?? pesan.catatan ?? '',

    diterima:
      pesan.diterima ??
      pesan.created_at ??
      pesan.createdAt ??
      pesan.tanggal_masuk ??
      pesan.tanggal_dibuat ??
      null,
  }
}

// Mengambil konfigurasi kategori.
export function cariKategori(kunci) {
  const kategoriNormal = normalisasiKategori(kunci)

  return (
    KATEGORI_TIKET.find(
      (item) => item.kunci === kategoriNormal,
    ) ??
    KATEGORI_TIKET.find(
      (item) => item.kunci === 'Lainnya',
    ) ??
    KATEGORI_TIKET[0]
  )
}

// Tanggal "YYYY-MM-DD" menurut WIB, untuk membandingkan hari.
export function kunciTanggal(tanggal) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA,
  }).format(tanggal)
}

// ISO -> { tanggal: 'Hari ini' | 'Kemarin' | '23 Feb 2026', jam: '10:14 WIB' }
export function formatWaktuMasuk(
  iso,
  sekarang = new Date(),
) {
  const d = new Date(iso)

  if (Number.isNaN(d.getTime())) {
    return {
      tanggal: '-',
      jam: '',
    }
  }

  const bagian = Object.fromEntries(
    new Intl.DateTimeFormat('id-ID', {
      timeZone: ZONA,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(d)
      .map((p) => [p.type, p.value]),
  )

  const kunci = kunciTanggal(d)

  const kemarin = new Date(
    sekarang.getTime() - 24 * 60 * 60 * 1000,
  )

  let tanggal = `${bagian.day} ${bagian.month} ${bagian.year}`

  if (kunci === kunciTanggal(sekarang)) {
    tanggal = 'Hari ini'
  } else if (kunci === kunciTanggal(kemarin)) {
    tanggal = 'Kemarin'
  }

  return {
    tanggal,
    jam: `${bagian.hour}:${bagian.minute} WIB`,
  }
}

// Filter tiket berdasarkan:
// - kategori
// - status
// - rentang tanggal
// - pencarian
export function saringTiket(
  data,
  {
    kata = '',
    kategori = '',
    status = '',
    dari = '',
    sampai = '',
  } = {},
) {
  const k = kata.trim().toLowerCase()
  const kategoriTarget = normalisasiKategori(kategori)

  return data.filter((t) => {
    // Filter kategori secara konsisten.
    if (
      kategoriTarget &&
      normalisasiKategori(t.kategori) !== kategoriTarget
    ) {
      return false
    }

    // Filter status.
    if (status && t.status !== status) {
      return false
    }

    // Filter rentang tanggal.
    if (t.diterima) {
      const tanggalPesan = new Date(t.diterima)

      if (!Number.isNaN(tanggalPesan.getTime())) {
        const hari = kunciTanggal(tanggalPesan)

        if (dari && hari < dari) {
          return false
        }

        if (sampai && hari > sampai) {
          return false
        }
      }
    }

    // Filter pencarian.
    if (!k) return true

    return [
      t.nama,
      t.email,
      t.subjek,
      t.pesan,
      t.instansi,
    ].some((x) =>
      String(x ?? '')
        .toLowerCase()
        .includes(k),
    )
  })
}

// Terbaru di atas.
export function urutkanTiket(data) {
  return [...data].sort(
    (a, b) =>
      new Date(b.diterima) - new Date(a.diterima),
  )
}

// "0812-9981-2231" -> "https://wa.me/6281299812231"
export function linkWhatsApp(telepon = '') {
  const angka = telepon.replace(/\D/g, '')

  if (!angka) return ''

  return `https://wa.me/${
    angka.startsWith('0')
      ? `62${angka.slice(1)}`
      : angka
  }`
}

export function linkEmail(tiket) {
  return `mailto:${tiket.email}?subject=${encodeURIComponent(
    `Re: ${tiket.subjek}`,
  )}`
}

function urlValid(teks) {
  try {
    const u = new URL(teks)

    return (
      u.protocol === 'http:' ||
      u.protocol === 'https:'
    )
  } catch {
    return false
  }
}

export { urlValid }

export function validasiKontak(f) {
  const e = {}

  if (!f.whatsapp.trim()) {
    e.whatsapp = 'Nomor WhatsApp wajib diisi.'
  }

  if (!f.telepon.trim()) {
    e.telepon = 'Nomor telepon kantor wajib diisi.'
  }

  if (!f.jamSenKam.trim()) {
    e.jamSenKam = 'Jam operasional wajib diisi.'
  }

  if (!f.jamJumat.trim()) {
    e.jamJumat = 'Jam operasional wajib diisi.'
  }

  if (!f.alamat.trim()) {
    e.alamat = 'Alamat kampus wajib diisi.'
  }

  if (
    f.peta.trim() &&
    !urlValid(f.peta.trim())
  ) {
    e.peta =
      'Tautan harus diawali http:// atau https://.'
  }

  return e
}