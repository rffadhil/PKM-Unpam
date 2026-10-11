import { useState } from 'react'
import { Link, useLocation, useOutletContext } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon'
import Avatar from '@/components/ui/Avatar'
import StatCard from '@/components/admin/StatCard'
import Pagination from '@/components/admin/Pagination'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { kategoriBerita, statusBerita } from '@/config/kategoriBerita'
import { pembacaBulanIni } from '@/mocks/adminBerita'
import { useDaftarBerita, useHapusBerita } from '@/hooks/useBerita'
import { formatTanggal } from '@/utils/tanggal'
import { bangunCsv, unduhFile } from '@/utils/csv'

const PER_HALAMAN = 5
const SEMUA = 'semua'
const gayaKategori = Object.fromEntries(kategoriBerita.map((k) => [k.nama, k]))
const gayaStatus = Object.fromEntries(statusBerita.map((s) => [s.nilai, s]))

const KOLOM_CSV = [
  { judul: 'ID', nilai: (a) => a.id },
  { judul: 'Judul', nilai: (a) => a.judul },
  { judul: 'Kategori', nilai: (a) => a.kategori },
  { judul: 'Penulis', nilai: (a) => a.penulis.nama },
  { judul: 'Email Penulis', nilai: (a) => a.penulis.email },
  { judul: 'Tanggal', nilai: (a) => a.tanggal },
  { judul: 'Status', nilai: (a) => gayaStatus[a.status].label },
]

const selectClass =
  'text-body-sm font-body-sm bg-surface-white border border-border-muted rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-secondary focus:border-secondary text-on-surface'

