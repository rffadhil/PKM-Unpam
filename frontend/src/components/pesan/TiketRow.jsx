import Icon from '@/components/ui/Icon'
import PengirimCell from '@/components/pesan/PengirimCell'
import KategoriChip from '@/components/pesan/KategoriChip'
import { formatWaktuMasuk } from '@/utils/tiket'

// Satu baris tiket. Tiket belum dibaca diberi latar kuning dan garis oranye di kiri.
export default function TiketRow({ tiket, onTinjau }) {
  const waktu = formatWaktuMasuk(tiket.diterima)
  const belumDibaca = !tiket.dibaca
  return (
    <tr className={`align-middle transition-colors ${belumDibaca ? 'bg-amber-50/70' : 'hover:bg-surface-light/60'}`}>
      <td className={`w-1.5 p-0 ${belumDibaca ? 'bg-amber-500' : ''}`}>
        {belumDibaca && <span className="sr-only">Belum dibaca</span>}
      </td>
      <td className="p-4"><PengirimCell tiket={tiket} /></td>
      <td className="p-4"><KategoriChip kunci={tiket.kategori} /></td>
      <td className="max-w-[16rem] p-4">
        <p className={`text-primary ${belumDibaca ? 'font-bold' : 'font-semibold'}`}>{tiket.subjek}</p>
        <p className="line-clamp-2 text-body-sm text-text-muted">{tiket.pesan}</p>
      </td>
      <td className="whitespace-nowrap p-4 text-body-sm">
        <p className="font-medium text-on-surface">{waktu.tanggal}</p>
        <p className="text-text-muted">{waktu.jam}</p>
      </td>
      <td className="p-4">
        <button
          type="button"
          onClick={() => onTinjau(tiket)}
          aria-label={`Tinjau pesan dari ${tiket.anonim ? 'pelapor anonim' : tiket.nama}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Icon name="mark_email_read" className="text-[16px]" />
          Tinjau
        </button>
      </td>
    </tr>
  )
}
