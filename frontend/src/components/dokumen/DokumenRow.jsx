import Icon from '@/components/ui/Icon'
import IkonBerkas from '@/components/dokumen/IkonBerkas'
import StatusDokumenBadge from '@/components/dokumen/StatusDokumenBadge'
import { formatUkuran, formatWaktuUnggah } from '@/utils/dokumen'

const tombolIkon = 'rounded-lg p-2 text-text-muted transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary'

// Satu baris dokumen pada tabel.
export default function DokumenRow({ dok, onLihat, onEdit, onHapus }) {
  const namaBerkas = `${dok.nama}.${dok.tipe}`
  return (
    <tr className="align-middle transition-colors hover:bg-surface-light/60">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <IkonBerkas tipe={dok.tipe} />
          <div className="min-w-0">
            <p className="font-bold leading-snug text-primary">{namaBerkas}</p>
            <p className="mt-0.5 line-clamp-2 text-body-sm text-text-muted">{dok.deskripsi}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className="inline-block rounded-full bg-surface-container px-3 py-1.5 text-xs font-semibold leading-tight text-primary">
          {dok.kategori}
        </span>
      </td>
      <td className="p-4 text-body-sm">
        <p className="font-semibold text-on-surface">{formatUkuran(dok.ukuranBytes)}</p>
        <p className="text-text-muted">{dok.versi}</p>
      </td>
      <td className="p-4 text-body-sm">
        <p className="font-medium text-on-surface">{dok.pengunggah}</p>
        <p className="text-text-muted">{formatWaktuUnggah(dok.diunggah)}</p>
      </td>
      <td className="p-4">
        <StatusDokumenBadge aktif={dok.aktif} />
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-0.5">
          <button type="button" onClick={() => onLihat(dok)} aria-label={`Lihat detail ${namaBerkas}`} className={`${tombolIkon} hover:bg-surface-container hover:text-primary`}>
            <Icon name="visibility" className="text-[20px]" />
          </button>
          <button type="button" onClick={() => onEdit(dok)} aria-label={`Edit ${namaBerkas}`} className={`${tombolIkon} hover:bg-secondary-container/50 hover:text-secondary`}>
            <Icon name="edit_note" className="text-[22px]" />
          </button>
          <button type="button" onClick={() => onHapus(dok)} aria-label={`Hapus ${namaBerkas}`} className={`${tombolIkon} hover:bg-error-container hover:text-error`}>
            <Icon name="delete" className="text-[20px]" />
          </button>
        </div>
      </td>
    </tr>
  )
}
