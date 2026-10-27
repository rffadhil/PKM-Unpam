import Pagination from '@/components/admin/Pagination'
import DokumenFilter from '@/components/dokumen/DokumenFilter'
import DokumenRow from '@/components/dokumen/DokumenRow'

const th = 'p-4 text-xs font-bold uppercase tracking-wider text-text-muted'

// Kartu "Daftar Template Unduhan Aktif": judul, filter, tabel, paginasi.
export default function DokumenTable({
  items, total, totalSemua, halaman, jumlahHalaman, perHalaman,
  filter, onFilter, onMuat, onHalaman, onLihat, onEdit, onHapus,
}) {
  const awal = total === 0 ? 0 : (halaman - 1) * perHalaman + 1
  const akhir = Math.min(halaman * perHalaman, total)

  return (
    <section className="overflow-hidden rounded-2xl border border-border-muted bg-surface-white shadow-sm">
      <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-primary">
            Daftar Template Unduhan Aktif{' '}
            <span className="text-body-sm font-normal text-text-muted">({totalSemua} Berkas Tersimpan)</span>
          </h2>
          <p className="text-body-sm text-text-muted">
            Kelola izin visibilitas, pelacakan jumlah unduh, dan pembaharuan revisi berkas
          </p>
        </div>
        <DokumenFilter nilai={filter} onUbah={onFilter} onMuat={onMuat} />
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full min-w-[980px] border-collapse text-left">
          <thead>
            <tr className="border-y border-border-muted bg-surface-light/70">
              <th scope="col" className={th}>Nama &amp; Format Dokumen</th>
              <th scope="col" className={th}>Kategori Portal SIS</th>
              <th scope="col" className={th}>Ukuran &amp; Versi</th>
              <th scope="col" className={th}>Pengunggah &amp; Tanggal</th>
              <th scope="col" className={th}>Status Publikasi</th>
              <th scope="col" className={`${th} text-right`}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-muted">
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-text-muted">
                  Belum ada dokumen yang cocok. Ubah filter atau unggah template baru.
                </td>
              </tr>
            ) : (
              items.map((d) => <DokumenRow key={d.id} dok={d} onLihat={onLihat} onEdit={onEdit} onHapus={onHapus} />)
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
        satuan="template unduhan"
      />
    </section>
  )
}
