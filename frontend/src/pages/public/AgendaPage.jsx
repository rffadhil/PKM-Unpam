
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

      <h2 className="mt-2 text-[24px] font-bold leading-[30px] text-primary">
        {judul}
      </h2>

      {deskripsi && (
        <p className="mt-2 max-w-2xl text-[14px] leading-6 text-text-muted">
          {deskripsi}
        </p>
      )}
    </div>
  )
}

function KartuAgenda({ agenda }) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-border-muted bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-5">
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
          <span className="inline-block rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-semibold leading-[14px] text-secondary">
            {agenda.kategori}
          </span>

          <p className="mt-1 text-[11px] leading-4 text-text-muted">
            {agenda.hari}
          </p>
        </div>
      </div>

      <h3 className="mt-4 min-h-[40px] line-clamp-2 text-[14px] font-bold leading-5 text-primary transition-colors group-hover:text-secondary">
        {agenda.judul}
      </h3>

      <p className="mt-3 min-h-[72px] line-clamp-4 text-[12px] leading-[18px] text-text-muted">
        {agenda.deskripsi}
      </p>

      <div className="mt-3 space-y-2 border-t border-border-muted pt-3 text-[12px] leading-[18px] text-text-muted">
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
    </article>
  )
}

// Pengaturan tampilan tombol pagination
function paginationButton(disabled, active = false) {
  return {
    minWidth: '30px',
    minHeight: '30px',
    padding: '0 8px',
    border: active ? '1px solid #043927' : '1px solid #dfe6e0',
    borderRadius: '5px',
    background: active ? '#043927' : '#ffffff',
    color: active ? '#ffffff' : '#444C38',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    fontSize: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    fontFamily: 'inherit',
  }
}

export default function AgendaPage() {
  const [halaman, setHalaman] = useState(1)

  const jumlahPerHalaman = 10

  // Mengikuti pengaturan minimal 5 halaman seperti halaman Berita
  const totalHalaman = Math.max(
    5,
    Math.ceil(agendaSekolah.length / jumlahPerHalaman)
  )

  const halamanAktif = Math.min(
    Math.max(1, halaman),
    totalHalaman
  )

  useEffect(() => {
    if (halaman !== halamanAktif) {
      setHalaman(halamanAktif)
    }
  }, [halaman, halamanAktif])

  // Mengambil agenda sesuai halaman aktif
  const agendaHalaman = useMemo(() => {
    const awal = (halamanAktif - 1) * jumlahPerHalaman

    return agendaSekolah.slice(
      awal,
      awal + jumlahPerHalaman
    )
  }, [halamanAktif])

  const awalAgenda =
    agendaSekolah.length === 0
      ? 0
      : (halamanAktif - 1) * jumlahPerHalaman + 1

  const akhirAgenda = Math.min(
    halamanAktif * jumlahPerHalaman,
    agendaSekolah.length
  )

  const ubahHalaman = (nomor) => {
    setHalaman(
      Math.max(1, Math.min(totalHalaman, nomor))
    )
  }

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
            className="mb-6 flex items-center gap-2 text-[12px] text-text-muted"
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

            <h1 className="mt-4 text-[34px] font-bold leading-[40px] text-primary">
              Agenda Sekolah
            </h1>

            <p className="mt-3 max-w-xl text-[14px] leading-6 text-text-muted">
              Jadwal rangkaian agenda akademik, pembinaan karakter, dan rekaman visual dinamika prestasi SMA Harapan Jaya.
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
          />

          {/* JUDUL KUMPULAN AGENDA */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '28px',
              marginBottom: '17px',
            }}
          >
            <h2
              style={{
                margin: 0,
                paddingLeft: '12px',
                borderLeft: '5px solid #708238',
                color: '#043927',
                fontSize: '17px',
                fontWeight: 600,
              }}
            >
              Kumpulan Agenda Sekolah
            </h2>

            <span
              style={{
                color: '#444C38',
                fontSize: '10px',
              }}
            >
              Menampilkan {awalAgenda}–{akhirAgenda} dari{' '}
              {agendaSekolah.length} agenda
            </span>
          </div>

          {/* KARTU AGENDA */}
          {agendaSekolah.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {agendaHalaman.map((agenda) => (
                <KartuAgenda
                  key={agenda.id}
                  agenda={agenda}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '35px 20px',
                border: '1px solid #e0e8e1',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#7d8981',
                textAlign: 'center',
                fontSize: '13px',
              }}
            >
              Belum ada agenda sekolah yang tersedia.
            </div>
          )}

          {/* PAGINATION */}
          <div
            style={{
              marginTop: '25px',
              padding: '12px',
              background: '#ffffff',
              border: '1px solid #e0e8e1',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <span
              style={{
                color: '#444C38',
                fontSize: '10px',
              }}
            >
              Halaman {halamanAktif} dari {totalHalaman} (
              {agendaSekolah.length} agenda)
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '5px',
              }}
            >
              <button
                type="button"
                disabled={halamanAktif === 1}
                onClick={() =>
                  ubahHalaman(halamanAktif - 1)
                }
                style={paginationButton(
                  halamanAktif === 1
                )}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft size={14} />
                <span>Sebelumnya</span>
              </button>

              {Array.from(
                { length: totalHalaman },
                (_, index) => index + 1
              ).map((nomor) => (
                <button
                  key={nomor}
                  type="button"
                  onClick={() => ubahHalaman(nomor)}
                  style={paginationButton(
                    false,
                    halamanAktif === nomor
                  )}
                  aria-label={`Halaman ${nomor}`}
                  aria-current={
                    halamanAktif === nomor
                      ? 'page'
                      : undefined
                  }
                >
                  {nomor}
                </button>
              ))}

              <button
                type="button"
                disabled={halamanAktif === totalHalaman}
                onClick={() =>
                  ubahHalaman(halamanAktif + 1)
                }
                style={paginationButton(
                  halamanAktif === totalHalaman
                )}
                aria-label="Halaman selanjutnya"
              >
                <span>Selanjutnya</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
