import BeritaRow from '@/components/berita/BeritaRow'

// Tabel artikel (hanya tampilan). Semua state pilihan & hapus dipegang halaman.
export default function BeritaTable({ baris, terpilih, semuaDipilih, sebagianDipilih, onPilihSemua, onPilih, onHapus }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left border-collapse">
        <thead>
          <tr className="bg-surface-light border-b border-border-muted text-on-surface font-label-lg text-label-lg">
            <th scope="col" className="py-3.5 px-4 w-12 text-center">
              <input
                type="checkbox"
                aria-label="Pilih semua artikel di halaman ini"
                className="rounded border-border-muted text-secondary focus:ring-secondary"
                checked={semuaDipilih}
                ref={(el) => {
                  if (el) el.indeterminate = sebagianDipilih
                }}
                onChange={onPilihSemua}
              />
            </th>
            <th scope="col" className="py-3.5 px-4">Judul Artikel &amp; Cuplikan</th>
            <th scope="col" className="py-3.5 px-4 w-44">Kategori</th>
            <th scope="col" className="py-3.5 px-4 w-48">Penulis</th>
            <th scope="col" className="py-3.5 px-4 w-36">Tanggal &amp; Status</th>
            <th scope="col" className="py-3.5 px-4 w-36 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-muted font-body-sm text-body-sm bg-surface-white">
          {baris.length === 0 && (
            <tr>
              <td colSpan={6} className="py-12 px-4 text-center text-text-muted">
                Tidak ada artikel yang cocok dengan filter atau pencarian.
              </td>
            </tr>
          )}
          {baris.map((a) => (
            <BeritaRow key={a.id} artikel={a} dipilih={terpilih.has(a.id)} onPilih={onPilih} onHapus={onHapus} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
