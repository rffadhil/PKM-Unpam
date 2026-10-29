import BagianPengaturan from '@/components/pengaturan/BagianPengaturan'
import AdminRow from '@/components/pengaturan/AdminRow'
import Icon from '@/components/ui/Icon'

const th = 'p-4 text-xs font-bold uppercase tracking-wider text-text-muted'

// Bagian "Manajemen Admin & Hak Akses" (khusus Super Admin).
export default function AdminAksesPanel({ daftar, idSaya, onTambah, onEdit, onHapus }) {
  const superAktif = daftar.filter((a) => a.role === 'superadmin' && a.aktif).length

  function alasan(a) {
    if (a.id === idSaya) return 'Akun yang sedang dipakai tidak bisa dihapus'
    if (a.role === 'superadmin' && a.aktif && superAktif <= 1) return 'Super Admin aktif terakhir tidak bisa dihapus'
    return ''
  }

  return (
    <BagianPengaturan
      ikon="admin_panel_settings"
      judul="Manajemen Admin & Hak Akses"
      subjudul="Kelola wewenang, kredensial administrator, dan matriks hak akses CMS portal sekolah"
      aksi={
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-fixed-variant">
            {daftar.length} Pengguna Terdaftar
          </span>
          <button
            type="button"
            onClick={onTambah}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-container px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primary"
          >
            <Icon name="add" className="text-[18px]" />
            Tambah Admin Baru
          </button>
        </div>
      }
    >
      <div className="overflow-hidden rounded-xl border border-border-muted">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-muted bg-surface-light/70">
                <th scope="col" className={th}>Nama &amp; NIP / NUPTK</th>
                <th scope="col" className={th}>Email</th>
                <th scope="col" className={th}>Peran / Role (RBAC)</th>
                <th scope="col" className={th}>Status</th>
                <th scope="col" className={`${th} text-right`}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted">
              {daftar.map((a) => (
                <AdminRow key={a.id} admin={a} saya={a.id === idSaya} alasanTerkunci={alasan(a)} onEdit={onEdit} onHapus={onHapus} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BagianPengaturan>
  )
}
