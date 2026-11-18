// Data dummy Admin Dashboard telah dikosongkan. Data diambil langsung dari API database.
export const statusPortal = ''

export function hitungRingkasanBerita(daftar = []) {
  return { total: daftar.length }
}

export const ringkasanLain = {
  kunjungan: { total: 0, perubahan: '0%', pembanding: '' },
  agenda: { total: 0, pekanIni: 0, darurat: 0 },
  pesan: { belumDibalas: 0, totalDiterima: 0 },
}

export const rentangGrafik = []

export const agendaTerdekat = []

export const pesanTerbaru = []

export const aktivitasTerkini = []
