/** @format */

import BagianPengaturan from "@/components/pengaturan/BagianPengaturan";
import FieldPengaturan from "@/components/pengaturan/FieldPengaturan";
import { AKREDITASI } from "@/config/pengaturanAdmin";

// Bagian "Identitas Sekolah & Portal Publik" (tanpa panel Aset Visual).
export default function IdentitasSekolahForm({ nilai, error, onUbah }) {
  const ubah = (kunci) => (e) => onUbah(kunci, e.target.value);
  return (
    <BagianPengaturan
      ikon="account_balance"
      judul="Identitas Sekolah & Portal Publik"
      subjudul="Informasi pokok lembaga pendidikan yang ditampilkan pada header dan metadata web"
      aksi={
        <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs font-bold text-text-muted">
          Wajib Diisi
        </span>
      }
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldPengaturan
          id="set-nama"
          label="Nama Resmi Institusi"
          value={nilai.namaInstitusi}
          onChange={ubah("namaInstitusi")}
          error={error.namaInstitusi}
          bantuan="Sesuai SK Pendirian Operasional Dinas Pendidikan"
        />
        <FieldPengaturan
          id="set-npsn"
          label="Nomor Pokok Sekolah Nasional (NPSN)"
          value={nilai.npsn}
          onChange={ubah("npsn")}
          error={error.npsn}
          inputMode="numeric"
          maxLength={8}
          bantuan="Terverifikasi di Dapodik Kemendikbud"
        />
        <FieldPengaturan
          id="set-akreditasi"
          as="select"
          label="Status Akreditasi Lembaga"
          value={nilai.akreditasi}
          onChange={ubah("akreditasi")}
        >
          {AKREDITASI.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </FieldPengaturan>
        <FieldPengaturan
          id="set-adiwiyata"
          label="Predikat Adiwiyata Lingkungan"
          value={nilai.adiwiyata}
          onChange={ubah("adiwiyata")}
        />
        <FieldPengaturan
          className="sm:col-span-2"
          id="set-slogan"
          label="Slogan / Motto Resmi Pendidikan"
          value={nilai.slogan}
          onChange={ubah("slogan")}
          error={error.slogan}
          maxLength={120}
          bantuan="Ditampilkan di bawah lambang institusi pada kop resmi web"
        />
      </div>
    </BagianPengaturan>
  );
}
