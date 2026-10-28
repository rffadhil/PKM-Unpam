import BagianPengaturan from '@/components/pengaturan/BagianPengaturan'
import BarisSaklar from '@/components/pengaturan/BarisSaklar'

// Bagian "Mode Pemeliharaan & Status Portal".
export default function PortalStatusPanel({ nilai, onUbah }) {
  const pemeliharaan = nilai.maintenance
  return (
    <BagianPengaturan
      ikon="toggle_on"
      judul="Mode Pemeliharaan & Status Portal"
      subjudul="Kontrol status publikasi modul krusial portal web publik secara waktu-nyata (real-time)"
      aksi={
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${pemeliharaan ? 'bg-amber-100 text-amber-900' : 'bg-secondary-container text-on-secondary-fixed-variant'}`}>
          {pemeliharaan ? 'Mode Pemeliharaan Aktif' : 'Sistem Berjalan Normal'}
        </span>
      }
    >
      <div className="space-y-4">
        <BarisSaklar
          ikon="build"
          judul="Mode Pemeliharaan (Maintenance Mode)"
          deskripsi="Bila diaktifkan, halaman publik akan digantikan oleh halaman statis pemberitahuan pemeliharaan server. Akses CMS Admin tetap dapat dibuka."
          aktif={nilai.maintenance}
          onUbah={(v) => onUbah('maintenance', v)}
        />
        <BarisSaklar
          ikon="how_to_reg"
          judul="Izinkan Pendaftaran PPDB Online 2026/2027"
          deskripsi="Menampilkan tombol CTA emas “Daftar PPDB” di bilah menu navigasi teratas portal publik dan membuka formulir registrasi online peserta didik baru."
          aktif={nilai.ppdb}
          onUbah={(v) => onUbah('ppdb', v)}
          sorotSaatAktif
        />
      </div>
    </BagianPengaturan>
  )
}
