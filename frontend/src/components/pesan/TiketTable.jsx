import Icon from '@/components/ui/Icon'
import PaginasiNav from '@/components/ui/PaginasiNav'
import { KATEGORI_MAP, STATUS_PESAN } from '@/config/pesan'
import { formatWaktuMasuk } from '@/utils/pesan'

const th = 'p-4 text-xs font-bold uppercase tracking-wider text-text-muted'

function Baris({ t, aktif, dipilih, onAktif, onPilih }) {
  const kat = KATEGORI_MAP[t.kategori]
  const st = STATUS_PESAN[t.status]
  const w = formatWaktuMasuk(t.waktuMasuk)
  return (
    <tr
      onClick={() => onAktif(t.id)}
      aria-current={aktif ? 'true' : undefined}
      className={`cursor-pointer align-top transition-colors ${aktif ? 'border-l-4 border-l-amber-500 bg-amber-50/60' : 'border-l-4 border-l-transparent hover:bg-surface-light/60'}`}
    >
      <td className="p-4" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={dipilih} onChange={() => onPilih(t.id)} aria-label={`Pilih tiket ${t.nomor}`} className="mt-1 h-4 w-4 rounded border-border-muted text-primary focus:ring-secondary" />
      </td>
      <td className="p-4">
        <button type="button" onClick={() => onAktif(t.id)} className="text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary">
          <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
            {!t.dibaca && <span className="h-2 w-2 rounded-full bg-error" title="Belum dibaca" aria-label="Belum dibaca" />}#{t.nomor}
          </span>
          {t.anonim ? (
            <>
              <span className="mt-0.5 flex items-center gap-1 font-bold text-indigo-700"><Icon name="lock" className="text-[16px]" /> Anonim Terproteksi</span>
              <span className="font-mono text-xs italic text-indigo-600">Kanal Enkripsi SHA-256</span>
            </>
          ) : (
            <>
              <span className="mt-0.5 block font-bold text-primary">{t.pengirim}</span>
              {t.email && <span className="flex items-center gap-1 text-xs text-text-muted"><Icon name="mail" className="text-[14px]" /> {t.email}</span>}
              {t.whatsapp && <span className="flex items-center gap-1 text-xs text-text-muted"><Icon name="call" className="text-[14px]" /> {t.whatsapp}</span>}
              {!t.email && !t.whatsapp && <span className="text-xs text-text-muted">{t.satuan}</span>}
              {(t.email || t.whatsapp) && t.satuan && <span className="block text-xs text-text-muted">{t.satuan}</span>}
            </>
          )}
        </button>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-start gap-1.5 rounded-lg border px-3 py-2 text-sm leading-tight ${kat.chip}`}>
          <Icon name={kat.ikon} className="mt-0.5 text-[16px]" /> {kat.label}
        </span>
      </td>
      <td className="max-w-[16rem] p-4">
        <p className={`line-clamp-1 text-primary ${t.dibaca ? 'font-semibold' : 'font-bold'}`}>{t.subjek}</p>
        <p className="mt-1 line-clamp-2 text-sm text-text-muted">{t.isi}</p>
      </td>
      <td className="whitespace-nowrap p-4 text-sm">
        <p className="font-medium text-primary">{w.tanggal}</p>
        <p className="text-text-muted">{w.jam}</p>
      </td>
      <td className="p-4">
        <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${st.badge}`}>
          <span className={`h-2 w-2 rounded-full ${st.dot}`} /> {st.label}
        </span>
      </td>
    </tr>
  )
}

export default function TiketTable({ items, total, halaman, jumlahHalaman, perHalaman, onHalaman, aktifId, onAktif, terpilih, onPilih, onPilihSemua, onTandaiSemuaDibaca }) {
  const semuaDipilih = items.length > 0 && items.every((t) => terpilih.has(t.id))
  const awal = total === 0 ? 0 : (halaman - 1) * perHalaman + 1
  const akhir = Math.min(halaman * perHalaman, total)

  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 p-6">
        <h2 className="flex flex-wrap items-center gap-3 text-headline-sm font-bold text-primary">
          Daftar Tiket & Pesan Masuk Terkini
          <span className="rounded-full bg-surface-container px-3 py-1 text-xs font-bold text-on-surface-variant">{items.length} Ditampilkan</span>
        </h2>
        <p className="text-sm text-text-muted">
          Pilihan Cepat: <button onClick={onTandaiSemuaDibaca} className="font-bold text-secondary hover:underline">Tandai Semua Dibaca</button>
        </p>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border-muted bg-surface-light/70">
              <th className="w-12 p-4">
                <input type="checkbox" checked={semuaDipilih} onChange={(e) => onPilihSemua(e.target.checked)} aria-label="Pilih semua tiket di halaman ini" className="h-4 w-4 rounded border-border-muted text-primary focus:ring-secondary" />
              </th>
              <th className={th}>No. Tiket & Pengirim</th>
              <th className={th}>Kategori Layanan</th>
              <th className={th}>Subjek & Intisari Pesan</th>
              <th className={th}>Waktu Masuk</th>
              <th className={th}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {items.length === 0 ? (
              <tr><td colSpan={6} className="p-10 text-center text-text-muted">Tidak ada tiket yang cocok. Ubah filter atau catat pesan baru.</td></tr>
            ) : (
              items.map((t) => <Baris key={t.id} t={t} aktif={t.id === aktifId} dipilih={terpilih.has(t.id)} onAktif={onAktif} onPilih={onPilih} />)
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border-muted bg-surface-light/50 px-6 py-4 text-sm text-text-muted">
        <p>Menampilkan <strong className="text-primary">{awal} - {akhir}</strong> dari <strong className="text-primary">{total}</strong> total tiket</p>
        <PaginasiNav halaman={halaman} jumlahHalaman={jumlahHalaman} onHalaman={onHalaman} label="Halaman tiket" />
      </div>
    </section>
  )
}
