import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon'
import Field from '@/components/admin/forms/Field'
import { kelasInput, kelasBatas } from '@/components/admin/forms/gaya'
import EditorTeks from '@/components/admin/forms/EditorTeks'
import UnggahCover from '@/components/admin/forms/UnggahCover'
import PratinjauArtikel from '@/components/admin/forms/PratinjauArtikel'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { kategoriBerita } from '@/config/kategoriBerita'
import { useArtikel, useSimpanBerita } from '@/hooks/useBerita'
import { unggahGambar } from '@/services/upload.service'
import { adminUser } from '@/mocks/admin'
import { buatSlug, ketikSlug, rapikanSlug } from '@/utils/slug'
import { ringkasDariHtml, rapikanKonten } from '@/utils/html'
import { validasiBerita } from '@/utils/validasi'
import { hariIniIso } from '@/utils/tanggal'

const KATEGORI_PENGUMUMAN = 'Pengumuman Resmi'
const URUTAN_FOKUS = ['judul', 'slug', 'kategori', 'tanggal', 'ringkasan', 'konten', 'gambar']
const kartu = 'bg-surface-white rounded-xl border border-border-muted shadow-sm'

function nilaiAwalBaru() {
  return {
    judul: '', slug: '', slugManual: false, ringkasan: '', konten: '', kategori: '',
    gambar: '', tanggal: hariIniIso(), disematkan: false,
  }
}

function nilaiDariArtikel(a) {
  return {
    judul: a.judul, slug: a.slug, slugManual: true, ringkasan: a.ringkasan ?? '', konten: a.konten ?? '',
    kategori: a.kategori ?? '', gambar: a.gambar ?? '', tanggal: a.tanggal,
    disematkan: Boolean(a.disematkan),
  }
}

