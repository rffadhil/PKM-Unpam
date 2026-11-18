/** @format */

import BagianPengaturan from "@/components/pengaturan/BagianPengaturan";
import BarisSaklar from "@/components/pengaturan/BarisSaklar";

// Bagian mode pemeliharaan portal.
export default function PortalStatusPanel({ nilai, onUbah }) {
  return (
    <BagianPengaturan
      ikon="toggle_on"
      judul="Mode Pemeliharaan"
      subjudul="Kontrol akses halaman publik saat portal sedang dalam pemeliharaan."
    >
      <BarisSaklar
        ikon="build"
        judul="Mode Pemeliharaan (Maintenance Mode)"
        deskripsi="Bila diaktifkan, halaman publik akan digantikan oleh halaman statis pemberitahuan pemeliharaan server. Akses CMS Admin tetap dapat dibuka."
        aktif={nilai.maintenance}
        onUbah={(v) => onUbah("maintenance", v)}
      />
    </BagianPengaturan>
  );
}
