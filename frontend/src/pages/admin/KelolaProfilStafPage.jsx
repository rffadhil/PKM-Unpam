import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import StafTabs from '@/components/staf/StafTabs'
import StafStats from '@/components/staf/StafStats'
import StafToolbar from '@/components/staf/StafToolbar'
import StafTable from '@/components/staf/StafTable'
import StafFormModal from '@/components/staf/StafFormModal'
import ProfilSambutan from '@/components/staf/ProfilSambutan'
import { staf as stafAwal, ringkasanProfil, sambutanAwal } from '@/mocks/adminStaf'
import { TAB_PROFIL } from '@/config/staf'
import { buatCsvStaf, hitungStatistikStaf, saringStaf, urutkanStaf } from '@/utils/staf'
import { unduhTeks } from '@/utils/unduh'

const PER_HALAMAN = 5
const FILTER_AWAL = { kata: '', rumpun: '', status: '' }

// Profil Sekolah & Direktori Staf. Hanya tab 1 yang sudah punya desain.
// TODO: ganti state lokal dengan service ke API (GET/POST/PUT/DELETE /api/staf).
export default function KelolaProfilStafPage() {
  const { pencarian: cariTopbar = '' } = useOutletContext() ?? {}
  const [tab, setTab] = useState('direktori')
  const [data, setData] = useState(stafAwal)
  const [filter, setFilter] = useState(FILTER_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [terpilih, setTerpilih] = useState(() => new Set())
  const [modal, setModal] = useState(null) // { staf } | null
  const [notice, setNotice] = useState(null) // { teks, error }

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 4500)
    return () => clearTimeout(t)
  }, [notice])

  const info = (teks, error = false) => setNotice({ teks, error })
  const stats = useMemo(() => hitungStatistikStaf(data), [data])
  const hasil = useMemo(() => urutkanStaf(saringStaf(data, { ...filter, kata: filter.kata || cariTopbar })), [data, filter, cariTopbar])

  const jumlahHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN))
  const halamanAman = Math.min(halaman, jumlahHalaman)
  const items = hasil.slice((halamanAman - 1) * PER_HALAMAN, halamanAman * PER_HALAMAN)

  const ubahFilter = (f) => {
    setFilter(f)
    setHalaman(1)
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
      items.forEach((p) => (centang ? n.add(p.id) : n.delete(p.id)))
      return n
    })
  }

  function simpan(p) {
    if (p.id) {
      setData((d) => d.map((x) => (x.id === p.id ? p : x)))
      info('Data berhasil diperbarui.')
    } else {
      const urutan = Math.max(0, ...data.map((x) => x.urutan)) + 1
      setData((d) => [...d, { ...p, id: Date.now(), urutan }])
      info('Staf baru berhasil ditambahkan.')
    }
    setModal(null)
  }

  function hapus(p) {
    if (!window.confirm(`Hapus data "${p.nama}"?`)) return
    setData((d) => d.filter((x) => x.id !== p.id))
    setTerpilih((s) => {
      const n = new Set(s)
      n.delete(p.id)
      return n
    })
    info('Data dihapus.')
  }

  function hapusTerpilih() {
    if (!window.confirm(`Hapus ${terpilih.size} data yang dipilih?`)) return
    setData((d) => d.filter((p) => !terpilih.has(p.id)))
    info(`${terpilih.size} data dihapus.`)
    setTerpilih(new Set())
  }

  const toggleTampil = (id) => setData((d) => d.map((p) => (p.id === id ? { ...p, tampilPublik: !p.tampilPublik } : p)))

  function ekspor() {
    if (hasil.length === 0) return info('Tidak ada data untuk diekspor. Ubah filter terlebih dulu.', true)
    unduhTeks('data-ptk-sma-harapan-jaya.csv', buatCsvStaf(hasil), 'text/csv;charset=utf-8')
    info(`${hasil.length} data PTK diekspor ke file CSV (bisa dibuka di Excel).`)
  }

  // TODO: sambungkan ke backend (sinkronisasi Dapodik).
  const tarikDapodik = () => info('Tarik Data Dapodik belum terhubung ke backend.', true)
  const sambutanTersimpan = (mode) =>
    info(mode === 'live' ? 'Sambutan & visi berhasil ditayangkan.' : 'Sambutan & visi disimpan sebagai draft.')

  const tabAktif = TAB_PROFIL.find((t) => t.id === tab)

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <StafTabs aktif={tab} onUbah={setTab} jumlahStaf={data.length} />

      {notice && (
        <p role="status" className={`rounded-xl px-4 py-3 text-sm font-medium ${notice.error ? 'bg-error-container text-on-error-container' : 'bg-secondary-container/60 text-secondary-dark'}`}>
          {notice.teks}
        </p>
      )}

      {tab === 'direktori' ? (
        <div role="tabpanel" id="panel-direktori" aria-labelledby="tab-direktori" className="space-y-6">
          <StafStats stats={stats} akreditasi={{ nilai: ringkasanProfil.akreditasi, lembaga: ringkasanProfil.lembagaAkreditasi }} />

          <StafToolbar filter={filter} onFilter={ubahFilter} onReset={() => ubahFilter(FILTER_AWAL)} onTambah={() => setModal({ staf: null })} onEkspor={ekspor} onDapodik={tarikDapodik} />

          {terpilih.size > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-muted bg-surface-white px-4 py-3 text-sm shadow-sm">
              <span className="font-semibold text-primary">{terpilih.size} data dipilih</span>
              <span className="flex gap-2">
                <button onClick={() => setTerpilih(new Set())} className="rounded-lg border border-border-muted px-3 py-1.5 font-semibold text-primary hover:bg-surface-light">Batalkan pilihan</button>
                <button onClick={hapusTerpilih} className="rounded-lg bg-error px-3 py-1.5 font-semibold text-white hover:opacity-90">Hapus terpilih</button>
              </span>
            </div>
          )}

          <StafTable
            items={items}
            total={hasil.length}
            totalSemua={data.length}
            halaman={halamanAman}
            jumlahHalaman={jumlahHalaman}
            perHalaman={PER_HALAMAN}
            onHalaman={(n) => setHalaman(Math.min(Math.max(1, n), jumlahHalaman))}
            terpilih={terpilih}
            onPilih={pilih}
            onPilihSemua={pilihSemua}
            onEdit={(p) => setModal({ staf: p })}
            onHapus={hapus}
            onToggle={toggleTampil}
          />

          <ProfilSambutan awal={sambutanAwal} onSimpan={sambutanTersimpan} />
        </div>
      ) : (
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="rounded-2xl border border-dashed border-border-muted bg-surface-white p-12 text-center">
          <Icon name={tabAktif.ikon} className="text-[40px] text-text-muted" />
          <h2 className="mt-3 text-headline-sm font-bold text-primary">{tabAktif.label.replace(/^\d\.\s/, '')}</h2>
          <p className="mt-1 text-text-muted">Bagian ini belum dibuat karena desainnya belum tersedia.</p>
        </div>
      )}

      {modal && <StafFormModal staf={modal.staf} onSimpan={simpan} onTutup={() => setModal(null)} />}
    </div>
  )
}
