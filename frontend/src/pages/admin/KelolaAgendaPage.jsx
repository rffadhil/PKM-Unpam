import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import AgendaHeader from '@/components/agenda/AgendaHeader'
import AgendaFilters from '@/components/agenda/AgendaFilters'
import AgendaTable from '@/components/agenda/AgendaTable'
import AgendaFormModal from '@/components/agenda/AgendaFormModal'
import { mockAgenda } from '@/mocks/adminAgenda'
import { PERIODE_AKADEMIK } from '@/config/agenda'
import { saringAgenda, urutkanAgenda } from '@/utils/agenda'

const PER_HALAMAN = 5
const FILTER_AWAL = { kategori: '', status: '', periode: PERIODE_AKADEMIK[0], kata: '' }

// Manajemen Agenda: perakit layout + state. TODO: ganti state lokal dengan service ke API
// (GET/POST/PUT/DELETE /api/agenda), pola sama dengan hooks/useBerita.js.
export default function KelolaAgendaPage() {
  const { pencarian: cariTopbar = '' } = useOutletContext() ?? {}
  const [data, setData] = useState(mockAgenda)
  const [filter, setFilter] = useState(FILTER_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [modal, setModal] = useState(null) // { item } | null
  const [akanDihapus, setAkanDihapus] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4500)
    return () => clearTimeout(t)
  }, [notice])

  const hasil = useMemo(
    () => urutkanAgenda(saringAgenda(data, { ...filter, kata: filter.kata || cariTopbar })),
    [data, filter, cariTopbar],
  )
  const jumlahHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN))
  const halamanAman = Math.min(halaman, jumlahHalaman)
  const items = hasil.slice((halamanAman - 1) * PER_HALAMAN, halamanAman * PER_HALAMAN)

  function terapkanFilter(nilai) {
    setFilter(nilai)
    setHalaman(1)
  }

  function simpan(agenda) {
    if (agenda.id) {
      setData((d) => d.map((a) => (a.id === agenda.id ? agenda : a)))
      setNotice('Agenda berhasil diperbarui.')
    } else {
      setData((d) => [{ ...agenda, id: Date.now() }, ...d])
      setNotice('Agenda baru berhasil ditambahkan.')
    }
    setModal(null)
  }

  function konfirmasiHapus() {
    const { id } = akanDihapus
    setData((d) => d.filter((a) => a.id !== id))
    setAkanDihapus(null)
    setNotice('Agenda dihapus.')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
        <AgendaHeader onTambah={() => setModal({ item: null })} />
        <div className="mt-6 border-t border-border-muted pt-6">
          <AgendaFilters nilai={filter} onTerapkan={terapkanFilter} />
        </div>
      </section>

      {notice && (
        <p role="status" className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark">
          {notice}
        </p>
      )}

      <AgendaTable
        items={items}
        total={hasil.length}
        halaman={halamanAman}
        jumlahHalaman={jumlahHalaman}
        perHalaman={PER_HALAMAN}
        onHalaman={(n) => setHalaman(Math.min(Math.max(1, n), jumlahHalaman))}
        onEdit={(item) => setModal({ item })}
        onHapus={setAkanDihapus}
      />

      {modal && <AgendaFormModal item={modal.item} onSimpan={simpan} onTutup={() => setModal(null)} />}

      {akanDihapus && (
        <ConfirmDialog
          judul="Hapus agenda ini?"
          pesan={`“${akanDihapus.judul}” akan dihapus dan tidak tampil lagi di portal.`}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}
    </div>
  )
}
