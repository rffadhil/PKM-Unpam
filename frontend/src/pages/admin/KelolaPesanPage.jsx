import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import PesanToolbar from '@/components/pesan/PesanToolbar'
import TiketTable from '@/components/pesan/TiketTable'
import TinjauTiketModal from '@/components/pesan/TinjauTiketModal'
import KontakPublikForm from '@/components/pesan/KontakPublikForm'
import { mockKontak, mockTiket } from '@/mocks/adminPesan'
import { FILTER_TIKET_AWAL, TIKET_PER_HALAMAN } from '@/config/pesanAdmin'
import { saringTiket, urutkanTiket, validasiKontak } from '@/utils/tiket'

// Pesan Masuk & Layanan Kontak PTSP: perakit layout + state. Kata kunci topbar ikut menyaring.
// TODO: ganti state lokal dengan service ke API (GET/PUT /api/pesan, PUT /api/pengaturan-sekolah
// untuk data kontak), pola sama dengan hooks/useBerita.js.
export default function KelolaPesanPage() {
  const { pencarian = '' } = useOutletContext() ?? {}
  const [data, setData] = useState(mockTiket)
  const [filter, setFilter] = useState(FILTER_TIKET_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [tinjau, setTinjau] = useState(null)
  const [kontak, setKontak] = useState(mockKontak)
  const [kontakTersimpan, setKontakTersimpan] = useState(mockKontak)
  const [errorKontak, setErrorKontak] = useState({})
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4500)
    return () => clearTimeout(t)
  }, [notice])

  const hasil = useMemo(
    () => urutkanTiket(saringTiket(data, { ...filter, kata: pencarian })),
    [data, filter, pencarian],
  )
  const jumlahHalaman = Math.max(1, Math.ceil(hasil.length / TIKET_PER_HALAMAN))
  const halamanAman = Math.min(halaman, jumlahHalaman)
  const items = hasil.slice((halamanAman - 1) * TIKET_PER_HALAMAN, halamanAman * TIKET_PER_HALAMAN)
  const kontakBerubah = Object.keys(kontak).some((k) => kontak[k] !== kontakTersimpan[k])

  function terapkanFilter(nilai) {
    setFilter(nilai)
    setHalaman(1)
  }

  // Membuka tiket otomatis menandainya sudah dibaca.
  function bukaTiket(tiket) {
    setData((d) => d.map((t) => (t.id === tiket.id ? { ...t, dibaca: true } : t)))
    setTinjau({ ...tiket, dibaca: true })
  }

  function simpanTiket(tiket) {
    setData((d) => d.map((t) => (t.id === tiket.id ? tiket : t)))
    setTinjau(null)
    setNotice('Tindak lanjut tiket disimpan.')
  }

  function simpanKontak() {
    const hasilValidasi = validasiKontak(kontak)
    setErrorKontak(hasilValidasi)
    if (Object.keys(hasilValidasi).length) return
    // TODO: PUT /api/pengaturan-sekolah (kunci kontak_whatsapp, kontak_telepon, jam_*, alamat, peta)
    setKontakTersimpan(kontak)
    setNotice('Saluran kontak publik berhasil disimpan dan disinkronkan.')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <PesanToolbar nilai={filter} onUbah={terapkanFilter} />

      {notice && (
        <p role="status" className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark">
          {notice}
        </p>
      )}

      <TiketTable
        items={items}
        total={hasil.length}
        halaman={halamanAman}
        jumlahHalaman={jumlahHalaman}
        perHalaman={TIKET_PER_HALAMAN}
        onHalaman={(n) => setHalaman(Math.min(Math.max(1, n), jumlahHalaman))}
        onTinjau={bukaTiket}
      />

      <KontakPublikForm
        nilai={kontak}
        error={errorKontak}
        berubah={kontakBerubah}
        onUbah={(kunci, v) => setKontak((k) => ({ ...k, [kunci]: v }))}
        onSimpan={simpanKontak}
      />

      {tinjau && <TinjauTiketModal tiket={tinjau} onSimpan={simpanTiket} onTutup={() => setTinjau(null)} />}
    </div>
  )
}
