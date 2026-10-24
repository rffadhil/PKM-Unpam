import { useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import Pagination from '@/components/admin/Pagination'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import BeritaNotice from '@/components/berita/BeritaNotice'
import BeritaHeader from '@/components/berita/BeritaHeader'
import BeritaFilter from '@/components/berita/BeritaFilter'
import BeritaTable from '@/components/berita/BeritaTable'
import { PER_HALAMAN, SEMUA } from '@/config/berita'
import { useDaftarBerita, useHapusBerita } from '@/hooks/useBerita'

// Manajemen Berita & Pengumuman: perakit layout + state (filter, halaman, pilihan, hapus).
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

  return (
    <>
      {pesan && <BeritaNotice teks={pesan} onTutup={() => setPesan('')} />}

      <section className="bg-surface-white rounded-xl border border-border-muted shadow-sm overflow-hidden">
        <BeritaHeader />
        <BeritaFilter
          kategori={pilihKategori}
          status={pilihStatus}
          onKategori={setPilihKategori}
          onStatus={setPilihStatus}
          onTerapkan={terapkanFilter}
          jumlahTerpilih={terpilih.size}
        />
        <BeritaTable
          baris={barisHalaman}
          terpilih={terpilih}
          semuaDipilih={semuaHalamanDipilih}
          sebagianDipilih={sebagianDipilih}
          onPilihSemua={toggleSemua}
          onPilih={toggleSatu}
          onHapus={setAkanDihapus}
        />
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
