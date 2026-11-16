import { useEffect, useRef } from 'react'
import Pagination from '@/components/admin/Pagination'
import StafRow from '@/components/staf/StafRow'

const th = 'p-4 text-xs font-bold uppercase tracking-wider text-text-muted'

// Kartu daftar PTK: judul, tabel, paginasi. Semua state dipegang halaman.
export default function StafTable({
  items, total, totalTerverifikasi, halaman, jumlahHalaman, perHalaman,
  terpilih, onPilih, onPilihSemua, onHapusTerpilih,
  onHalaman, onTampil, onLihat, onEdit, onHapus,
}) {
  const awal = total === 0 ? 0 : (halaman - 1) * perHalaman + 1
  const akhir = Math.min(halaman * perHalaman, total)
  const semuaDipilih = items.length > 0 && items.every((s) => terpilih.includes(s.id))
  const sebagian = !semuaDipilih && items.some((s) => terpilih.includes(s.id))

  const kotakSemua = useRef(null)
  useEffect(() => {
    if (kotakSemua.current) kotakSemua.current.indeterminate = sebagian
  }, [sebagian])

  return (
    <section className="overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-primary">Daftar Tenaga Pendidik &amp; Civitas Akademika</h2>
          <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-fixed-variant">
            Terverifikasi {totalTerverifikasi} PTK
          </span>
        </div>
        {terpilih.length > 0 ? (
          <button
            type="button"
            onClick={onHapusTerpilih}
            className="rounded-lg bg-error-container px-3 py-1.5 text-sm font-bold text-on-error-container hover:opacity-90"
          >
            Hapus {terpilih.length} terpilih
          </button>
        ) : (
          <p className="text-body-sm text-text-muted">
            Urutkan: <span className="font-bold text-primary">Struktur Tertinggi &amp; NIP</span>
          </p>
        )}
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[1040px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border-muted bg-surface-light/70">
              <th scope="col" className="w-12 p-4" aria-label="Pilih" />
              <th scope="col" className={th}>Nama Lengkap &amp; NIP/NUPTK</th>
              <th scope="col" className={th}>Rumpun / Jabatan</th>
              <th scope="col" className={th}>Pendidikan Terakhir</th>
              <th scope="col" className={th}>Kepegawaian</th>
              <th scope="col" className={`${th} text-center`}>Tampil Publik</th>
              <th scope="col" className={`${th} text-right`}>Aksi Manajemen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-text-muted">
                  Tidak ada PTK yang cocok. Ubah filter atau tambah pendidik/staf baru.
                </td>
              </tr>
            ) : (
              items.map((s) => (
                <StafRow
                  key={s.id}
                  staf={s}
                  dipilih={terpilih.includes(s.id)}
                  onPilih={onPilih}
                  onTampil={onTampil}
                  onLihat={onLihat}
                  onEdit={onEdit}
                  onHapus={onHapus}
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
        satuan="Civitas Pendidik & Staf"
      />
    </section>
  )
}
