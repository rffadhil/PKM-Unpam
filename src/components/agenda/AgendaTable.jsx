import Pagination from '@/components/admin/Pagination'
import AgendaRow from '@/components/agenda/AgendaRow'

const th = 'p-4 text-xs font-bold uppercase tracking-wider text-text-muted'

// Tabel agenda + paginasi. Semua state (halaman, hapus, edit) dipegang halaman.
export default function AgendaTable({ items, total, halaman, jumlahHalaman, perHalaman, onHalaman, onEdit, onHapus }) {
  const awal = total === 0 ? 0 : (halaman - 1) * perHalaman + 1
  const akhir = Math.min(halaman * perHalaman, total)

  return (
    <section className="overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-muted bg-surface-light/70">
              <th scope="col" className={th}>Tanggal &amp; Waktu</th>
              <th scope="col" className={th}>Nama Agenda &amp; Deskripsi Singkat</th>
              <th scope="col" className={th}>Penyelenggara / PIC</th>
              <th scope="col" className={`${th} text-right`}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-text-muted">
                  Belum ada agenda yang cocok. Ubah filter atau tambah agenda baru.
                </td>
              </tr>
            ) : (
              items.map((a) => <AgendaRow key={a.id} agenda={a} onEdit={onEdit} onHapus={onHapus} />)
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        halaman={halaman}
        totalHalaman={jumlahHalaman}
        onUbah={onHalaman}
        dari={awal}
        sampai={akhir}
        total={total}
        satuan="agenda terdaftar"
      />
    </section>
  )
}