function FormBerita({ artikel }) {
  const mode = artikel ? 'edit' : 'baru'
  const navigate = useNavigate()
  const simpan = useSimpanBerita()

  const [awal] = useState(() => (artikel ? nilaiDariArtikel(artikel) : nilaiAwalBaru()))
  const [nilai, setNilai] = useState(awal)
  const [dicoba, setDicoba] = useState(false)
  const [galatServer, setGalatServer] = useState(null) // { field, pesan }
  const [tab, setTab] = useState('tulis')
  const [konfirmasiBatal, setKonfirmasiBatal] = useState(false)

  const kotor = JSON.stringify(nilai) !== JSON.stringify(awal)
  const galatForm = dicoba ? validasiBerita(nilai) : {}
  const galat = galatServer?.field && galatServer.field !== 'umum'
    ? { ...galatForm, [galatServer.field]: galatServer.pesan }
    : galatForm
  const jumlahGalat = Object.keys(galat).length

  // Peringatan bawaan browser saat tab ditutup / halaman di-refresh dengan perubahan belum disimpan
  useEffect(() => {
    if (!kotor) return undefined
    const jaga = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', jaga)
    return () => window.removeEventListener('beforeunload', jaga)
  }, [kotor])

  const ubah = (kolom, isi) => setNilai((n) => ({ ...n, [kolom]: isi }))

  const ubahJudul = (judul) =>
    setNilai((n) => ({ ...n, judul, slug: n.slugManual ? n.slug : buatSlug(judul) }))

  const ubahSlug = (slug) => {
    setGalatServer(null)
    setNilai((n) => ({ ...n, slug: ketikSlug(slug), slugManual: true }))
  }

  const rapikanSlugKolom = () => setNilai((n) => ({ ...n, slug: rapikanSlug(n.slug) }))

  const ubahKategori = (kategori) =>
    setNilai((n) => ({ ...n, kategori, disematkan: kategori === KATEGORI_PENGUMUMAN ? n.disematkan : false }))

  const labelSimpan = mode === 'edit' ? 'Simpan Perubahan' : 'Simpan'

  const kirim = (e) => {
    e.preventDefault()
    setDicoba(true)
    setGalatServer(null)
    const hasil = validasiBerita(nilai)
    const pertama = URUTAN_FOKUS.find((k) => hasil[k])
    if (pertama) {
      document.getElementById(`field-${pertama}`)?.focus()
      return
    }

    simpan.mutate(
      {
        id: artikel?.id,
        slug: nilai.slug,
        judul: nilai.judul.trim(),
        ringkasan: nilai.ringkasan.trim() || ringkasDariHtml(nilai.konten),
        konten: rapikanKonten(DOMPurify.sanitize(nilai.konten)), // backend juga wajib sanitize (sanitize-html)
        kategori: nilai.kategori,
        gambar: nilai.gambar,
        tanggal: nilai.tanggal,
        disematkan: nilai.kategori === KATEGORI_PENGUMUMAN && nilai.disematkan,
      },
      {
        onSuccess: (hasilSimpan) => {
          const aksi = mode === 'edit' ? 'diperbarui' : 'disimpan'
          navigate('/admin/berita', { state: { pesan: `Artikel “${hasilSimpan.judul}” berhasil ${aksi}.` } })
        },
        onError: (err) => {
          setGalatServer({ field: err.field ?? 'umum', pesan: err.message })
          if (err.field) document.getElementById(`field-${err.field}`)?.focus()
        },
      },
    )
  }

  const batal = () => (kotor ? setKonfirmasiBatal(true) : navigate('/admin/berita'))
  const penulis = artikel?.penulis ?? { nama: adminUser.namaSingkat }
  const idDeskripsi = (k) => `field-${k}-info`

  return (
    <form onSubmit={kirim} noValidate aria-label={mode === 'edit' ? 'Form edit berita' : 'Form tambah berita'} className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <Link to="/admin/berita" className="text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-1">
            <Icon name="arrow_back" className="text-[16px]" />
            Kembali ke daftar berita
          </Link>
          <h2 className="font-headline-md text-headline-md text-primary font-bold mt-1">
            {mode === 'edit' ? 'Edit Berita' : 'Tambah Berita Baru'}
          </h2>
          <p className="font-body-sm text-body-sm text-text-muted">
            {mode === 'edit'
              ? 'Perbarui judul, isi, kategori, atau gambar cover artikel.'
              : 'Tulis berita atau pengumuman baru. Artikel yang disimpan langsung tayang di portal.'}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={batal}
            className="px-4 py-2 rounded-lg border border-border-muted bg-surface-white text-on-surface font-label-lg text-label-lg hover:bg-surface-light transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={simpan.isPending}
            className="px-4 py-2 rounded-lg bg-cta-gold text-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-[#D0D000] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {simpan.isPending ? 'Menyimpan…' : labelSimpan}
          </button>
        </div>
      </div>

      {(jumlahGalat > 0 || galatServer?.field === 'umum') && (
        <div role="alert" className="px-4 py-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-body-sm flex items-start gap-2">
          <Icon name="error" className="text-[18px] mt-px" />
          {galatServer?.field === 'umum'
            ? galatServer.pesan
            : `Periksa kembali isian Anda: ${jumlahGalat} kolom perlu diperbaiki.`}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Kolom utama */}
        <div className="lg:col-span-8 space-y-5">
          <section className={`${kartu} p-5 space-y-5`} aria-label="Konten utama">
            <Field id="field-judul" label="Judul" wajib galat={galat.judul}>
              <input
                id="field-judul"
                type="text"
                value={nilai.judul}
                onChange={(e) => ubahJudul(e.target.value)}
                aria-invalid={Boolean(galat.judul)}
                aria-describedby={idDeskripsi('judul')}
                placeholder="Contoh: Tim Robotik SMA Harapan Jaya Juara Nasional"
                className={clsx(kelasInput, kelasBatas(galat.judul), 'text-base font-semibold')}
              />
            </Field>

            <Field
              id="field-slug"
              label="Slug (alamat artikel)"
              wajib
              galat={galat.slug}
              petunjuk={mode === 'edit' ? 'Mengubah slug akan mengubah alamat artikel yang sudah dibagikan.' : 'Dibuat otomatis dari judul. Boleh diubah.'}
            >
              <div className="flex items-stretch">
                <span className="inline-flex items-center px-3 text-xs text-text-muted bg-surface-light border border-r-0 border-border-muted rounded-l-lg">
                  /berita/
                </span>
                <input
                  id="field-slug"
                  type="text"
                  value={nilai.slug}
                  onChange={(e) => ubahSlug(e.target.value)}
                  onBlur={rapikanSlugKolom}
                  aria-invalid={Boolean(galat.slug)}
                  aria-describedby={idDeskripsi('slug')}
                  className={clsx(kelasInput, kelasBatas(galat.slug), 'rounded-l-none')}
                />
              </div>
            </Field>

            <Field
              id="field-ringkasan"
              label="Cuplikan"
              galat={galat.ringkasan}
              petunjuk={`Tampil di daftar berita. Kosongkan untuk dibuat otomatis dari isi artikel. ${nilai.ringkasan.length}/200`}
            >
              <textarea
                id="field-ringkasan"
                rows={3}
                value={nilai.ringkasan}
                onChange={(e) => ubah('ringkasan', e.target.value)}
                aria-invalid={Boolean(galat.ringkasan)}
                aria-describedby={idDeskripsi('ringkasan')}
                className={clsx(kelasInput, kelasBatas(galat.ringkasan), 'resize-y')}
              />
            </Field>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="field-konten" className="block text-label-lg font-label-lg font-semibold text-on-surface">
                  Isi artikel
                </label>
                <div role="tablist" aria-label="Mode isi artikel" className="inline-flex rounded-lg border border-border-muted overflow-hidden text-xs font-semibold">
                  {[
                    ['tulis', 'Tulis'],
                    ['pratinjau', 'Pratinjau'],
                  ].map(([kunci, label]) => (
                    <button
                      key={kunci}
                      type="button"
                      role="tab"
                      aria-selected={tab === kunci}
                      onClick={() => setTab(kunci)}
                      className={clsx('px-3 py-1', tab === kunci ? 'bg-primary-container text-white' : 'bg-surface-white text-text-muted hover:bg-surface-light')}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div hidden={tab !== 'tulis'}>
                <EditorTeks
                  id="field-konten"
                  nilai={nilai.konten}
                  onUbah={(html) => ubah('konten', html)}
                  onUnggahGambar={unggahGambar}
                  galat={galat.konten}
                  deskripsiId={idDeskripsi('konten')}
                />
              </div>
              {tab === 'pratinjau' && (
                <div className="rounded-lg border border-border-muted bg-surface-white">
                  <PratinjauArtikel judul={nilai.judul} gambar={nilai.gambar} konten={nilai.konten} kategori={nilai.kategori} />
                </div>
              )}
              <div id={idDeskripsi('konten')}>
                {galat.konten && (
                  <p role="alert" className="mt-1.5 text-xs text-error font-medium">
                    {galat.konten}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Kolom samping */}
        <div className="lg:col-span-4 space-y-5">
          <section className={`${kartu} p-5 space-y-4`} aria-label="Pengaturan publikasi">
            <h3 className="font-headline-sm text-headline-sm font-bold text-primary">Publikasi</h3>
            <Field id="field-tanggal" label="Tanggal publikasi" wajib galat={galat.tanggal}>
              <input
                id="field-tanggal"
                type="date"
                value={nilai.tanggal}
                onChange={(e) => ubah('tanggal', e.target.value)}
                aria-invalid={Boolean(galat.tanggal)}
                aria-describedby={idDeskripsi('tanggal')}
                className={clsx(kelasInput, kelasBatas(galat.tanggal))}
              />
            </Field>
            <div>
              <label className={clsx('flex items-start gap-2.5 text-sm', nilai.kategori !== KATEGORI_PENGUMUMAN && 'opacity-60')}>
                <input
                  id="field-disematkan"
                  type="checkbox"
                  checked={nilai.disematkan}
                  disabled={nilai.kategori !== KATEGORI_PENGUMUMAN}
                  onChange={(e) => ubah('disematkan', e.target.checked)}
                  className="mt-0.5 rounded border-border-muted text-secondary focus:ring-secondary"
                />
                <span>
                  <span className="font-semibold text-on-surface">Sematkan di Beranda</span>
                  <span className="block text-xs text-text-muted">Hanya untuk kategori Pengumuman Resmi.</span>
                </span>
              </label>
            </div>
            <p className="text-xs text-text-muted pt-1 border-t border-border-muted">
              Penulis: <span className="font-semibold text-on-surface">{penulis.nama}</span>
            </p>
          </section>

          <section className={`${kartu} p-5`} aria-label="Pengaturan kategori">
            <Field id="field-kategori" label="Kategori" wajib galat={galat.kategori}>
              <select
                id="field-kategori"
                value={nilai.kategori}
                onChange={(e) => ubahKategori(e.target.value)}
                aria-invalid={Boolean(galat.kategori)}
                aria-describedby={idDeskripsi('kategori')}
                className={clsx(kelasInput, kelasBatas(galat.kategori))}
              >
                <option value="">Pilih kategori…</option>
                {kategoriBerita.map((k) => (
                  <option key={k.nama} value={k.nama}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </Field>
          </section>

          <section className={`${kartu} p-5`} aria-label="Pengaturan gambar cover">
            <p className="block text-label-lg font-label-lg font-semibold text-on-surface mb-1.5">
              Gambar cover
              <span className="text-error ml-0.5" aria-hidden="true">*</span>
            </p>
            <UnggahCover id="field-gambar" nilai={nilai.gambar} onUbah={(url) => ubah('gambar', url)} onUnggah={unggahGambar} galat={galat.gambar} />
          </section>
        </div>
      </div>

      <div className="flex justify-end gap-2.5 pt-1">
        <button type="button" onClick={batal} className="px-4 py-2 rounded-lg border border-border-muted bg-surface-white text-on-surface font-label-lg text-label-lg hover:bg-surface-light transition-colors">
          Batal
        </button>
        <button
          type="submit"
          disabled={simpan.isPending}
          className="px-4 py-2 rounded-lg bg-cta-gold text-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-[#D0D000] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {simpan.isPending ? 'Menyimpan…' : labelSimpan}
        </button>
      </div>

      {konfirmasiBatal && (
        <ConfirmDialog
          judul="Buang perubahan?"
          pesan="Perubahan yang belum disimpan akan hilang."
          labelKonfirmasi="Buang Perubahan"
          ikon="warning"
          onKonfirmasi={() => navigate('/admin/berita')}
          onBatal={() => setKonfirmasiBatal(false)}
        />
      )}
    </form>
  )
}

// Satu halaman untuk dua rute: /admin/berita/baru dan /admin/berita/:id/edit
export default function BeritaFormPage() {
  const { id } = useParams()
  const { data, isLoading, isError } = useArtikel(id)

  if (id && isLoading) return <p role="status" className="text-text-muted">Memuat data…</p>
  if (id && (isError || !data)) {
    return (
      <section className={`${kartu} p-10 text-center`}>
        <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Artikel tidak ditemukan</h2>
        <p className="font-body-sm text-body-sm text-text-muted mt-2">
          Artikel mungkin sudah dihapus atau alamatnya salah.
        </p>
        <Link to="/admin/berita" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-secondary hover:underline">
          <Icon name="arrow_back" className="text-[16px]" />
          Kembali ke daftar berita
        </Link>
      </section>
    )
  }

  return <FormBerita key={data?.id ?? 'baru'} artikel={data} />
}
