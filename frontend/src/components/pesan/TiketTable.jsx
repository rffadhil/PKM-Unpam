
import Pagination from '@/components/admin/Pagination'
import TiketRow from '@/components/pesan/TiketRow'

const th = 'p-4 text-xs font-bold uppercase tracking-wider text-text-muted'

export default function TiketTable({
  items,
  total,
  halaman,
  jumlahHalaman,
  perHalaman,
  onHalaman,
  onTinjau,
}) {
  const awal = total === 0 ? 0 : (halaman - 1) * perHalaman + 1
  const akhir = Math.min(halaman * perHalaman, total)

  return (
    <section className="overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 px-6 py-5">
        <h2 className="text-lg font-bold text-primary">
          Daftar Tiket &amp; Pesan Masuk Terkini
        </h2>

        <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-bold text-primary">
          {items.length} Ditampilkan
        </span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[1100px] table-fixed border-collapse text-left">
          <colgroup>
            <col style={{ width: '6px' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr className="border-y border-border-muted bg-surface-light/70">
              <th scope="col" className="w-1.5 p-0">
                <span className="sr-only">Status baca</span>
              </th>

              <th scope="col" className={th}>Pengirim</th>
              <th scope="col" className={th}>Kategori Layanan</th>
              <th scope="col" className={th}>Subjek &amp; Intisari Pesan</th>
              <th scope="col" className={th}>Status</th>
              <th scope="col" className={th}>Waktu Masuk</th>
              <th scope="col" className={th}>Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-muted">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-text-muted">
                  Tidak ada tiket yang cocok. Ubah filter atau rentang tanggal.
                </td>
              </tr>
            ) : (
              items.map((t) => (
                <TiketRow
                  key={t.id}
                  tiket={t}
                  onTinjau={onTinjau}
                />
              ))
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
        satuan="total tiket"
      />
    </section>
  )
}
