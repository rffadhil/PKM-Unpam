import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import AgendaStats from '@/components/agenda/AgendaStats'
import AgendaFilters from '@/components/agenda/AgendaFilters'
import AgendaTable from '@/components/agenda/AgendaTable'
import AgendaFormModal from '@/components/agenda/AgendaFormModal'
import AgendaSyncBanner from '@/components/agenda/AgendaSyncBanner'
import { mockAgenda } from '@/mocks/adminAgenda'
import { PERIODE_AKADEMIK } from '@/config/agenda'
import { buildIcs, hitungStatistik, saringAgenda, urutkanAgenda } from '@/utils/agenda'

const PER_HALAMAN = 5
const FILTER_AWAL = { kategori: '', status: '', periode: PERIODE_AKADEMIK[0], kata: '' }

function unduh(nama, isi, tipe) {
  const url = URL.createObjectURL(new Blob([isi], { type: tipe }))
  const a = Object.assign(document.createElement('a'), { href: url, download: nama })
  a.click()
  URL.revokeObjectURL(url)
}

// Manajemen Agenda. TODO: ganti state lokal dengan service ke API (GET/POST/PUT/DELETE /api/agenda).
export default function KelolaAgendaPage() {
  const { pencarian: cariTopbar = '' } = useOutletContext() ?? {}
  const [data, setData] = useState(mockAgenda)
  const [filter, setFilter] = useState(FILTER_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [terpilih, setTerpilih] = useState(() => new Set())
  const [modal, setModal] = useState(null) // { item } | null
  const [notice, setNotice] = useState(null) // { teks, error }

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 4500)
    return () => clearTimeout(t)
  }, [notice])

  const stats = useMemo(() => hitungStatistik(data), [data])
  const hasil = useMemo(
    () => urutkanAgenda(saringAgenda(data, { ...filter, kata: filter.kata || cariTopbar })),
    [data, filter, cariTopbar],
  )
  const jumlahHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN))
  const halamanAman = Math.min(halaman, jumlahHalaman)
  const items = hasil.slice((halamanAman - 1) * PER_HALAMAN, halamanAman * PER_HALAMAN)

  const info = (teks, error = false) => setNotice({ teks, error })

  function terapkanFilter(nilai) {
    setFilter(nilai)
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
      items.forEach((a) => (centang ? n.add(a.id) : n.delete(a.id)))
      return n
    })
  }

  function simpan(agenda) {
    if (agenda.id) {
      setData((d) => d.map((a) => (a.id === agenda.id ? agenda : a)))
      info('Agenda berhasil diperbarui.')
    } else {
      setData((d) => [{ ...agenda, id: Date.now() }, ...d])
      info('Agenda baru berhasil ditambahkan.')
    }
    setModal(null)
  }

  function hapus(a) {
    if (!window.confirm(`Hapus agenda "${a.judul}"?`)) return
    setData((d) => d.filter((x) => x.id !== a.id))
    setTerpilih((s) => {
      const n = new Set(s)
      n.delete(a.id)
      return n
    })
    info('Agenda dihapus.')
  }

  function hapusTerpilih() {
    if (!window.confirm(`Hapus ${terpilih.size} agenda yang dipilih?`)) return
    setData((d) => d.filter((a) => !terpilih.has(a.id)))
    info(`${terpilih.size} agenda dihapus.`)
    setTerpilih(new Set())
  }

  function eksporIcs() {
    if (hasil.length === 0) return info('Tidak ada agenda untuk diekspor. Ubah filter terlebih dulu.', true)
    unduh('agenda-sma-harapan-jaya.ics', buildIcs(hasil), 'text/calendar;charset=utf-8')
    info(`${hasil.length} agenda diekspor ke file .ics.`)
  }

  // TODO: sambungkan ke backend (Google Calendar API / WA Gateway).
  const belumTerhubung = (nama) => info(`${nama} belum terhubung ke backend.`, true)
  const broadcast = () => window.confirm('Kirim notifikasi broadcast ke wali murid?') && belumTerhubung('Notifikasi broadcast')

  const tombolLuar =
    'inline-flex items-center gap-2 rounded-xl border border-secondary px-4 py-2.5 font-semibold text-secondary transition-colors hover:bg-secondary-container/30'

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <AgendaStats stats={stats} />

      <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <h2 className="text-headline-sm font-bold text-primary">Daftar Agenda Akademik & Aktivitas Civitas</h2>
            <p className="mt-1 text-text-muted">Kelola kalender ujian, rapat dinas, ekstrakurikuler, dan peringatan hari besar sekolah.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => belumTerhubung('Sinkronisasi Google Calendar')} className={tombolLuar}>
              <Icon name="sync" /> Sinkronisasi Google Calendar
            </button>
            <button onClick={eksporIcs} className={tombolLuar}>
              <Icon name="download" /> Ekspor Kalender (.ICS)
            </button>
            <button
              onClick={() => setModal({ item: null })}
              className="inline-flex items-center gap-2 rounded-xl bg-cta-gold px-4 py-2.5 font-bold text-primary shadow-sm hover:brightness-95"
            >
              <Icon name="add_circle" /> Tambah Agenda Baru
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-border-muted pt-6">
          <AgendaFilters nilai={filter} onTerapkan={terapkanFilter} />
        </div>
      </section>

      {notice && (
        <p
          role="status"
          className={`rounded-xl px-4 py-3 text-sm font-medium ${notice.error ? 'bg-error-container text-on-error-container' : 'bg-secondary-container/60 text-secondary-dark'}`}
        >
          {notice.teks}
        </p>
      )}

      {terpilih.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-muted bg-surface-white px-4 py-3 text-sm shadow-sm">
          <span className="font-semibold text-primary">{terpilih.size} agenda dipilih</span>
          <span className="flex gap-2">
            <button onClick={() => setTerpilih(new Set())} className="rounded-lg border border-border-muted px-3 py-1.5 font-semibold text-primary hover:bg-surface-light">
              Batalkan pilihan
            </button>
            <button onClick={hapusTerpilih} className="rounded-lg bg-error px-3 py-1.5 font-semibold text-white hover:opacity-90">
              Hapus terpilih
            </button>
          </span>
        </div>
      )}

      <AgendaTable
        items={items}
        total={hasil.length}
        halaman={halamanAman}
        jumlahHalaman={jumlahHalaman}
        perHalaman={PER_HALAMAN}
        onHalaman={(n) => setHalaman(Math.min(Math.max(1, n), jumlahHalaman))}
        terpilih={terpilih}
        onPilih={pilih}
        onPilihSemua={pilihSemua}
        onEdit={(item) => setModal({ item })}
        onHapus={hapus}
      />

      <AgendaSyncBanner onBroadcast={broadcast} />

      {modal && <AgendaFormModal item={modal.item} onSimpan={simpan} onTutup={() => setModal(null)} />}
    </div>
  )
}
