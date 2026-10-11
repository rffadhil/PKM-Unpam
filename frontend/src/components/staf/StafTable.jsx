import Icon from '@/components/ui/Icon'
import { BADGE_KEPEGAWAIAN, LENCANA_JABATAN } from '@/config/staf'
import { formatNomorInduk, inisial, jenisNomor, labelKepegawaian } from '@/utils/staf'
import { rentangHalaman } from '@/utils/halaman'

const th = 'p-4 text-xs font-bold uppercase tracking-wider text-text-muted'

function Avatar({ p }) {
  return p.foto ? (
    <img src={p.foto} alt={`Foto ${p.nama}`} className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-secondary" />
  ) : (
    <span aria-hidden className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-secondary-container text-sm font-bold text-secondary-dark ring-2 ring-secondary">
      {inisial(p.nama)}
    </span>
  )
}

function Toggle({ aktif, onUbah, nama }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        role="switch"
        aria-checked={aktif}
        aria-label={`Tampilkan ${nama} di halaman publik`}
        onClick={onUbah}
        className={`relative h-7 w-12 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${aktif ? 'bg-secondary' : 'bg-border-muted'}`}
      >
        <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${aktif ? 'left-[1.4rem]' : 'left-0.5'}`} />
      </button>
      <span className={`text-xs font-semibold ${aktif ? 'text-secondary' : 'text-text-muted'}`}>{aktif ? 'Aktif Publik' : 'Disembunyikan'}</span>
    </div>
  )
}

function Baris({ p, dipilih, onPilih, onEdit, onHapus, onToggle }) {
  return (
    <tr className="align-middle transition-colors hover:bg-surface-light/60">
      <td className="p-4">
        <input type="checkbox" checked={dipilih} onChange={() => onPilih(p.id)} aria-label={`Pilih ${p.nama}`} className="h-4 w-4 rounded border-border-muted text-primary focus:ring-secondary" />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Avatar p={p} />
          <div className="min-w-0">
            <p className="font-title-md text-title-md font-bold text-primary">{p.nama}</p>
            <p className="mt-0.5 font-mono text-xs text-text-muted">
              {jenisNomor(p)}. {formatNomorInduk(p.nomorInduk)}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className={`inline-block rounded px-2.5 py-1 text-xs font-bold ${LENCANA_JABATAN[p.lencana] ?? LENCANA_JABATAN.guru}`}>{p.jabatan}</span>
        <p className="mt-1.5 text-sm text-text-muted">{p.bidang}</p>
      </td>
      <td className="p-4">
        <p className="font-medium text-primary">{p.pendidikan}</p>
        <p className="mt-0.5 text-sm text-text-muted">{p.institusi}</p>
      </td>
      <td className="p-4">
        <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${BADGE_KEPEGAWAIAN[p.statusKepegawaian] ?? ''}`}>{labelKepegawaian(p)}</span>
      </td>
      <td className="p-4">
        <Toggle aktif={p.tampilPublik} onUbah={() => onToggle(p.id)} nama={p.nama} />
      </td>
      <td className="p-4">
        <div className="flex items-center justify-center gap-1">
          <button onClick={() => onEdit(p)} title="Edit" aria-label={`Edit ${p.nama}`} className="rounded-lg p-2 text-secondary hover:bg-secondary/10">
            <Icon name="edit" />
          </button>
          <a href="/profil" target="_blank" rel="noreferrer" title="Lihat di portal publik" aria-label={`Lihat ${p.nama} di portal publik`} className="rounded-lg p-2 text-text-muted hover:bg-surface-container">
            <Icon name="visibility" />
          </a>
          <button onClick={() => onHapus(p)} title="Hapus" aria-label={`Hapus ${p.nama}`} className="rounded-lg p-2 text-error hover:bg-error/10">
            <Icon name="delete" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function StafTable({ items, total, totalSemua, halaman, jumlahHalaman, perHalaman, onHalaman, terpilih, onPilih, onPilihSemua, onEdit, onHapus, onToggle }) {
  const semuaDipilih = items.length > 0 && items.every((p) => terpilih.has(p.id))
  const awal = total === 0 ? 0 : (halaman - 1) * perHalaman + 1
  const akhir = Math.min(halaman * perHalaman, total)
  const tombol = 'grid min-w-9 place-items-center rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors'

  return (
    <section className="overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-muted p-6">
        <h2 className="flex flex-wrap items-center gap-3 text-headline-sm font-bold text-primary">
          Daftar Tenaga Pendidik & Civitas Akademika
          <span className="rounded-full bg-secondary-container/70 px-3 py-1 text-xs font-bold text-secondary-dark">Terverifikasi {totalSemua} PTK</span>
        </h2>
        <p className="text-sm text-text-muted">
          Urutkan: <strong className="text-primary">Struktur Tertinggi & NIP</strong>
        </p>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[1000px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border-muted bg-surface-light/70">
              <th className="w-12 p-4">
                <input type="checkbox" checked={semuaDipilih} onChange={(e) => onPilihSemua(e.target.checked)} aria-label="Pilih semua staf di halaman ini" className="h-4 w-4 rounded border-border-muted text-primary focus:ring-secondary" />
              </th>
              <th className={th}>Nama Lengkap & NIP/NUPTK</th>
              <th className={th}>Rumpun / Jabatan</th>
              <th className={th}>Pendidikan Terakhir</th>
              <th className={th}>Kepegawaian</th>
              <th className={`${th} text-center`}>Tampil Publik</th>
              <th className={`${th} text-center`}>Aksi Manajemen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-text-muted">
                  Tidak ada staf yang cocok. Ubah filter atau tambah staf baru.
                </td>
              </tr>
            ) : (
              items.map((p) => <Baris key={p.id} p={p} dipilih={terpilih.has(p.id)} onPilih={onPilih} onEdit={onEdit} onHapus={onHapus} onToggle={onToggle} />)
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-muted bg-surface-light/50 px-6 py-4 text-sm text-text-muted">
        <p>
          Menampilkan {awal} - {akhir} dari {total} Civitas Pendidik & Staf
        </p>
        <nav aria-label="Halaman staf" className="flex flex-wrap items-center gap-1.5">
          <button onClick={() => onHalaman(halaman - 1)} disabled={halaman <= 1} className={`${tombol} border-border-muted bg-surface-white text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:text-text-muted/60`}>
            Sebelumnya
          </button>
          {rentangHalaman(halaman, jumlahHalaman).map((n, i) =>
            n === '…' ? (
              <span key={`e${i}`} aria-hidden className="px-1">…</span>
            ) : (
              <button key={n} onClick={() => onHalaman(n)} aria-current={n === halaman ? 'page' : undefined} className={`${tombol} ${n === halaman ? 'border-primary bg-primary text-white' : 'border-border-muted bg-surface-white text-primary hover:bg-surface-light'}`}>
                {n}
              </button>
            ),
          )}
          <button onClick={() => onHalaman(halaman + 1)} disabled={halaman >= jumlahHalaman} className={`${tombol} border-border-muted bg-surface-white text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:text-text-muted/60`}>
            Selanjutnya
          </button>
        </nav>
      </div>
    </section>
  )
}
