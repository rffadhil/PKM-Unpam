
import { useEffect, useState } from 'react'
import {
  ambilDokumenPublik,
  urlUnduhDokumen,
} from '@/services/dokumenService'
import Icon from '@/components/ui/Icon'
import { site } from '@/config/site'

const saluran = [
  {
    ikon: 'call',
    kategori: 'PELAYANAN UMUM & SISWA',
    judul: 'Tata Usaha & Akademik',
    deskripsi:
      'Layanan legalisasi ijazah, surat keterangan siswa, administrasi rapor, dan mutasi sekolah.',
    kontak: site.telepon,
    detail: 'Senin - Jumat 07.00 - 15.30 WIB',
    aksi: 'Hubungi Saluran Telepon',
    href: `tel:${site.telepon.replace(/[^\d+]/g, '')}`,
    warna: 'bg-green-950 text-yellow-300',
  },
  {
    ikon: 'chat',
    kategori: 'KESISWAAN & SPMB',
    judul: 'Posko PPDB 2026/2027',
    deskripsi:
      'Pusat panduan jalur afirmasi, prestasi, zonasi, verifikasi berkas, dan kartu pendaftaran.',
    kontak:
      site.waPpdbUrl === 'https://wa.me/'
        ? 'Hubungi panitia PPDB'
        : 'WhatsApp Panitia PPDB',
    detail: 'Layanan informasi calon peserta didik',
    aksi: 'Buka WhatsApp',
    href: site.waPpdbUrl,
    warna: 'bg-green-800 text-white',
  },
  {
    ikon: 'mail',
    kategori: 'PUBLIKASI & STAKEHOLDER',
    judul: 'Humas & Kemitraan Pers',
    deskripsi:
      'Korespondensi instansi kedinasan, universitas mitra, jurnalis media, dan kerja sama dunia industri.',
    kontak: site.email,
    detail: 'Untuk pertanyaan resmi dan kerja sama',
    aksi: 'Kirim Surat Elektronik',
    href: `mailto:${site.email}`,
    warna: 'bg-green-950 text-white',
  },
  {
    ikon: 'policy',
    kategori: 'INTEGRITAS SEKOLAH HIJAU',
    judul: 'Layanan Aspirasi & WBS',
    deskripsi:
      'Whistleblowing system terenkripsi, anti-pungutan liar, pencegahan perundungan, dan perlindungan etika.',
    kontak: 'Kerahasiaan Identitas Terjaga',
    detail: 'Gunakan kanal pengaduan resmi sekolah',
    aksi: 'Menuju Form Pengaduan',
    href: '#wbs',
    warna: 'bg-lime-200 text-green-900',
  },
]

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-wider text-green-800">
      {children}
    </p>
  )
}

function Heading({ eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <SectionLabel>{eyebrow}</SectionLabel>
      <h2 className="mt-1 text-xl sm:text-2xl font-bold text-green-950">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      )}
    </div>
  )
}

function PanelTitle({ ikon, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-950 text-lime-300">
        <Icon name={ikon} className="text-xl" />
      </span>
      <h3 className="font-bold text-green-950">{children}</h3>
    </div>
  )
}

