import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'

// Data agenda sekolah
const agendaSekolah = [
  {
    id: 1,
    tanggal: '18',
    bulan: 'MEI 2026',
    hari: 'Senin',
    kategori: 'Komite & Kurikulum',
    judul: 'Rapat Pleno Komite & Sosialisasi Penguatan Rombel Kurikulum',
    deskripsi:
      'Kegiatan ini membahas koordinasi antara pihak sekolah dan komite serta sosialisasi penguatan pembagian rombongan belajar untuk mendukung proses pembelajaran yang lebih terarah.',
    lokasi: 'Aula Utama SMA Harapan Jaya',
    waktu: '08.00 – 11.30 WIB',
  },
  {
    id: 2,
    tanggal: '24',
    bulan: 'MEI 2026',
    hari: 'Minggu',
    kategori: 'Riset & Karya Ilmiah',
    judul: 'Workshop Penulisan Karya Tulis Ilmiah Remaja (KIR) Nasional',
    deskripsi:
      'Kegiatan ini memberikan pembelajaran dan praktik kepada siswa mengenai cara menyusun karya tulis ilmiah remaja serta mengembangkan kemampuan penelitian dan penulisan ilmiah.',
    lokasi: 'Aula Terpadu SMA Harapan Jaya',
    waktu: '09.00 – 15.30 WIB',
  },
  {
    id: 3,
    tanggal: '02',
    bulan: 'JUN 2026',
    hari: 'Selasa',
    kategori: 'Gelora Karya P5',
    judul: 'Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5) & Bazar',
    deskripsi:
      'Kegiatan ini menampilkan hasil projek siswa dalam penerapan nilai-nilai Profil Pelajar Pancasila serta kegiatan bazar sebagai wadah kreativitas dan kewirausahaan siswa.',
    lokasi: 'Lapangan Kampus Hijau',
    waktu: '08.00 – 14.00 WIB',
  },
  {
    id: 4,
    tanggal: '08',
    bulan: 'JUN 2026',
    hari: 'Senin',
    kategori: 'PPDB & Kesiswaan',
    judul: 'Pembukaan Pendaftaran Peserta Didik Baru Tahun Ajaran 2026/2027',
    deskripsi:
      'Kegiatan ini menandai dimulainya proses penerimaan peserta didik baru yang meliputi pendaftaran, pengumpulan persyaratan, dan informasi tahapan seleksi bagi calon siswa.',
    lokasi: 'Ruang PPDB SMA Harapan Jaya',
    waktu: '08.00 – 14.00 WIB',
  },
  {
    id: 5,
    tanggal: '15',
    bulan: 'JUN 2026',
    hari: 'Senin',
    kategori: 'Akademik & Evaluasi',
    judul: 'Pelaksanaan Penilaian Akhir Semester dan Evaluasi Hasil Belajar',
    deskripsi:
      'Kegiatan ini merupakan bagian dari evaluasi pembelajaran untuk mengetahui pencapaian kompetensi siswa selama proses belajar dan menjadi bahan evaluasi akademik sekolah.',
    lokasi: 'Ruang Kelas SMA Harapan Jaya',
    waktu: '07.30 – 12.00 WIB',
  },
  {
    id: 6,
    tanggal: '20',
    bulan: 'JUN 2026',
    hari: 'Sabtu',
    kategori: 'Kesiswaan & Ekstrakurikuler',
    judul: 'Pekan Kreativitas Siswa dan Gelar Ekstrakurikuler Sekolah',
    deskripsi:
      'Kegiatan ini menjadi wadah bagi siswa untuk menampilkan kreativitas, kemampuan, dan hasil kegiatan ekstrakurikuler melalui berbagai pertunjukan serta pameran karya siswa.',
    lokasi: 'Lapangan Kampus Hijau',
    waktu: '08.00 – 13.00 WIB',
  },
]

function JudulBagian({ label, judul, deskripsi }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">
        {label}
      </p>

      <h2 className="mt-2 font-headline-md text-headline-md font-bold text-primary">
        {judul}
      </h2>

      {deskripsi && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
          {deskripsi}
        </p>
      )}
    </div>
  )
}

function KartuAgenda({ agenda }) {
  return (
    <article className="group rounded-xl border border-border-muted bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-[62px] w-[62px] shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-white">
          <span className="text-2xl font-bold leading-none">
            {agenda.tanggal}
          </span>

          <span className="mt-1 text-[9px] font-semibold tracking-wide">
            {agenda.bulan}
          </span>
        </div>

        <div className="min-w-0 pt-1">
          <span className="inline-block rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-semibold text-secondary">
            {agenda.kategori}
          </span>

          <p className="mt-1 text-[11px] text-text-muted">
            {agenda.hari}
          </p>
        </div>
      </div>

      <h3 className="mt-4 text-sm font-bold leading-5 text-primary transition-colors group-hover:text-secondary">
        {agenda.judul}
      </h3>

      {/* Penjelasan Agenda */}
      <p className="mt-3 text-xs leading-5 text-text-muted">
        {agenda.deskripsi}
      </p>

      <div className="mt-3 space-y-2 border-t border-border-muted pt-3 text-xs text-text-muted">
        <p className="flex items-start gap-2">
          <Icon
            name="location_on"
            className="shrink-0 text-[16px] text-secondary"
          />
          <span>{agenda.lokasi}</span>
        </p>

        <p className="flex items-center gap-2">
          <Icon
            name="schedule"
            className="shrink-0 text-[16px] text-secondary"
          />
          <span>{agenda.waktu}</span>
        </p>
      </div>

      <Link
        to={`/agenda/${agenda.id}`}
        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-primary"
      >
        Rincian Agenda
        <Icon name="arrow_forward" className="text-[15px]" />
      </Link>
    </article>
  )
}

export default function AgendaPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      {/* HERO AGENDA */}
      <section className="border-b border-border-muted bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs text-text-muted"
          >
            <Link to="/" className="hover:text-secondary">
              Beranda
            </Link>

            <Icon name="chevron_right" className="text-[15px]" />

            <span>Agenda Sekolah</span>
          </nav>

          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-secondary">
              <Icon name="auto_awesome" className="text-[15px]" />
              Informasi Kegiatan Sekolah
            </span>

            <h1 className="mt-4 font-headline-lg text-headline-lg font-bold leading-tight text-primary">
              Agenda Sekolah
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-text-muted sm:text-base">
              Informasi jadwal kegiatan akademik dan kegiatan sekolah
              SMA Harapan Jaya.
            </p>
          </div>
        </div>
      </section>

      {/* DAFTAR AGENDA SEKOLAH */}
      <section
        id="agenda-section"
        className="scroll-mt-24 border-b border-border-muted bg-surface-light"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:px-8">
          <JudulBagian
            label="Jadwal Terjadwal"
            judul="Agenda Akademik Mendatang"
            deskripsi="Informasi kegiatan sekolah yang dapat menjadi panduan bagi siswa, orang tua, dan warga sekolah."
          />

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agendaSekolah.map((agenda) => (
              <KartuAgenda key={agenda.id} agenda={agenda} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}