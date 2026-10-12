import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import PesanStats from '@/components/pesan/PesanStats'
import PesanToolbar from '@/components/pesan/PesanToolbar'
import TiketTable from '@/components/pesan/TiketTable'
import ResponPanel from '@/components/pesan/ResponPanel'
import TiketFormModal from '@/components/pesan/TiketFormModal'
import TeruskanModal from '@/components/pesan/TeruskanModal'
import KontakPublikForm from '@/components/pesan/KontakPublikForm'
import { tiketPesan, petugasTu, sinkronTerakhir, kontakPublikAwal } from '@/mocks/adminPesan'
import { buatCsvPesan, buatDrafAwal, buatNomorTiket, hitungStatistikPesan, saringTiket, urutkanTiket } from '@/utils/pesan'
import { unduhTeks } from '@/utils/unduh'

const PER_HALAMAN = 5
const FILTER_AWAL = { kategori: '', status: '', dari: '', sampai: '' }

// Manajemen Pesan Masuk & Layanan Kontak PTSP.
// TODO backend: tiket (GET/POST/PATCH /api/pesan), kirim tanggapan (email + WhatsApp gateway),
// sinkronisasi PTSP online, dan kontak publik (pengaturan_sekolah).
export default function KelolaPesanPage() {
  const { pencarian: cariTopbar = '' } = useOutletContext() ?? {}
  const [data, setData] = useState(tiketPesan)
  const [filter, setFilter] = useState(FILTER_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [terpilih, setTerpilih] = useState(() => new Set())
  const [aktifId, setAktifId] = useState(tiketPesan[0].id)
  const [draf, setDraf] = useState({})
  const [modal, setModal] = useState(null) // 'baru' | 'teruskan' | null
  const [notice, setNotice] = useState(null)
  const [kontak, setKontak] = useState(kontakPublikAwal)

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 5000)
    return () => clearTimeout(t)
  }, [notice])

  const info = (teks, error = false) => setNotice({ teks, error })
  const ubahTiket = (id, patch) => setData((d) => d.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  const stats = useMemo(() => hitungStatistikPesan(data), [data])
  const hasil = useMemo(() => urutkanTiket(saringTiket(data, { ...filter, kata: cariTopbar })), [data, filter, cariTopbar])
  const jumlahHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN))
  const halamanAman = Math.min(halaman, jumlahHalaman)
  const items = hasil.slice((halamanAman - 1) * PER_HALAMAN, halamanAman * PER_HALAMAN)

  const aktif = data.find((t) => t.id === aktifId) ?? null
  const drafAktif = aktif ? (draf[aktif.id] ?? buatDrafAwal(aktif)) : null

  const ubahFilter = (f) => {
    setFilter(f)
    setHalaman(1)
  }

  function pilihAktif(id) {
    setAktifId(id)
    ubahTiket(id, { dibaca: true })
  }
  function pilih(id) {
    setTerpilih((s) => {
      const n = new Set(s)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }
  function pilihSemua(centang) {
    setTerpilih((s) => {
      const n = new Set(s)
      items.forEach((t) => (centang ? n.add(t.id) : n.delete(t.id)))
      return n
    })
  }
  function tandaiDibaca(ids) {
    const sasaran = ids ? new Set(ids) : null
    const belum = data.filter((t) => !t.dibaca && (!sasaran || sasaran.has(t.id))).length
    setData((d) => d.map((t) => (!sasaran || sasaran.has(t.id) ? { ...t, dibaca: true } : t)))
    setTerpilih(new Set())
    info(belum ? `${belum} tiket ditandai sudah dibaca.` : 'Semua tiket sudah berstatus dibaca.')
  }

  const ubahDraf = (patch) => aktif && setDraf((m) => ({ ...m, [aktif.id]: { ...drafAktif, ...patch } }))

  // Mengembalikan pesan error (string) atau '' bila berhasil.
  function kirim() {
    if (!drafAktif.teks.trim()) return 'Teks tanggapan tidak boleh kosong.'
    const kanal = aktif.anonim ? ['Kanal WBS'] : [drafAktif.surel && aktif.email && 'Surel', drafAktif.wa && aktif.whatsapp && 'WhatsApp'].filter(Boolean)
    if (kanal.length === 0) return 'Pilih minimal satu saluran pengiriman.'
    ubahTiket(aktif.id, { status: 'selesai', dibaca: true, balasan: { teks: drafAktif.teks.trim(), kanal, tanggal: new Date().toISOString() } })
    setDraf((m) => {
      const { [aktif.id]: _dibuang, ...sisa } = m
      return sisa
    })
    info(`Tanggapan #${aktif.nomor} disimpan dan tiket ditandai selesai. Pengiriman ${kanal.join(' & ')} belum terhubung ke backend (simulasi).`)
    return ''
  }

  function teruskan(tujuan) {
    ubahTiket(aktif.id, { ditugaskanKe: tujuan, status: aktif.status === 'belum' ? 'diproses' : aktif.status })
    setModal(null)
    info(`Tiket #${aktif.nomor} diteruskan ke ${tujuan}.`)
  }

  function tambahTiket(f) {
    const baru = { ...f, id: Date.now(), nomor: buatNomorTiket(data, f.kategori), waktuMasuk: new Date().toISOString(), status: 'belum', dibaca: true, balasan: null, ditugaskanKe: '' }
    setData((d) => [baru, ...d])
    setFilter(FILTER_AWAL)
    setHalaman(1)
    setAktifId(baru.id)
    setModal(null)
    info(`Tiket #${baru.nomor} berhasil dibuat.`)
  }

  function ekspor() {
    if (hasil.length === 0) return info('Tidak ada tiket untuk diekspor. Ubah filter terlebih dulu.', true)
    unduhTeks('rekap-pesan-ptsp.csv', buatCsvPesan(hasil), 'text/csv;charset=utf-8')
    info(`${hasil.length} tiket diekspor ke file CSV (bisa dibuka di Excel).`)
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <PesanStats stats={stats} />

      <PesanToolbar
        filter={filter}
        onFilter={ubahFilter}
        onReset={() => ubahFilter(FILTER_AWAL)}
        onBuat={() => setModal('baru')}
        onEkspor={ekspor}
        onSinkron={() => info('Sinkronisasi PTSP Online belum terhubung ke backend.', true)}
        sinkronTerakhir={sinkronTerakhir}
      />

      {notice && (
        <p role="status" className={`rounded-xl px-4 py-3 text-sm font-medium ${notice.error ? 'bg-error-container text-on-error-container' : 'bg-secondary-container/60 text-secondary-dark'}`}>
          {notice.teks}
        </p>
      )}

      {terpilih.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-muted bg-surface-white px-4 py-3 text-sm shadow-sm">
          <span className="font-semibold text-primary">{terpilih.size} tiket dipilih</span>
          <span className="flex gap-2">
            <button onClick={() => setTerpilih(new Set())} className="rounded-lg border border-border-muted px-3 py-1.5 font-semibold text-primary hover:bg-surface-light">Batalkan pilihan</button>
            <button onClick={() => tandaiDibaca([...terpilih])} className="rounded-lg bg-secondary-dark px-3 py-1.5 font-semibold text-white hover:bg-primary-container">Tandai dibaca</button>
          </span>
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <TiketTable
          items={items}
          total={hasil.length}
          halaman={halamanAman}
          jumlahHalaman={jumlahHalaman}
          perHalaman={PER_HALAMAN}
          onHalaman={(n) => setHalaman(Math.min(Math.max(1, n), jumlahHalaman))}
          aktifId={aktifId}
          onAktif={pilihAktif}
          terpilih={terpilih}
          onPilih={pilih}
          onPilihSemua={pilihSemua}
          onTandaiSemuaDibaca={() => tandaiDibaca(null)}
        />
        <ResponPanel
          key={aktif?.id}
          tiket={aktif}
          draf={drafAktif}
          onDraf={ubahDraf}
          onKirim={kirim}
          onSimpanDraf={() => info('Draf respon disimpan sementara (hilang jika halaman dimuat ulang).')}
          onTeruskan={() => setModal('teruskan')}
          onBukaKembali={() => ubahTiket(aktif.id, { status: 'diproses' })}
        />
      </div>

      <KontakPublikForm awal={kontak} onSimpan={(k) => { setKontak(k); info('Kontak publik & jadwal pelayanan berhasil disimpan.') }} key={JSON.stringify(kontak)} />

      {modal === 'baru' && <TiketFormModal onSimpan={tambahTiket} onTutup={() => setModal(null)} />}
      {modal === 'teruskan' && aktif && <TeruskanModal tiket={aktif} petugas={petugasTu} onTeruskan={teruskan} onTutup={() => setModal(null)} />}
    </div>
  )
}
