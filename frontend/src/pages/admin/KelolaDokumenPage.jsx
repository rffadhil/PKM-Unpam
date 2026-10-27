import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import UnggahDokumenCard from '@/components/dokumen/UnggahDokumenCard'
import DokumenTable from '@/components/dokumen/DokumenTable'
import DokumenFormModal from '@/components/dokumen/DokumenFormModal'
import DokumenDetailModal from '@/components/dokumen/DokumenDetailModal'
import { adminUser } from '@/mocks/admin'
import { mockDokumen } from '@/mocks/adminDokumen'
import { DOKUMEN_PER_HALAMAN, FILTER_DOKUMEN_AWAL } from '@/config/dokumenAdmin'
import { ekstensiBerkas, saringDokumen, urutkanDokumen } from '@/utils/dokumen'

// Manajemen Dokumen: perakit layout + state. Kata kunci dari topbar ikut menyaring daftar.
// TODO: ganti state lokal dengan service ke API (GET/POST/PUT/DELETE /api/dokumen) dan kirim
// berkas lewat services/upload.service.js. Pemindaian malware harus dilakukan di backend.
export default function KelolaDokumenPage() {
  const { pencarian = '' } = useOutletContext() ?? {}
  const [data, setData] = useState(mockDokumen)
  const [filter, setFilter] = useState(FILTER_DOKUMEN_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [detail, setDetail] = useState(null)
  const [diedit, setDiedit] = useState(null)
  const [akanDihapus, setAkanDihapus] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4500)
    return () => clearTimeout(t)
  }, [notice])

  const hasil = useMemo(
    () => urutkanDokumen(saringDokumen(data, { ...filter, kata: pencarian })),
    [data, filter, pencarian],
  )
  const jumlahHalaman = Math.max(1, Math.ceil(hasil.length / DOKUMEN_PER_HALAMAN))
  const halamanAman = Math.min(halaman, jumlahHalaman)
  const items = hasil.slice((halamanAman - 1) * DOKUMEN_PER_HALAMAN, halamanAman * DOKUMEN_PER_HALAMAN)

  function terapkanFilter(nilai) {
    setFilter(nilai)
    setHalaman(1)
  }

  function unggah({ berkas, judul, kategori, deskripsi, aktif }) {
    const baru = {
      id: Date.now(),
      nama: judul,
      tipe: ekstensiBerkas(berkas),
      ukuranBytes: berkas.size,
      versi: 'Rev 1.0',
      kategori,
      deskripsi,
      pengunggah: adminUser.nama,
      diunggah: new Date().toISOString(),
      aktif,
      url: URL.createObjectURL(berkas), // TODO: ganti dengan URL dari server
    }
    setData((d) => [baru, ...d])
    setFilter(FILTER_DOKUMEN_AWAL)
    setHalaman(1)
    setNotice(aktif ? 'Dokumen diunggah dan dipublikasikan ke portal.' : 'Dokumen diunggah sebagai nonaktif.')
  }

  function simpan(dok) {
    setData((d) => d.map((x) => (x.id === dok.id ? dok : x)))
    setDiedit(null)
    setDetail(null)
    setNotice('Data dokumen berhasil diperbarui.')
  }

  function konfirmasiHapus() {
    const { id } = akanDihapus
    setData((d) => d.filter((x) => x.id !== id))
    setAkanDihapus(null)
    setNotice('Dokumen dihapus dari portal.')
  }

  function muatUlang() {
    // TODO: panggil ulang GET /api/dokumen
    terapkanFilter(FILTER_DOKUMEN_AWAL)
    setNotice('Daftar dokumen diperbarui.')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <UnggahDokumenCard onUnggah={unggah} />

      {notice && (
        <p role="status" className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark">
          {notice}
        </p>
      )}

      <DokumenTable
        items={items}
        total={hasil.length}
        totalSemua={data.length}
        halaman={halamanAman}
        jumlahHalaman={jumlahHalaman}
        perHalaman={DOKUMEN_PER_HALAMAN}
        filter={filter}
        onFilter={terapkanFilter}
        onMuat={muatUlang}
        onHalaman={(n) => setHalaman(Math.min(Math.max(1, n), jumlahHalaman))}
        onLihat={setDetail}
        onEdit={setDiedit}
        onHapus={setAkanDihapus}
      />

      {detail && !diedit && <DokumenDetailModal dok={detail} onEdit={setDiedit} onTutup={() => setDetail(null)} />}

      {diedit && <DokumenFormModal dok={diedit} onSimpan={simpan} onTutup={() => setDiedit(null)} />}

      {akanDihapus && (
        <ConfirmDialog
          judul="Hapus dokumen ini?"
          pesan={`“${akanDihapus.nama}.${akanDihapus.tipe}” akan dihapus dan tombol unduhnya hilang dari portal.`}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}
    </div>
  )
}
