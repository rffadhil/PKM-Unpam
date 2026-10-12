// Pilihan & tampilan untuk modul Pesan Masuk & Kontak (PTSP).
// Class Tailwind ditulis utuh agar terbaca saat build.
export const KATEGORI_PESAN = [
  { kunci: 'legalisir', label: 'Tata Usaha & Legalisir', prefix: 'PTSP', ikon: 'description', chip: 'bg-surface-container text-primary border-border-muted', template: 'sop-legalisir' },
  { kunci: 'akademik', label: 'Tata Usaha & Akademik', prefix: 'PTSP', ikon: 'article', chip: 'bg-surface-container text-primary border-border-muted', template: 'info-umum' },
  { kunci: 'ppdb', label: 'Posko PPDB 2026/2027', prefix: 'PPDB', ikon: 'school', chip: 'bg-amber-50 text-amber-800 border-amber-200', template: 'ppdb-prestasi' },
  { kunci: 'wbs', label: 'Layanan Aspirasi & WBS', prefix: 'WBS', ikon: 'gavel', chip: 'bg-blue-50 text-blue-800 border-blue-200', template: 'tindak-lanjut' },
  { kunci: 'humas', label: 'Humas & Kemitraan Pers', prefix: 'HMS', ikon: 'campaign', chip: 'bg-purple-50 text-purple-800 border-purple-200', template: 'kemitraan-media' },
]
export const KATEGORI_MAP = Object.fromEntries(KATEGORI_PESAN.map((k) => [k.kunci, k]))

export const STATUS_PESAN = {
  belum: { label: 'Belum Dibalas', badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  diproses: { label: 'Sedang Diproses', badge: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  selesai: { label: 'Selesai', badge: 'bg-secondary-container/70 text-secondary-dark', dot: 'bg-secondary' },
}

// Draf template resmi TU. {nama} diganti nama pengirim.
export const TEMPLATE_RESPON = [
  { id: 'sop-legalisir', label: 'SOP Legalisir Ijazah & Dokumen PTSP Daring', teks: 'Yth. Sdr. {nama},\n\nTerima kasih telah menghubungi PTSP SMA Harapan Jaya. Untuk legalisir ijazah, silakan mengunggah scan ijazah asli dan KTP pemohon melalui portal PTSP daring. Legalisir elektronik akan kami kirimkan ke email Anda dalam 2 hari kerja.\n\nHormat kami,\nTata Usaha SMA Harapan Jaya' },
  { id: 'ppdb-prestasi', label: 'Panduan Berkas PPDB Jalur Prestasi', teks: 'Yth. Sdr. {nama},\n\nTerima kasih atas pertanyaan Anda mengenai PPDB 2026/2027. Sertifikat prestasi diunggah dalam format PDF atau JPG (maksimal 2 MB) pada menu Unggah Berkas di akun pendaftaran. Verifikasi dilakukan panitia dalam 3 hari kerja.\n\nHormat kami,\nPanitia PPDB SMA Harapan Jaya' },
  { id: 'tindak-lanjut', label: 'Tindak Lanjut Aspirasi / Laporan WBS', teks: 'Yth. {nama},\n\nLaporan Anda telah kami terima melalui kanal terenkripsi dan sedang diverifikasi oleh tim terkait. Identitas Anda tetap dirahasiakan. Perkembangan akan kami sampaikan melalui kanal ini.\n\nHormat kami,\nTim Layanan Aspirasi SMA Harapan Jaya' },
  { id: 'kemitraan-media', label: 'Tanggapan Peliputan & Kemitraan Media', teks: 'Yth. Sdr. {nama},\n\nTerima kasih atas minat peliputan di SMA Harapan Jaya. Mohon mengirimkan surat permohonan resmi beserta rencana kegiatan ke Humas agar dapat kami jadwalkan.\n\nHormat kami,\nHumas SMA Harapan Jaya' },
  { id: 'info-umum', label: 'Tanggapan Informasi Umum', teks: 'Yth. Sdr. {nama},\n\nTerima kasih telah menghubungi SMA Harapan Jaya. Permintaan Anda telah kami proses oleh Tata Usaha dan akan kami tindak lanjuti sesuai prosedur layanan.\n\nHormat kami,\nTata Usaha SMA Harapan Jaya' },
]

export const KANAL = {
  surel: { label: 'Surel Resmi Sekolah', detail: 'ptsp@smaharapanjaya.sch.id' },
  wa: { label: 'Notifikasi Otomatis WhatsApp Gateway', detail: '+62 811-3456-7890' },
}
