import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { useDaftarAgenda } from '@/hooks/useAgenda'
import { useDaftarGaleri } from '@/hooks/useGaleri'

const agendaSekolahDummy = [
  {
    id: 1,
    tanggal: '18',
    bulan: 'MEI 2026',
    hari: 'Senin',
    kategori: 'Komite & Kurikulum',
    judul: 'Rapat Pleno Komite & Sosialisasi Penguatan Rombel Kurikulum',
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
    lokasi: 'Lapangan Kampus Hijau',
    waktu: '08.00 – 14.00 WIB',
  },
]

const albumSekolah = [
  {
    id: 1,
    judul: 'Panen Raya Hidroponik & Inovasi Biologi Kampus Hijau',
    kategori: 'Adiwiyata',
    jumlahFoto: 18,
    tanggal: '12 Mei 2026',
    gambar:
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    judul: 'Penganugerahan Juara Umum OSN & Festival Sains Pelajar',
    kategori: 'Prestasi',
    jumlahFoto: 24,
    tanggal: '08 Mei 2026',
    gambar:
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    judul: 'Praktikum Kimia Organik & Bioteknologi Terapan Siswa',
    kategori: 'Riset',
    jumlahFoto: 12,
    tanggal: '29 Apr 2026',
    gambar:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 4,
    judul: 'Pertandingan Final Turnamen Futsal & Basket Cup Antar-SMA',
    kategori: 'Olahraga',
    jumlahFoto: 20,
    tanggal: '25 Apr 2026',
    gambar:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 5,
    judul: 'Karnaval Budaya Nusantara & Pagelaran Tari Tradisional',
    kategori: 'Seni & Budaya',
    jumlahFoto: 16,
    tanggal: '18 Apr 2026',
    gambar:
      'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 6,
    judul: 'Latihan Dasar Kepemimpinan Siswa (LDKS) OSIS-MPK',
    kategori: 'Kesiswaan',
    jumlahFoto: 28,
    tanggal: '10 Apr 2026',
    gambar:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 7,
    judul: 'Pelatihan Robotika Otomasi Industri dan IoT',
    kategori: 'Teknologi',
    jumlahFoto: 16,
    tanggal: '02 Apr 2026',
    gambar:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 8,
    judul: 'Peringatan Hari Guru Nasional dan Apresiasi Pendidik',
    kategori: 'Institusi',
    jumlahFoto: 20,
    tanggal: '25 Mar 2026',
    gambar:
      'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 9,
    judul: 'Kegiatan Belajar dan Kolaborasi Siswa',
    kategori: 'Pembelajaran',
    jumlahFoto: 14,
    tanggal: '20 Mar 2026',
    gambar:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 10,
    judul: 'Pameran Karya Kreatif dan Inovasi Siswa',
    kategori: 'Riset',
    jumlahFoto: 22,
    tanggal: '15 Mar 2026',
    gambar:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 11,
    judul: 'Kegiatan Kebersamaan Warga Sekolah',
    kategori: 'Kesiswaan',
    jumlahFoto: 19,
    tanggal: '10 Mar 2026',
    gambar:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 12,
    judul: 'Eksplorasi Lingkungan dan Kepedulian Alam',
    kategori: 'Adiwiyata',
    jumlahFoto: 15,
    tanggal: '05 Mar 2026',
    gambar:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=85',
  },
]

const kategoriAlbum = [
  'Semua Album',
  'Adiwiyata',
  'Prestasi',
  'Riset',
  'Olahraga',
  'Seni & Budaya',
  'Kesiswaan',
  'Teknologi',
  'Institusi',
  'Pembelajaran',
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
    <article className="group rounded-xl border border-border-muted bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
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
          <p className="mt-1 text-[11px] text-text-muted">{agenda.hari}</p>
        </div>
      </div>

      <h3 className="mt-4 min-h-[60px] text-sm font-bold leading-5 text-primary transition-colors group-hover:text-secondary">
        {agenda.judul}
      </h3>

      <div className="mt-3 space-y-2 border-t border-border-muted pt-3 text-xs text-text-muted">
        <p className="flex items-start gap-2">
          <Icon name="location_on" className="shrink-0 text-[16px] text-secondary" />
          <span>{agenda.lokasi}</span>
        </p>
        <p className="flex items-center gap-2">
          <Icon name="schedule" className="shrink-0 text-[16px] text-secondary" />
          <span>{agenda.waktu}</span>
        </p>
      </div>

      <Link
        to="/agenda"
        className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-primary"
      >
        Rincian Agenda
        <Icon name="arrow_forward" className="text-[15px]" />
      </Link>
    </article>
  )
}