export default function KontakPage() {
  // State formulir kontak
  const [form, setForm] = useState({
    nama: '',
    email: '',
    telepon: '',
    kategori: '',
    subjek: '',
    pesan: '',
    setuju: false,
  })

  // State dokumen publik
  const [dokumen, setDokumen] = useState([])
  const [pencarian, setPencarian] = useState('')
  const [filterKategori, setFilterKategori] = useState('Semua Kategori')
  const [statusDokumen, setStatusDokumen] = useState('Memuat dokumen...')
  const [pesanStatus, setPesanStatus] = useState('')

  // Mengambil dokumen dari backend
  useEffect(() => {
    async function muatDokumen() {
      try {
        setStatusDokumen('Memuat dokumen...')

        const data = await ambilDokumenPublik()

        setDokumen(data)
        setStatusDokumen('')
      } catch (error) {
        setStatusDokumen(
          error.message || 'Gagal mengambil dokumen dari server.'
        )
      }
    }

    muatDokumen()
  }, [])

  // Membuat daftar kategori secara otomatis
  const kategoriDokumen = [
    'Semua Kategori',
    ...new Set(
      dokumen.map((item) => item.kategori).filter(Boolean)
    ),
  ]

  // Filter dan pencarian dokumen
  const dokumenTampil = dokumen.filter((item) => {
    const cocokKategori =
      filterKategori === 'Semua Kategori' ||
      item.kategori === filterKategori

    const kata = pencarian.toLowerCase()

    const cocokPencarian =
      (item.nama_dokumen || '').toLowerCase().includes(kata) ||
      (item.deskripsi || '').toLowerCase().includes(kata)

    return cocokKategori && cocokPencarian
  })

  // Format ukuran file
  function formatUkuran(bytes) {
    if (!bytes) return 'Ukuran tidak diketahui'

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Format tipe file
  function formatTipeFile(item) {
    const tipe = item.tipe_file || item.file_url || ''
    return tipe.split('/').pop().split('.').pop().toUpperCase()
  }

  // Mengubah input formulir
  function ubahForm(event) {
    const { name, value, checked, type } = event.target

    setForm((sebelumnya) => ({
      ...sebelumnya,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Mengirim formulir
  function kirimForm(event) {
    event.preventDefault()

    setPesanStatus(
      'Formulir sudah diperiksa di browser, tetapi belum dikirim ke server. Hubungkan formulir ke backend agar pesan diterima oleh pihak sekolah.'
    )
  }

  const inputClass =
    'mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100'

  return (
    <div
      className="min-h-screen bg-white"
      style={{
        fontFamily: 'Times New Roman, Times, serif',
      }}
    >
      {/* 1. Header halaman */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-green-900">
            <Icon name="verified_user" />
            Satu Pintu Pelayanan Publik Terpadu
          </span>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight text-green-950 sm:text-4xl">
            Kontak Resmi & Pusat Informasi Publik {site.nama}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            Pusat komunikasi resmi civitas akademika, posko terpadu informasi
            penerimaan murid baru, saluran pengaduan integritas
            (Whistleblowing System), serta repositori pengunduhan regulasi
            dengan transparansi dan akuntabilitas.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:space-y-14 lg:px-8 lg:py-10">
        {/* 2. Kartu saluran komunikasi */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <Heading
              eyebrow="Layanan Informasi"
              title="Saluran Komunikasi Resmi"
              description="Pilih layanan sesuai kebutuhan pertanyaan Anda."
            />

            <span className="mb-6 inline-flex w-fit items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-900">
              <Icon name="verified" />
              Kanal Informasi Resmi
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {saluran.map((item) => (
              <article
                key={item.judul}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.warna}`}
                >
                  <Icon name={item.ikon} className="text-xl" />
                </span>

                <p className="mt-5 text-[10px] font-bold tracking-wide text-green-800">
                  {item.kategori}
                </p>

                <h3 className="mt-1 font-bold text-green-950">
                  {item.judul}
                </h3>

                <p className="mt-2 flex-grow text-xs leading-5 text-slate-500">
                  {item.deskripsi}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="break-words text-sm font-bold text-green-950">
                    {item.kontak}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-500">
                    {item.detail}
                  </p>

                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-800 hover:text-green-600"
                  >
                    {item.aksi}
                    <Icon name="arrow_forward" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. Formulir pesan dan informasi kampus */}
        <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:col-span-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <SectionLabel>Terhubung ke CMS Admin</SectionLabel>
                <h2 className="mt-1 text-xl font-bold text-green-950">
                  Formulir Pesan & Konsultasi Publik
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Silakan lengkapi formulir berikut. Data akan perlu
                  dihubungkan ke server agar tercatat pada buku register
                  dinas elektronik.
                </p>
              </div>

              <Icon
                name="contact_support"
                className="hidden text-3xl text-green-800 sm:block"
              />
            </div>

            <form onSubmit={kirimForm} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold text-green-950">
                  Nama Lengkap Pengirim *
                  <input
                    className={inputClass}
                    name="nama"
                    value={form.nama}
                    onChange={ubahForm}
                    placeholder="Contoh: Raden Hendra Kusuma"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="text-xs font-semibold text-green-950">
                  Alamat Email Aktif *
                  <input
                    className={inputClass}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={ubahForm}
                    placeholder="nama.anda@gmail.com"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="text-xs font-semibold text-green-950">
                  Nomor Telepon / WhatsApp *
                  <input
                    className={inputClass}
                    type="tel"
                    name="telepon"
                    value={form.telepon}
                    onChange={ubahForm}
                    placeholder="08xx-xxxx-xxxx"
                    autoComplete="tel"
                    required
                  />
                </label>

                <label className="text-xs font-semibold text-green-950">
                  Kategori Layanan *
                  <select
                    className={inputClass}
                    name="kategori"
                    value={form.kategori}
                    onChange={ubahForm}
                    required
                  >
                    <option value="">Pilih Kategori Permohonan</option>
                    <option value="Akademik">Tata Usaha & Akademik</option>
                    <option value="PPDB">PPDB / SPMB</option>
                    <option value="Humas">Humas & Kemitraan</option>
                    <option value="Dokumen">Permohonan Dokumen</option>
                    <option value="Pengaduan">Aspirasi & Pengaduan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </label>
              </div>

              <label className="block text-xs font-semibold text-green-950">
                Subjek Pesan / Judul Permohonan *
                <input
                  className={inputClass}
                  name="subjek"
                  value={form.subjek}
                  onChange={ubahForm}
                  placeholder="Contoh: Konfirmasi Verifikasi Sertifikat Prestasi"
                  required
                />
              </label>

              <label className="block text-xs font-semibold text-green-950">
                Rincian Isi Pesan / Pengajuan Informasi *
                <textarea
                  className={`${inputClass} min-h-32 resize-y`}
                  name="pesan"
                  value={form.pesan}
                  onChange={ubahForm}
                  placeholder="Tuliskan pertanyaan, kronologi kendala administrasi, atau dokumen yang ingin Anda konfirmasikan..."
                  rows={5}
                  required
                />
              </label>

              <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                <input
                  className="mt-1 accent-green-800"
                  type="checkbox"
                  name="setuju"
                  checked={form.setuju}
                  onChange={ubahForm}
                  required
                />

                <span>
                  Saya menyetujui bahwa data nama, email, dan telepon yang
                  disampaikan digunakan oleh sekolah untuk keperluan
                  verifikasi identitas, balasan korespondensi dinas, dan
                  pengarsipan sesuai standar perlindungan data.
                </span>
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-300 px-5 py-3 text-sm font-bold text-green-950 transition hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2"
              >
                Kirim Pesan Sekarang
                <Icon name="send" />
              </button>

              {pesanStatus && (
                <p
                  role="status"
                  className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"
                >
                  {pesanStatus}
                </p>
              )}
            </form>
          </div>

          <div className="space-y-5 lg:col-span-5">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <PanelTitle ikon="location_city">
                Kampus Hijau Terpadu
              </PanelTitle>

              <p className="mt-1 pl-11 text-xs text-slate-500">
                Pusat Pembelajaran & Tata Pamong
              </p>

              <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
                <div className="flex gap-3">
                  <Icon
                    name="location_on"
                    className="text-xl text-green-800"
                  />

                  <div>
                    <h4 className="text-sm font-bold text-green-950">
                      Alamat Kampus
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {site.alamat}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Icon
                    name="schedule"
                    className="text-xl text-green-800"
                  />

                  <div>
                    <h4 className="text-sm font-bold text-green-950">
                      Loket Pelayanan Terpadu Satu Pintu (PTSP)
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Senin - Kamis: 07.00 - 15.30 WIB
                      <br />
                      Jumat: 07.00 - 15.00 WIB
                    </p>
                    <p className="mt-1 text-xs font-semibold text-red-600">
                      Sabtu, Minggu & hari libur: Tutup
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Icon
                    name="directions_bus"
                    className="text-xl text-green-800"
                  />

                  <div>
                    <h4 className="text-sm font-bold text-green-950">
                      Panduan Akses Transportasi Publik
                    </h4>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Silakan periksa rute angkutan umum dan akses perjalanan
                      menuju alamat sekolah melalui peta digital.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Peta lokasi */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-2 p-4">
                <h3 className="flex items-center gap-2 text-sm font-bold text-green-950">
                  <Icon name="map" className="text-lg text-green-800" />
                  Peta Lokasi Google Maps
                </h3>

                <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-semibold text-green-900">
                  Lokasi Sekolah
                </span>
              </div>

              <iframe
                title="Peta lokasi SMA Harapan Jaya"
                src="https://maps.google.com/maps?q=Jl.%20Daan%20Mogot%20KM%2013%2C%20Cengkareng%2C%20Jakarta%20Barat&output=embed"
                className="h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Periksa lokasi dan petunjuk perjalanan sebelum berkunjung.
                </p>

                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-yellow-300 px-3 py-2 text-xs font-bold text-green-950 hover:bg-yellow-400"
                >
                  Buka Google Maps
                  <Icon name="open_in_new" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Pusat unduhan dokumen dari backend */}
        <section id="unduh-dokumen" className="scroll-mt-24">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <Heading
                eyebrow="Keterbukaan Informasi Publik (PPID)"
                title="Pusat Unduhan Regulasi & Dokumen Resmi"
                description="Akses langsung berkas administrasi murid baru, kurikulum, panduan akademik, dan pelaporan akuntabilitas sekolah."
              />

              <div className="mb-6 flex flex-col gap-2 sm:flex-row">
                <label className="relative">
                  <span className="sr-only">Cari dokumen</span>

                  <Icon
                    name="search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400"
                  />

                  <input
                    value={pencarian}
                    onChange={(event) => setPencarian(event.target.value)}
                    placeholder="Cari judul dokumen..."
                    className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-xs outline-none focus:border-green-700 sm:w-56"
                  />
                </label>

                <label>
                  <span className="sr-only">Filter kategori dokumen</span>

                  <select
                    value={filterKategori}
                    onChange={(event) => setFilterKategori(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-green-700 sm:w-40"
                  >
                    {kategoriDokumen.map((kategori) => (
                      <option key={kategori} value={kategori}>
                        {kategori}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {/* Status pengambilan dokumen */}
            {statusDokumen && (
              <p className="py-8 text-center text-sm text-slate-500">
                {statusDokumen}
              </p>
            )}

            {/* Daftar dokumen */}
            {!statusDokumen && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {dokumenTampil.map((item) => {
                  const tipe = formatTipeFile(item)

                  const ikon =
                    tipe === 'PDF'
                      ? 'picture_as_pdf'
                      : 'description'

                  return (
                    <article
                      key={item.id}
                      className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold ${
                            tipe === 'PDF'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          <Icon name={ikon} />
                          {tipe}
                        </span>

                        <span className="text-[10px] text-slate-500">
                          {formatUkuran(item.ukuran_bytes)}
                        </span>
                      </div>

                      <h3 className="mt-4 font-bold leading-5 text-green-950">
                        {item.nama_dokumen}
                      </h3>

                      <p className="mt-2 flex-grow text-xs leading-5 text-slate-500">
                        {item.deskripsi || 'Tidak ada deskripsi dokumen.'}
                      </p>

                      <div className="mt-4 border-t border-slate-100 pt-3">
                        <div className="flex justify-between gap-2">
                          <span className="text-[10px] text-slate-500">
                            Kategori: {item.kategori}
                          </span>

                          <span className="text-[10px] text-slate-500">
                            {item.jumlah_unduhan || 0} unduhan
                          </span>
                        </div>

                        <a
                          href={urlUnduhDokumen(item.id)}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-green-800 px-3 py-2 text-xs font-semibold text-green-900 transition hover:bg-green-50"
                        >
                          <Icon name="download" />
                          Unduh Berkas
                        </a>
                      </div>
                    </article>
                  )
                })}

                {dokumenTampil.length === 0 && (
                  <p className="col-span-full py-8 text-center text-sm text-slate-500">
                    Dokumen yang kamu cari tidak ditemukan.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 5. Whistleblowing System */}
        <section
          id="wbs"
          className="scroll-mt-24 overflow-hidden rounded-2xl bg-green-950 px-5 py-8 text-white shadow-lg sm:px-8 sm:py-10 lg:px-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-green-950">
            <Icon name="verified_user" />
            Zona Integritas Menuju Wilayah Bebas Korupsi (WBK)
          </span>

          <div className="mt-5 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h2 className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
                Whistleblowing System (WBS) & Pengaduan Pungutan Liar
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-6 text-green-100/80">
                {site.nama} berkomitmen menerapkan tata kelola sekolah yang
                bersih, transparan, dan bebas dari pungutan liar dalam bentuk
                apa pun. Apabila Anda menemukan indikasi penyimpangan,
                pemerasan, atau diskriminasi, gunakan kanal pengaduan resmi
                yang disediakan sekolah.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    ikon: 'lock',
                    judul: 'Perlindungan Identitas',
                    isi: 'Informasi pelapor perlu ditangani secara terbatas dan bertanggung jawab.',
                  },
                  {
                    ikon: 'timer',
                    judul: 'Tindak Lanjut',
                    isi: 'Laporan diteruskan kepada petugas yang berwenang untuk ditinjau.',
                  },
                  {
                    ikon: 'balance',
                    judul: 'Penanganan Berjenjang',
                    isi: 'Pengaduan ditangani sesuai prosedur dan ketentuan yang berlaku.',
                  },
                ].map((item) => (
                  <div
                    key={item.judul}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <Icon
                      name={item.ikon}
                      className="text-2xl text-lime-300"
                    />

                    <h3 className="mt-2 text-sm font-bold">{item.judul}</h3>

                    <p className="mt-1 text-xs leading-5 text-green-100/70">
                      {item.isi}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-xl bg-white p-5 text-green-950 sm:p-6">
                <Icon
                  name="report"
                  className="text-3xl text-green-800"
                />

                <h3 className="mt-3 text-lg font-bold">
                  Laporkan dengan Aman
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sampaikan informasi awal melalui kanal resmi sekolah.
                  Jangan masukkan data sensitif jika kanal belum terverifikasi.
                </p>

                <a
                  href={`mailto:${site.email}?subject=${encodeURIComponent('Aspirasi dan Pengaduan Resmi')}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-300 px-4 py-3 text-sm font-bold text-green-950 transition hover:bg-yellow-400"
                >
                  <Icon name="security" />
                  Hubungi Kanal Pengaduan
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}