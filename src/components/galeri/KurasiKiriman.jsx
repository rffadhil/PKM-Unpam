import Icon from '@/components/ui/Icon'
import { formatMasuk, formatUkuran } from '@/utils/galeri'

const th = 'p-4 text-xs font-bold uppercase tracking-wider text-text-muted'

// Kotak masuk kurasi: kiriman foto dari siswa/guru yang menunggu disetujui staf IT.
export default function KurasiKiriman({ items, onSetujui, onTolak, onSinkron }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 p-6">
        <div className="flex items-start gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-red-50 text-error">
            <Icon name="drive_folder_upload" className="text-[24px]" />
          </span>
          <div>
            <h2 className="flex flex-wrap items-center gap-3 text-headline-sm font-bold text-primary">
              Kotak Masuk Kurasi Foto Civitas
              <span className="rounded-full bg-error px-3 py-0.5 text-xs font-bold text-white">PU-05 ({items.length} Draft Menunggu)</span>
            </h2>
            <p className="mt-1 text-sm text-text-muted">Pengajuan dokumentasi langsung dari siswa, dewan guru, dan ekstrakurikuler melalui portal publikasi.</p>
          </div>
        </div>
        <button onClick={onSinkron} className="inline-flex items-center gap-2 font-semibold text-secondary hover:underline">
          <Icon name="sync" /> Sinkronkan Kiriman
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border-muted bg-surface-light/70">
              <th className={th}>Judul Pengajuan Kegiatan</th>
              <th className={th}>Pengirim / Satuan</th>
              <th className={th}>Jumlah Berkas</th>
              <th className={th}>Ukuran File</th>
              <th className={th}>Tanggal Masuk</th>
              <th className={`${th} text-right`}>Aksi Kurasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-text-muted">
                  Tidak ada kiriman yang menunggu kurasi.
                </td>
              </tr>
            ) : (
              items.map((k) => (
                <tr key={k.id} className="align-top">
                  <td className="max-w-xs p-4">
                    <p className="font-semibold text-primary">{k.judul}</p>
                    <p className="mt-1 text-xs text-text-muted">Kategori Disarankan: {k.kategoriDisarankan}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-primary">{k.pengirim}</p>
                    <p className="mt-1 text-xs text-text-muted">{k.satuan}</p>
                  </td>
                  <td className="p-4 font-semibold text-primary">
                    {k.jumlahFoto} Foto{k.jenis ? ` (${k.jenis})` : ''}
                  </td>
                  <td className="p-4 text-text-muted">{formatUkuran(k.ukuranMB)}</td>
                  <td className="p-4 text-text-muted">{formatMasuk(k.masuk)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onSetujui(k)} className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-4 py-2.5 text-left text-sm font-semibold leading-tight text-white hover:bg-primary">
                        <Icon name="check" className="text-[18px]" /> Setuju &amp; Publikasikan
                      </button>
                      <button onClick={() => onTolak(k)} aria-label={`Tolak kiriman ${k.judul}`} title="Tolak" className="rounded-lg p-2 text-text-muted hover:bg-error/10 hover:text-error">
                        <Icon name="close" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