function KartuAlbum({ album }) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-xl border border-border-muted bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
        <img
          src={album.gambar}
          alt={album.judul}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-md bg-primary/90 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
          {album.jumlahFoto} Foto
        </span>

        <span className="absolute bottom-3 left-3 rounded-full bg-cta-gold px-2.5 py-1 text-[10px] font-bold text-primary">
          {album.kategori}
        </span>
      </div>

      <div className="p-3.5">
        <h3 className="line-clamp-2 min-h-[42px] text-sm font-bold leading-5 text-primary transition-colors group-hover:text-secondary">
          {album.judul}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border-muted pt-3 text-[10px] text-text-muted">
          <span className="flex min-w-0 items-center gap-1">
            <Icon name="photo_camera" className="shrink-0 text-[14px] text-secondary" />
            <span className="truncate">{album.kategori}</span>
          </span>
          <span className="shrink-0">{album.tanggal}</span>
        </div>
      </div>
    </article>
  )
}

export default function GaleriPage() {
  const { data: dataAgenda = [], isLoading: memuatAgenda } = useDaftarAgenda()
  const { data: dataGaleri = [] } = useDaftarGaleri({ status: 'tayang' })
  const [kategoriAktif, setKategoriAktif] = useState('Semua Album')
  const [kataKunci, setKataKunci] = useState('')
  const [jumlahTampil, setJumlahTampil] = useState(8)

  const agendaSekolah = useMemo(() => {
    const list = dataAgenda && dataAgenda.length > 0 ? dataAgenda : agendaSekolahDummy
    return list
      .filter((a) => a && a.status !== 'selesai')
      .slice(0, 6)
      .map((a) => {
        const t = a.tanggalMulai || a.tanggal_mulai || ''
        const [thn, bln, tgl] = String(t).slice(0, 10).split('-').map(Number)
        const d = thn && bln && tgl ? new Date(thn, bln - 1, tgl) : null
        const namaHari = d ? d.toLocaleDateString('id-ID', { weekday: 'long' }) : a.hari || 'Kegiatan'
        const namaBulan = d
          ? d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }).toUpperCase()
          : a.bulan || ''

        return {
          id: a.id,
          tanggal: tgl ? String(tgl).padStart(2, '0') : a.tanggal || '--',
          bulan: namaBulan,
          hari: namaHari,
          kategori: a.kategori || 'Agenda Sekolah',
          judul: a.judul,
          lokasi: a.lokasi || 'SMA Harapan Jaya',
          waktu: a.waktu || 'Waktu Terjadwal',
        }
      })
  }, [dataAgenda])

  const albumTerfilter = useMemo(() => {
    const kata = kataKunci.trim().toLowerCase()
    const list = dataGaleri && dataGaleri.length > 0 ? dataGaleri : albumSekolah

    return list.filter((album) => {
      const sesuaiKategori =
        kategoriAktif === 'Semua Album' ||
        String(album.kategori || '').toLowerCase() === String(kategoriAktif).toLowerCase()

      const sesuaiKata =
        !kata ||
        album.judul?.toLowerCase().includes(kata) ||
        album.kategori?.toLowerCase().includes(kata) ||
        album.deskripsi?.toLowerCase().includes(kata)

      return sesuaiKategori && sesuaiKata
    })
  }, [dataGaleri, kategoriAktif, kataKunci])

  const albumTampil = albumTerfilter.slice(0, jumlahTampil)

  function ubahKategori(kategori) {
    setKategoriAktif(kategori)
    setJumlahTampil(8)
  }

  function ubahPencarian(event) {
    setKataKunci(event.target.value)
    setJumlahTampil(8)
  }

  return (
    <>
      {/* Hero halaman */}
      <section className="border-b border-border-muted bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-text-muted">
            <Link to="/" className="hover:text-secondary">
              Beranda
            </Link>
            <Icon name="chevron_right" className="text-[15px]" />
            <span>Agenda & Dokumentasi Galeri</span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-secondary">
                <Icon name="auto_awesome" className="text-[15px]" />
                Aktivitas & Menciptakan Masa Depan
              </span>

              <h1 className="mt-4 font-headline-lg text-headline-lg font-bold leading-tight text-primary">
                Agenda Sekolah & Galeri Dokumentasi
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-text-muted sm:text-base">
                Jadwal rangkaian agenda akademik, pembinaan karakter, dan
                rekaman visual dinamika prestasi SMA Harapan Jaya.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <a
                href="#galeri-section"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-secondary"
              >
                <Icon name="photo_library" className="text-[17px]" />
                Galeri Foto Kegiatan
              </a>
              <a
                href="#agenda-section"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-muted bg-white px-4 py-3 text-xs font-bold text-primary transition-colors hover:border-secondary hover:text-secondary"
              >
                <Icon name="calendar_month" className="text-[17px]" />
                Kalender Agenda
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Agenda sekolah */}
      <section
        id="agenda-section"
        className="scroll-mt-24 border-b border-border-muted bg-surface-light"
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <JudulBagian
              label="Jadwal Terjadwal"
              judul="Agenda Akademik Mendatang"
              deskripsi="Informasi kegiatan sekolah yang dapat menjadi panduan bagi siswa, orang tua, dan warga sekolah."
            />

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-secondary px-3.5 py-2.5 text-xs font-semibold text-secondary transition-colors hover:bg-secondary/10 sm:self-auto"
            >
              <Icon name="download" className="text-[16px]" />
              Cetak Agenda
            </button>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agendaSekolah.map((agenda) => (
              <KartuAgenda key={agenda.id} agenda={agenda} />
            ))}
          </div>
        </div>
      </section>

      {/* Galeri foto */}
      <section
        id="galeri-section"
        className="scroll-mt-24 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-14 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <JudulBagian
              label="Arsip Visual & Aktivitas Siswa"
              judul="Galeri Foto Interaktif"
              deskripsi="Jelajahi momen pembelajaran, prestasi, kreativitas, dan kebersamaan keluarga besar SMA Harapan Jaya."
            />

            <label className="relative block w-full lg:max-w-xs">
              <span className="sr-only">Cari album foto</span>
              <Icon
                name="search"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-text-muted"
              />
              <input
                type="search"
                value={kataKunci}
                onChange={ubahPencarian}
                placeholder="Cari kegiatan atau kategori..."
                className="w-full rounded-lg border border-border-muted bg-white py-3 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              />
            </label>
          </div>

          {/* Filter kategori */}
          <div className="custom-scrollbar mt-7 flex gap-2 overflow-x-auto pb-3">
            {kategoriAlbum.map((kategori) => {
              const aktif = kategoriAktif === kategori

              return (
                <button
                  key={kategori}
                  type="button"
                  onClick={() => ubahKategori(kategori)}
                  aria-pressed={aktif}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    aktif
                      ? 'border-primary bg-primary text-white'
                      : 'border-border-muted bg-surface-light text-on-surface hover:border-secondary hover:text-secondary'
                  }`}
                >
                  {kategori}
                  {kategori === 'Semua Album' && (
                    <span className="ml-1.5 opacity-75">
                      ({albumSekolah.length})
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="mb-5 mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              Menampilkan <strong>{albumTampil.length}</strong> dari{' '}
              <strong>{albumTerfilter.length}</strong> album
            </p>

            {(kataKunci || kategoriAktif !== 'Semua Album') && (
              <button
                type="button"
                onClick={() => {
                  setKataKunci('')
                  setKategoriAktif('Semua Album')
                  setJumlahTampil(8)
                }}
                className="text-xs font-semibold text-secondary hover:text-primary"
              >
                Reset filter
              </button>
            )}
          </div>

          {albumTampil.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {albumTampil.map((album) => (
                <KartuAlbum key={album.id} album={album} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border-muted px-4 py-16 text-center">
              <Icon name="photo_library" className="text-4xl text-text-muted" />
              <h3 className="mt-3 font-bold text-primary">
                Album tidak ditemukan
              </h3>
              <p className="mt-1 text-sm text-text-muted">
                Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setKataKunci('')
                  setKategoriAktif('Semua Album')
                }}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-secondary"
              >
                Tampilkan Semua Album
              </button>
            </div>
          )}

          {jumlahTampil < albumTerfilter.length && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setJumlahTampil((jumlah) => jumlah + 4)}
                className="inline-flex items-center gap-2 rounded-full border border-secondary px-5 py-2.5 text-xs font-semibold text-secondary transition-colors hover:bg-secondary hover:text-white"
              >
                <Icon name="refresh" className="text-[15px]" />
                Muat Lebih Banyak Album
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Video dokumentasi */}
      <section className="bg-surface-light px-4 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-xl border border-border-muted bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Icon name="play_circle" className="text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-primary">
                Aset Video Dokumentasi & Siaran Langsung Kegiatan
              </h3>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-text-muted">
                Saksikan kembali publikasi aktivitas, siaran video kegiatan,
                liputan upacara bendera, dan rekaman kegiatan resmi sekolah.
              </p>
            </div>
          </div>

          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-red-800"
          >
            <Icon name="smart_display" className="text-[17px]" />
            Kunjungi Kanal Video
          </a>
        </div>
      </section>

      {/* Ajakan mengirim dokumentasi */}
      <section className="custom-pattern bg-primary-container text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cta-gold">
              Partisipasi Civitas Akademika
            </span>

            <h2 className="mt-3 font-headline-md text-headline-md font-bold leading-tight">
              Punya Dokumentasi Kegiatan Sekolah?
              <br className="hidden sm:block" /> Kirimkan ke Tim Redaksi Warta Kampus
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/75">
              Bagikan momen pembelajaran, prestasi, dan kebersamaan agar
              dokumentasi kegiatan sekolah dapat dinikmati oleh seluruh warga
              sekolah.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              to="/kontak"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta-gold px-4 py-3 text-xs font-bold text-primary transition-colors hover:bg-yellow-300"
            >
              <Icon name="upload_file" className="text-[17px]" />
              Kirimkan Dokumentasi
            </Link>

            <Link
              to="/kontak"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Icon name="help_outline" className="text-[17px]" />
              Panduan Resolusi
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}