export default function BeritaAdminPage() {
  const { pencarian } = useOutletContext()
  const lokasi = useLocation()

  // Data lewat React Query + services/berita.service.js (sementara data dummy di memori).
  // TODO: filter, pencarian, dan paginasi nantinya dilakukan server (query string ke /api/posts).
  const { data, isLoading } = useDaftarBerita()
  const hapus = useHapusBerita()
  const [pilihKategori, setPilihKategori] = useState(SEMUA) // nilai di dropdown (belum diterapkan)
  const [pilihStatus, setPilihStatus] = useState(SEMUA)
  const [filter, setFilter] = useState({ kategori: SEMUA, status: SEMUA }) // filter yang diterapkan
  const [posisi, setPosisi] = useState({ halaman: 1, kunci: '' })
  const [terpilih, setTerpilih] = useState(() => new Set())
  const [akanDihapus, setAkanDihapus] = useState(null)
  const [pesan, setPesan] = useState(lokasi.state?.pesan ?? '') // pesan dari halaman form

  if (isLoading) return <p role="status" className="text-text-muted">Memuat data…</p>
  const artikel = data ?? []

  // Statistik dihitung dari seluruh data (bukan hasil filter)
  const total = artikel.length
  const jumlahTerbit = artikel.filter((a) => a.status === 'terbit').length
  const jumlahDraf = total - jumlahTerbit
  const persenTerbit = total ? Math.round((jumlahTerbit / total) * 1000) / 10 : 0

  // Urut terbaru → terapkan filter + pencarian
  const kataKunci = pencarian.trim().toLowerCase()
  const hasil = [...artikel]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id)
    .filter((a) => filter.kategori === SEMUA || a.kategori === filter.kategori)
    .filter((a) => filter.status === SEMUA || a.status === filter.status)
    .filter(
      (a) =>
        !kataKunci ||
        [a.judul, a.ringkasan, a.kategori, a.penulis.nama, a.penulis.email].some((t) =>
          t.toLowerCase().includes(kataKunci),
        ),
    )

  // Halaman kembali ke 1 otomatis saat filter / kata kunci berubah
  const kunci = JSON.stringify([filter, pencarian])
  const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN))
  const halaman = Math.min(posisi.kunci === kunci ? posisi.halaman : 1, totalHalaman)
  const ubahHalaman = (h) => setPosisi({ halaman: h, kunci })
  const awal = (halaman - 1) * PER_HALAMAN
  const barisHalaman = hasil.slice(awal, awal + PER_HALAMAN)

  const semuaHalamanDipilih = barisHalaman.length > 0 && barisHalaman.every((a) => terpilih.has(a.id))
  const sebagianDipilih = !semuaHalamanDipilih && barisHalaman.some((a) => terpilih.has(a.id))

  const terapkanFilter = () => {
    setFilter({ kategori: pilihKategori, status: pilihStatus })
    setTerpilih(new Set())
  }

  const toggleSemua = () =>
    setTerpilih((lama) => {
      const baru = new Set(lama)
      barisHalaman.forEach((a) => (semuaHalamanDipilih ? baru.delete(a.id) : baru.add(a.id)))
      return baru
    })

  const toggleSatu = (id) =>
    setTerpilih((lama) => {
      const baru = new Set(lama)
      if (baru.has(id)) baru.delete(id)
      else baru.add(id)
      return baru
    })

  const konfirmasiHapus = () => {
    const { id, judul } = akanDihapus
    setAkanDihapus(null)
    hapus.mutate(id, {
      onSuccess: () => {
        setTerpilih((lama) => {
          const baru = new Set(lama)
          baru.delete(id)
          return baru
        })
        setPesan(`Artikel “${judul}” berhasil dihapus.`)
      },
    })
  }

  const ekspor = () => {
    unduhFile('berita-pengumuman.csv', bangunCsv(KOLOM_CSV, hasil))
    setPesan(`${hasil.length} artikel diekspor ke berita-pengumuman.csv.`)
  }

  return (
    <>
      {pesan && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-body-sm"
        >
          <span className="flex items-start gap-2">
            <Icon name="check_circle" className="text-[18px] mt-px" />
            {pesan}
          </span>
          <button type="button" aria-label="Tutup pemberitahuan" onClick={() => setPesan('')}>
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
      )}

      {/* Ringkasan */}
      <section aria-label="Ringkasan artikel" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Artikel"
          nilai={total}
          info="+4 bulan ini"
          infoIkon="trending_up"
          infoClass="text-secondary font-semibold"
          ikon="article"
          ikonClass="bg-secondary-fixed/30 text-secondary"
        />
        <StatCard
          label="Diterbitkan"
          nilai={jumlahTerbit}
          nilaiClass="text-secondary"
          info={`${persenTerbit}% tayang aktif`}
          ikon="check_circle"
          ikonClass="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          label="Draf Tertunda"
          nilai={jumlahDraf}
          nilaiClass="text-amber-700"
          info="Menunggu kurasi"
          ikon="edit_note"
          ikonClass="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Pembaca Bulan Ini"
          nilai={pembacaBulanIni}
          info="Akses terverifikasi"
          infoIkon="visibility"
          infoClass="text-secondary font-semibold"
          ikon="monitoring"
          ikonClass="bg-primary-container text-cta-gold shadow-sm"
        />
      </section>

      <section className="bg-surface-white rounded-xl border border-border-muted shadow-sm overflow-hidden">
        {/* Judul & aksi utama */}
        <div className="p-5 border-b border-border-muted flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold">
              Daftar Artikel &amp; Publikasi Sekolah
            </h2>
            <p className="font-body-sm text-body-sm text-text-muted">
              Kelola berita utama, rilis pers, kalender acara, dan pengumuman resmi institusi.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={ekspor}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-white border border-secondary text-secondary font-label-lg text-label-lg hover:bg-secondary/10 transition-colors shadow-sm"
            >
              <Icon name="download" className="text-[18px]" />
              Ekspor Data (.CSV)
            </button>
            <Link
              to="/admin/berita/baru"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cta-gold text-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-[#D0D000] active:scale-95 transition-all"
            >
              <Icon name="add_circle" className="text-[20px]" />
              Tambah Berita Baru
            </Link>
          </div>
        </div>

        {/* Filter */}
        <div className="p-4 bg-surface-light border-b border-border-muted flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="filter-kategori" className="font-label-sm text-label-sm text-text-muted">
                Kategori:
              </label>
              <select
                id="filter-kategori"
                className={selectClass}
                value={pilihKategori}
                onChange={(e) => setPilihKategori(e.target.value)}
              >
                <option value={SEMUA}>Semua Kategori</option>
                {kategoriBerita.map((k) => (
                  <option key={k.nama} value={k.nama}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="filter-status" className="font-label-sm text-label-sm text-text-muted">
                Status:
              </label>
              <select
                id="filter-status"
                className={selectClass}
                value={pilihStatus}
                onChange={(e) => setPilihStatus(e.target.value)}
              >
                <option value={SEMUA}>Semua Status</option>
                {statusBerita.map((s) => (
                  <option key={s.nilai} value={s.nilai}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={terapkanFilter}
              className="px-3.5 py-1.5 rounded-lg bg-primary-container text-surface-white font-label-sm text-label-sm hover:bg-secondary transition-colors inline-flex items-center gap-1"
            >
              <Icon name="filter_list" className="text-[16px]" />
              Filter
            </button>
          </div>
          <div className="flex items-center gap-3 text-text-muted text-xs">
            {terpilih.size > 0 && (
              <span className="font-semibold text-secondary">{terpilih.size} dipilih</span>
            )}
            <span>Urutkan:</span>
            <span className="font-semibold text-primary">Terbaru (Default)</span>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left border-collapse">
            <thead>
              <tr className="bg-surface-light border-b border-border-muted text-on-surface font-label-lg text-label-lg">
                <th scope="col" className="py-3.5 px-4 w-12 text-center">
                  <input
                    type="checkbox"
                    aria-label="Pilih semua artikel di halaman ini"
                    className="rounded border-border-muted text-secondary focus:ring-secondary"
                    checked={semuaHalamanDipilih}
                    ref={(el) => {
                      if (el) el.indeterminate = sebagianDipilih
                    }}
                    onChange={toggleSemua}
                  />
                </th>
                <th scope="col" className="py-3.5 px-4">Judul Artikel &amp; Cuplikan</th>
                <th scope="col" className="py-3.5 px-4 w-44">Kategori</th>
                <th scope="col" className="py-3.5 px-4 w-48">Penulis</th>
                <th scope="col" className="py-3.5 px-4 w-36">Tanggal &amp; Status</th>
                <th scope="col" className="py-3.5 px-4 w-36 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted font-body-sm text-body-sm bg-surface-white">
              {barisHalaman.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center text-text-muted">
                    Tidak ada artikel yang cocok dengan filter atau pencarian.
                  </td>
                </tr>
              )}
              {barisHalaman.map((a) => {
                const kat = gayaKategori[a.kategori]
                const st = gayaStatus[a.status]
                return (
                  <tr
                    key={a.id}
                    className={clsx(
                      'hover:bg-surface-light/80 transition-colors group',
                      a.status === 'draf' && 'bg-amber-50/20',
                    )}
                  >
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        aria-label={`Pilih artikel ${a.judul}`}
                        className="rounded border-border-muted text-secondary focus:ring-secondary"
                        checked={terpilih.has(a.id)}
                        onChange={() => toggleSatu(a.id)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-border-muted flex items-center justify-center text-text-muted">
                          {a.gambar ? (
                            <img className="w-full h-full object-cover" src={a.gambar} alt="" loading="lazy" />
                          ) : (
                            <Icon name="image" className="text-[22px]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                            {a.disematkan && (
                              <Icon name="push_pin" title="Disematkan di Beranda" className="text-[14px] text-amber-600 mr-1 align-[-2px]" />
                            )}
                            {a.judul}
                          </h3>
                          <p className="text-text-muted text-xs line-clamp-1 mt-0.5">{a.ringkasan}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={clsx(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                          kat?.chip ?? 'bg-slate-100 text-slate-700',
                        )}
                      >
                        <span className={clsx('w-1.5 h-1.5 rounded-full', kat?.titik ?? 'bg-slate-400')} />
                        {a.kategori || 'Tanpa kategori'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Avatar inisial={a.penulis.inisial} tone={a.penulis.tone} nama={a.penulis.nama} />
                        <div className="leading-tight min-w-0">
                          <p className="font-semibold text-xs text-on-surface">{a.penulis.nama}</p>
                          <p className="text-[11px] text-text-muted truncate">{a.penulis.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="leading-tight">
                        <p className="font-semibold text-xs text-on-surface">{formatTanggal(a.tanggal)}</p>
                        <span className={clsx('inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold', st.kelas)}>
                          {st.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/admin/berita/${a.id}/edit`}
                          aria-label={`Edit artikel ${a.judul}`}
                          title="Edit Artikel"
                          className="p-1.5 text-secondary hover:bg-secondary/10 rounded-md transition-colors"
                        >
                          <Icon name="edit" className="text-[18px]" />
                        </Link>
                        <button
                          type="button"
                          aria-label={`Hapus artikel ${a.judul}`}
                          title="Hapus Artikel"
                          onClick={() => setAkanDihapus(a)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Icon name="delete" className="text-[18px]" />
                        </button>
                        <a
                          href={`/berita/${a.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Lihat artikel ${a.judul} di portal`}
                          title="Lihat di Portal"
                          className="p-1.5 text-text-muted hover:text-primary hover:bg-surface-light rounded-md transition-colors"
                        >
                          <Icon name="visibility" className="text-[18px]" />
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          halaman={halaman}
          totalHalaman={totalHalaman}
          onUbah={ubahHalaman}
          dari={hasil.length ? awal + 1 : 0}
          sampai={awal + barisHalaman.length}
          total={hasil.length}
        />
      </section>

      {akanDihapus && (
        <ConfirmDialog
          judul="Hapus artikel ini?"
          pesan={`“${akanDihapus.judul}” akan dihapus dan tidak tampil lagi di portal.`}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}
    </>
  )
}
