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
          judul="Izinkan Pendaftaran PPDB Online"
          deskripsi="Mengaktifkan pendaftaran online PPDB dan tombol pendaftaran pada halaman publik."
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
        <div className="space-y-4 rounded-xl border border-border-muted bg-surface-light/50 p-4">
          <div>
            <h3 className="text-sm font-bold text-primary">Jadwal & pengumuman PPDB</h3>
            <p className="mt-1 text-xs text-text-muted">
              Banner tampil mulai tanggal tayang sampai pendaftaran berakhir.
              Jika tanggal tayang kosong, banner mulai tampil pada tanggal
              pendaftaran.
            </p>
          </div>
          <FieldPengaturan
            id="set-ppdb-tahun-ajaran"
            label="Tahun ajaran"
            placeholder="2026/2027"
            value={nilai.ppdbTahunAjaran ?? ""}
            onChange={(e) => onUbah("ppdbTahunAjaran", e.target.value)}
            error={error.ppdbTahunAjaran}
          />
          <FieldPengaturan
            id="set-ppdb-tanggal-tayang"
            type="date"
            label="Mulai tayang pengumuman"
            value={nilai.ppdbTanggalTayang ?? ""}
            onChange={(e) => onUbah("ppdbTanggalTayang", e.target.value)}
            error={error.ppdbTanggalTayang}
            bantuan="Atur lebih awal dari tanggal pendaftaran jika ingin mengumumkan PPDB sebelum dibuka."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldPengaturan
              id="set-ppdb-tanggal-mulai"
              type="date"
              label="Tanggal mulai pendaftaran"
              value={nilai.ppdbTanggalMulai ?? ""}
              onChange={(e) => onUbah("ppdbTanggalMulai", e.target.value)}
              error={error.ppdbTanggalMulai}
            />
            <FieldPengaturan
              id="set-ppdb-tanggal-selesai"
              type="date"
              label="Tanggal selesai"
              value={nilai.ppdbTanggalSelesai ?? ""}
              onChange={(e) => onUbah("ppdbTanggalSelesai", e.target.value)}
              error={error.ppdbTanggalSelesai}
            />
          </div>
          <FieldPengaturan
            id="set-ppdb-pengumuman"
            as="textarea"
            rows={3}
            maxLength={300}
            label="Teks pengumuman"
            placeholder="Pendaftaran PPDB resmi dibuka..."
            value={nilai.ppdbPengumuman ?? ""}
            onChange={(e) => onUbah("ppdbPengumuman", e.target.value)}
            error={error.ppdbPengumuman}
            bantuan="Teks tampil sejak tanggal tayang sampai pendaftaran berakhir; gunakan kalimat yang tetap sesuai pada kedua masa."
          />
        </div>
      </div>
    </BagianPengaturan>
  );
}
