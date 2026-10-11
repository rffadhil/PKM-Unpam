import Icon from '@/components/ui/Icon'
import { STATUS_AGENDA } from '@/config/agenda'
import { bulanSingkat, formatRentang, hariAngka } from '@/utils/agenda'

const th = 'p-4 text-xs font-bold uppercase tracking-wider text-text-muted'

function StatusPill({ status }) {
  const s = STATUS_AGENDA[status]
  if (!s) return null
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${s.badge}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
    </span>
  )
}

function Baris({ a, dipilih, onPilih, onEdit, onHapus }) {
  return (
    <tr className="align-top transition-colors hover:bg-surface-light/60">
      <td className="p-4">
        <input
          type="checkbox"
          checked={dipilih}
          onChange={() => onPilih(a.id)}
          aria-label={`Pilih agenda ${a.judul}`}
          className="mt-4 h-4 w-4 rounded border-border-muted text-primary focus:ring-secondary"
        />
      </td>

      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-primary-container text-center leading-none">
            <span>
              <span className="block text-xs font-bold text-tertiary-fixed">{bulanSingkat(a.tanggalMulai)}</span>
              <span className="mt-0.5 block text-xl font-bold text-white">{hariAngka(a.tanggalMulai)}</span>
            </span>
          </div>
          <div className="min-w-[8.5rem]">
            <p className="font-semibold text-primary">{formatRentang(a.tanggalMulai, a.tanggalSelesai)}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-text-muted">
              <Icon name="schedule" className="text-[16px]" /> {a.waktu}
            </p>
          </div>
        </div>
      </td>

      <td className="max-w-md p-4">
        <p className="font-title-md text-title-md font-bold text-primary">{a.judul}</p>
        <p className="mt-1 text-sm text-text-muted">{a.deskripsi}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md border border-border-muted bg-surface-light px-2.5 py-1 font-bold text-primary">{a.kategori}</span>
          {a.catatan && <span className="text-text-muted">• {a.catatan}</span>}
        </div>
      </td>

      <td className="p-4">
        <p className="flex items-start gap-2 font-medium text-primary">
          <Icon name={a.ikonLokasi || 'location_on'} className="mt-0.5 text-[18px] text-secondary" /> {a.lokasi}
        </p>
        {a.lokasiDetail && <p className="mt-1 text-sm text-text-muted">{a.lokasiDetail}</p>}
      </td>

      <td className="p-4">
        <p className="font-semibold text-primary">{a.penyelenggara}</p>
        <p className="mt-1 text-sm text-text-muted">{a.pic}</p>
      </td>

      <td className="p-4">
        <StatusPill status={a.status} />
      </td>

      <td className="p-4">
        <div className="flex justify-end gap-1">
          <button onClick={() => onEdit(a)} title="Edit" aria-label={`Edit ${a.judul}`} className="rounded-lg p-2 text-text-muted transition-colors hover:bg-secondary/10 hover:text-secondary">
            <Icon name="edit" />
          </button>
          <button onClick={() => onHapus(a)} title="Hapus" aria-label={`Hapus ${a.judul}`} className="rounded-lg p-2 text-text-muted transition-colors hover:bg-error/10 hover:text-error">
            <Icon name="delete" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AgendaTable({
  items,
  total,
  halaman,
  jumlahHalaman,
  perHalaman,
  onHalaman,
  terpilih,
  onPilih,
  onPilihSemua,
  onEdit,
  onHapus,
}) {
  const semuaDipilih = items.length > 0 && items.every((a) => terpilih.has(a.id))
  const awal = total === 0 ? 0 : (halaman - 1) * perHalaman + 1
  const akhir = Math.min(halaman * perHalaman, total)
  const nomor = Array.from({ length: jumlahHalaman }, (_, i) => i + 1)
  const tombol = 'rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors'

  return (
    <section className="overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-muted bg-surface-light/70">
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={semuaDipilih}
                  onChange={(e) => onPilihSemua(e.target.checked)}
                  aria-label="Pilih semua agenda di halaman ini"
                  className="h-4 w-4 rounded border-border-muted text-primary focus:ring-secondary"
                />
              </th>
              <th className={th}>Tanggal & Waktu</th>
              <th className={th}>Nama Agenda & Deskripsi Singkat</th>
              <th className={th}>Lokasi / Ruangan</th>
              <th className={th}>Penyelenggara / PIC</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-text-muted">
                  Belum ada agenda yang cocok. Ubah filter atau tambah agenda baru.
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <Baris key={a.id} a={a} dipilih={terpilih.has(a.id)} onPilih={onPilih} onEdit={onEdit} onHapus={onHapus} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-muted bg-surface-light/50 px-5 py-4 text-sm text-text-muted">
        <p>
          Menampilkan {awal} - {akhir} dari {total} agenda terdaftar
        </p>
        <nav aria-label="Halaman agenda" className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onHalaman(halaman - 1)}
            disabled={halaman <= 1}
            className={`${tombol} border-border-muted bg-surface-white text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:text-text-muted/60`}
          >
            Sebelumnya
          </button>
          {nomor.map((n) => (
            <button
              key={n}
              onClick={() => onHalaman(n)}
              aria-current={n === halaman ? 'page' : undefined}
              className={`${tombol} ${n === halaman ? 'border-primary bg-primary text-white' : 'border-border-muted bg-surface-white text-primary hover:bg-surface-light'}`}
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => onHalaman(halaman + 1)}
            disabled={halaman >= jumlahHalaman}
            className={`${tombol} border-border-muted bg-surface-white text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:text-text-muted/60`}
          >
            Selanjutnya
          </button>
        </nav>
      </div>
    </section>
  )
}
