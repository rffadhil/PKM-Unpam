/** @format */

import BagianPengaturan from "@/components/pengaturan/BagianPengaturan";
import BarisSaklar from "@/components/pengaturan/BarisSaklar";
import FieldPengaturan from "@/components/pengaturan/FieldPengaturan";

// Bagian "Mode Pemeliharaan & Status Portal".
export default function PortalStatusPanel({ nilai, error = {}, onUbah }) {
  return (
    <BagianPengaturan
      ikon="toggle_on"
      judul="Mode Pemeliharaan & Status Portal"
      subjudul="Kontrol status publikasi modul krusial portal web publik secara waktu-nyata (real-time)"
    >
      <div className="space-y-4">
        <BarisSaklar
          ikon="build"
          judul="Mode Pemeliharaan (Maintenance Mode)"
          deskripsi="Bila diaktifkan, halaman publik akan digantikan oleh halaman statis pemberitahuan pemeliharaan server. Akses CMS Admin tetap dapat dibuka."
          aktif={nilai.maintenance}
          onUbah={(v) => onUbah("maintenance", v)}
        />
        <BarisSaklar
          ikon="how_to_reg"
          judul="Izinkan Pendaftaran PPDB Online 2026/2027"
          deskripsi="Menampilkan tombol CTA emas “Daftar PPDB” di bilah menu navigasi teratas portal publik dan membuka formulir registrasi online peserta didik baru."
          aktif={nilai.ppdb}
          onUbah={(v) => onUbah("ppdb", v)}
          sorotSaatAktif
        />
        <div className="rounded-xl border border-border-muted bg-surface-light/50 p-4">
          <FieldPengaturan
            id="set-ppdb-link"
            type="url"
            label="Tautan Google Form Pendaftaran PPDB"
            placeholder="https://forms.gle/..."
            value={nilai.ppdbLink ?? ""}
            onChange={(e) => onUbah("ppdbLink", e.target.value)}
            error={error.ppdbLink}
            bantuan="Tautan eksternal formulir pendaftaran calon peserta didik baru yang dituju oleh tombol daftar di halaman publik /ppdb."
          />
        </div>
      </div>
    </BagianPengaturan>
  );
}
