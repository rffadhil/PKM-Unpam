import AgendaWaktu from '@/components/agenda/AgendaWaktu'
import AgendaAksi from '@/components/agenda/AgendaAksi'

// Satu baris agenda. Bentuk `agenda`: lihat mocks/adminAgenda.js (mengikuti tabel `agenda`).
// Lokasi tidak ditampilkan di tabel (sesuai desain), tetapi tetap disimpan dan bisa diubah lewat form.
export default function AgendaRow({ agenda: a, onEdit, onHapus }) {
  return (
    <tr className="align-middle transition-colors hover:bg-surface-light/60">
      <td className="p-4">
        <AgendaWaktu mulai={a.tanggalMulai} selesai={a.tanggalSelesai} waktu={a.waktu} />
      </td>

      <td className="max-w-lg p-4">
        <p className="font-title-md text-title-md font-bold leading-snug text-primary">{a.judul}</p>
        <p className="mt-1 text-sm text-text-muted">{a.deskripsi}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-md border border-border-muted bg-surface-light px-2.5 py-1 font-bold text-primary">
            {a.kategori}
          </span>
          {a.catatan && <span className="text-text-muted">• {a.catatan}</span>}
        </div>
      </td>

      <td className="p-4">
        <p className="font-semibold text-primary">{a.penyelenggara}</p>
        <p className="mt-1 text-sm text-text-muted">{a.pic}</p>
      </td>

      <td className="p-4">
        <AgendaAksi agenda={a} onEdit={onEdit} onHapus={onHapus} />
      </td>
    </tr>
  )
}
