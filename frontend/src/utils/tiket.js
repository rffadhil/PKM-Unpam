import { KATEGORI_TIKET } from '@/config/pesanAdmin'

const ZONA = 'Asia/Jakarta'

// Mengubah format data pesan dari backend menjadi format frontend.

export function mapPesanDariApi(pesan) {
  return {
    id: pesan.id,
    nama: pesan.nama ?? "",
    email: pesan.email ?? "",
    telepon: pesan.telepon ?? "",
    kategori: pesan.kategori_layanan ?? "",
    subjek: pesan.subjek ?? "",
    pesan: pesan.pesan ?? "",
    status: pesan.status ?? "Belum Dibalas",
    catatan: pesan.catatan_admin ?? "",
    diterima: pesan.created_at,

    // Fitur dibaca dan anonim belum tersedia di API.
    dibaca: true,
    anonim: false,
  };
}

export function cariKategori(kunci) {
  return KATEGORI_TIKET.find((k) => k.kunci === kunci) ?? KATEGORI_TIKET[0]
}

// Tanggal "YYYY-MM-DD" menurut WIB, untuk membandingkan hari.
export function kunciTanggal(tanggal) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA }).format(tanggal)
}

// ISO -> { tanggal: 'Hari ini' | 'Kemarin' | '23 Feb 2026', jam: '10:14 WIB' }
export function formatWaktuMasuk(iso, sekarang = new Date()) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { tanggal: '-', jam: '' }
  const bagian = Object.fromEntries(
    new Intl.DateTimeFormat('id-ID', {
      timeZone: ZONA, day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    })
      .formatToParts(d)
      .map((p) => [p.type, p.value]),
  )
  const kunci = kunciTanggal(d)
  const kemarin = new Date(sekarang.getTime() - 24 * 60 * 60 * 1000)
  let tanggal = `${bagian.day} ${bagian.month} ${bagian.year}`
  if (kunci === kunciTanggal(sekarang)) tanggal = 'Hari ini'
  else if (kunci === kunciTanggal(kemarin)) tanggal = 'Kemarin'
  return { tanggal, jam: `${bagian.hour}:${bagian.minute} WIB` }
}

export function saringTiket(data, { kata = '', kategori = '', dari = '', sampai = '' } = {}) {
  const k = kata.trim().toLowerCase()
  return data.filter((t) => {
    if (kategori && t.kategori !== kategori) return false
    const hari = kunciTanggal(new Date(t.diterima))
    if (dari && hari < dari) return false
    if (sampai && hari > sampai) return false
    if (!k) return true
    return [t.nama, t.email, t.subjek, t.pesan, t.instansi].some((x) => (x ?? '').toLowerCase().includes(k))
  })
}

// Terbaru di atas.
export function urutkanTiket(data) {
  return [...data].sort((a, b) => new Date(b.diterima) - new Date(a.diterima))
}

// "0812-9981-2231" -> "https://wa.me/6281299812231"
export function linkWhatsApp(telepon = '') {
  const angka = telepon.replace(/\D/g, '')
  if (!angka) return ''
  return `https://wa.me/${angka.startsWith('0') ? `62${angka.slice(1)}` : angka}`
}

export function linkEmail(tiket) {
  return `mailto:${tiket.email}?subject=${encodeURIComponent(`Re: ${tiket.subjek}`)}`
}

function urlValid(teks) {
  try {
    const u = new URL(teks)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export { urlValid }

export function validasiKontak(f) {
  const e = {}
  if (!f.whatsapp.trim()) e.whatsapp = 'Nomor WhatsApp wajib diisi.'
  if (!f.telepon.trim()) e.telepon = 'Nomor telepon kantor wajib diisi.'
  if (!f.jamSenKam.trim()) e.jamSenKam = 'Jam operasional wajib diisi.'
  if (!f.jamJumat.trim()) e.jamJumat = 'Jam operasional wajib diisi.'
  if (!f.alamat.trim()) e.alamat = 'Alamat kampus wajib diisi.'
  if (f.peta.trim() && !urlValid(f.peta.trim())) e.peta = 'Tautan harus diawali http:// atau https://.'
  return e
}
