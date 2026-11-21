// Data dummy Dashboard telah dikosongkan. Data diambil langsung dari API database.
export const currentUser = {
  nama: '',
  gelar: '',
  role: '',
  jabatan: '',
  inisial: '',
}

export const dashboardMock = {
  tahunPelajaran: '',
  tanggal: '',
  notifikasi: 0,
  stats: {
    kunjungan: { total: 0, persen: 0 },
    berita: { total: 0, tayang: 0, draf: 0 },
    agenda: { total: 0, pekanIni: 0, darurat: 0 },
    pesan: { belumDibalas: 0, total: 0 },
  },
  trend: {
    labels: [],
    pengunjung: [],
    pembaca: [],
    puncak: { index: 0, teks: '', tanggal: '' },
    ringkasan: {
      rataHarian: '',
      artikelTerbaik: '',
      durasi: '',
    },
  },
  agenda: [],
  pesan: [],
  aktivitas: [],
  sistem: {
    storage: { terpakaiGB: 0, totalGB: 0 },
    database: { persenSehat: 0 },
    status: '',
    info: [],
  },
}
