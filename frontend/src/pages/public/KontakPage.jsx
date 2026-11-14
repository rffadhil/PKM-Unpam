import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import PageHero from '@/components/ui/PageHero'
import { site } from '@/config/site'
import { kirimPesanPublik } from '@/services/pesan.service'

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

  const [pesanStatus, setPesanStatus] = useState('')
  const [sedangMengirim, setSedangMengirim] = useState(false)

  // Mengubah input formulir (field umum)
  function ubahForm(event) {
    const { name, value, checked, type } = event.target

    setForm((sebelumnya) => ({
      ...sebelumnya,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Nama: hanya huruf (termasuk huruf beraksen), spasi, titik, apostrof,
  // dan tanda hubung. Simbol seperti !@#$%^ dan angka langsung dibuang.
  function ubahNama(event) {
    const bersih = event.target.value.replace(/[^\p{L}\s.'-]/gu, '')

    setForm((sebelumnya) => ({ ...sebelumnya, nama: bersih }))
  }

  // Telepon: hanya angka. Tanda + dan - dibolehkan untuk format
  // seperti +62 atau 08xx-xxxx-xxxx. Huruf langsung dibuang.
  // Kalau mau angka murni saja, ganti regex menjadi /\D/g
  function ubahTelepon(event) {
    const bersih = event.target.value.replace(/[^\d+-]/g, '')

    setForm((sebelumnya) => ({ ...sebelumnya, telepon: bersih }))
  }

  // Mengirim formulir
  async function kirimForm(event) {
    event.preventDefault()

    if (!form.setuju) {
      setPesanStatus('Mohon setujui penggunaan data sebelum mengirim pesan.')
      return
    }

    // Validasi tambahan: nama tidak boleh kosong/hanya spasi
    if (!form.nama.trim()) {
      setPesanStatus('Nama lengkap wajib diisi dengan huruf.')
      return
    }

    // Validasi tambahan: nomor telepon 9-15 digit
    const jumlahDigit = form.telepon.replace(/\D/g, '').length

    if (jumlahDigit < 9 || jumlahDigit > 15) {
      setPesanStatus('Nomor telepon tidak valid. Masukkan 9 sampai 15 digit angka.')
      return
    }

    try {
      setSedangMengirim(true)
      setPesanStatus('Mengirim pesan...')

      await kirimPesanPublik({ ...form, nama: form.nama.trim() })

      setPesanStatus(
        'Pesan berhasil dikirim! Terima kasih telah menghubungi pihak sekolah.'
      )

      setForm({
        nama: '',
        email: '',
        telepon: '',
        kategori: '',
        subjek: '',
        pesan: '',
        setuju: false,
      })
    } catch (error) {
      setPesanStatus(
        error.message || 'Pesan gagal dikirim. Silakan coba kembali.'
      )
    } finally {
      setSedangMengirim(false)
    }
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
      <PageHero
        judul={`Kontak Resmi & Pusat Informasi Publik ${site.nama}`}
        deskripsi="Pusat komunikasi resmi civitas akademika, posko terpadu informasi penerimaan murid baru, serta layanan konsultasi dan informasi publik sekolah secara transparan dan akuntabel."
      />

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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

          {/* Formulir kontak */}
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

                {/* NAMA: hanya huruf */}
                <label className="text-xs font-semibold text-green-950">
                  Nama Lengkap Pengirim *
                  <input
                    className={inputClass}
                    name="nama"
                    value={form.nama}
                    onChange={ubahNama}
                    placeholder="Contoh: Raden Hendra Kusuma"
                    autoComplete="name"
                    maxLength={100}
                    title="Nama hanya boleh berisi huruf, spasi, titik, apostrof, dan tanda hubung"
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

                {/* TELEPON: hanya angka */}
                <label className="text-xs font-semibold text-green-950">
                  Nomor Telepon / WhatsApp *
                  <input
                    className={inputClass}
                    type="tel"
                    name="telepon"
                    value={form.telepon}
                    onChange={ubahTelepon}
                    placeholder="08xx-xxxx-xxxx"
                    autoComplete="tel"
                    inputMode="numeric"
                    maxLength={16}
                    pattern="[0-9+\-]{9,16}"
                    title="Masukkan nomor telepon yang valid (9-16 karakter), hanya angka"
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
                disabled={sedangMengirim}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-300 px-5 py-3 text-sm font-bold text-green-950 transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sedangMengirim ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}
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

          {/* Informasi kampus dan Google Maps */}
          <div className="space-y-5 lg:col-span-5">

            {/* Informasi kampus */}
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
      </div>
    </div>
  )
}