import { Link } from 'react-router-dom'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon'
import Avatar from '@/components/ui/Avatar'
import ChipKategori from '@/components/berita/ChipKategori'
import BadgeStatus from '@/components/berita/BadgeStatus'
import { formatTanggal } from '@/utils/tanggal'

// Satu baris artikel. Bentuk `artikel` mengikuti mocks/adminBerita.js (posts + penulis).
export default function BeritaRow({ artikel: a, dipilih, onPilih, onHapus }) {
  return (
    <tr className={clsx('hover:bg-surface-light/80 transition-colors group', a.status === 'draf' && 'bg-amber-50/20')}>
      <td className="py-4 px-4 text-center">
        <input
          type="checkbox"
          aria-label={`Pilih artikel ${a.judul}`}
          className="rounded border-border-muted text-secondary focus:ring-secondary"
          checked={dipilih}
          onChange={() => onPilih(a.id)}
        />
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-border-muted flex items-center justify-center text-text-muted">
            {a.gambar ? (
              <img className="w-full h-full object-cover" src={a.gambar} alt="" loading="lazy" />
            ) : (
              <Icon name="image" className="text-[22px]" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">
              {a.disematkan && (
                <Icon name="push_pin" title="Disematkan di Beranda" className="text-[14px] text-amber-600 mr-1 align-[-2px]" />
              )}
              {a.judul}
            </h3>
            <p className="text-text-muted text-xs line-clamp-1 mt-0.5">{a.ringkasan}</p>
          </div>
        </div>
      </td>

      <td className="py-4 px-4">
        <ChipKategori nama={a.kategori} />
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <Avatar inisial={a.penulis.inisial} tone={a.penulis.tone} nama={a.penulis.nama} />
          <div className="leading-tight min-w-0">
            <p className="font-semibold text-xs text-on-surface">{a.penulis.nama}</p>
            <p className="text-[11px] text-text-muted truncate">{a.penulis.email}</p>
          </div>
        </div>
      </td>

      <td className="py-4 px-4">
        <div className="leading-tight">
          <p className="font-semibold text-xs text-on-surface">{formatTanggal(a.tanggal)}</p>
          <BadgeStatus status={a.status} />
        </div>
      </td>

      <td className="py-4 px-4 text-center">
        <div className="inline-flex items-center gap-1.5">
          <Link
            to={`/admin/berita/${a.id}/edit`}
            aria-label={`Edit artikel ${a.judul}`}
            title="Edit Artikel"
            className="p-1.5 text-secondary hover:bg-secondary/10 rounded-md transition-colors"
          >
            <Icon name="edit" className="text-[18px]" />
          </Link>
          <button
            type="button"
            aria-label={`Hapus artikel ${a.judul}`}
            title="Hapus Artikel"
            onClick={() => onHapus(a)}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <Icon name="delete" className="text-[18px]" />
          </button>
          <a
            href={`/berita/${a.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Lihat artikel ${a.judul} di portal`}
            title="Lihat di Portal"
            className="p-1.5 text-text-muted hover:text-primary hover:bg-surface-light rounded-md transition-colors"
          >
            <Icon name="visibility" className="text-[18px]" />
          </a>
        </div>
      </td>
    </tr>
  )
}
