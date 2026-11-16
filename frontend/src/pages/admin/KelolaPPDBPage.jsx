/** @format */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BagianPengaturan from "@/components/pengaturan/BagianPengaturan";
import BarisSaklar from "@/components/pengaturan/BarisSaklar";
import BarSimpan from "@/components/pengaturan/BarSimpan";
import FieldPengaturan from "@/components/pengaturan/FieldPengaturan";
import { adminUser } from "@/mocks/admin";
import {
  ambilPengaturanLengkap,
  simpanPengaturanPortal,
} from "@/services/pengaturan.service";
import { getActiveAdmin } from "@/services/authService";
import {
  adalahSuperAdmin,
  samaIsi,
  validasiPengaturanPPDB,
} from "@/utils/pengaturan";
import { mockPengaturan } from "@/mocks/adminPengaturan";

const FIELD_PPDB = [
  "ppdb",
  "ppdbLink",
  "ppdbTahunAjaran",
  "ppdbTanggalTayang",
  "ppdbTanggalMulai",
  "ppdbTanggalSelesai",
  "ppdbPengumuman",
];

export default function KelolaPPDBPage() {
  const profilAktif = getActiveAdmin(adminUser);
  const bolehKelola = adalahSuperAdmin(profilAktif.peran);
  const [tersimpan, setTersimpan] = useState(mockPengaturan);
  const [draf, setDraf] = useState(mockPengaturan);
  const [error, setError] = useState({});
  const [sedangMemuat, setSedangMemuat] = useState(bolehKelola);
  const [sedangSimpan, setSedangSimpan] = useState(false);
  const [galatMuat, setGalatMuat] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!bolehKelola) return undefined;
    let aktif = true;

    async function muatPengaturanPPDB() {
      try {
        const respons = await ambilPengaturanLengkap();
        if (!respons?.portal) {
          throw new Error("Data pengaturan PPDB tidak ditemukan.");
        }
        if (!aktif) return;

        const nilai = { ...mockPengaturan, ...respons.portal };
        setTersimpan(nilai);
        setDraf(nilai);
      } catch (err) {
        if (aktif) {
          setGalatMuat(err.message || "Gagal memuat pengaturan PPDB.");
        }
      } finally {
        if (aktif) setSedangMemuat(false);
      }
    }

    muatPengaturanPPDB();
    return () => {
      aktif = false;
    };
  }, [bolehKelola]);

  function ubah(kunci, nilai) {
    setDraf((d) => ({ ...d, [kunci]: nilai }));
    setError((e) => {
      const berikutnya = { ...e };
      delete berikutnya[kunci];
      return berikutnya;
    });
  }

  function batalkan() {
    setDraf(tersimpan);
    setError({});
    setNotice("");
  }

  async function simpan() {
    if (sedangSimpan) return;

    const hasilValidasi = validasiPengaturanPPDB(draf);
    const tautanForm = (draf.ppdbLink || "").trim();
    if (tautanForm && !/^https?:\/\/\S+$/i.test(tautanForm)) {
      hasilValidasi.ppdbLink = "Tautan Google Form harus berupa URL yang valid.";
    }
    setError(hasilValidasi);
    if (Object.keys(hasilValidasi).length > 0) {
      setNotice("Periksa kembali isian PPDB yang ditandai.");
      return;
    }

    const dataPPDB = Object.fromEntries(
      FIELD_PPDB.map((kunci) => [kunci, draf[kunci]]),
    );

    setSedangSimpan(true);
    setNotice("");
    try {
      const respons = await simpanPengaturanPortal(dataPPDB);
      const nilaiBaru = { ...tersimpan, ...respons, ...dataPPDB };
      setTersimpan(nilaiBaru);
      setDraf(nilaiBaru);
      setNotice("Pengaturan PPDB berhasil disimpan dan diterapkan ke halaman publik.");
    } catch (err) {
      setNotice(err.message || "Gagal menyimpan pengaturan PPDB.");
    } finally {
      setSedangSimpan(false);
    }
  }

  if (!bolehKelola) {
    return (
      <p role="alert" className="rounded-xl border border-border-muted bg-surface-white p-6 text-text-muted">
        Hanya Super Admin yang dapat mengelola pengaturan PPDB.
      </p>
    );
  }

  if (sedangMemuat) {
    return <p role="status" className="text-text-muted">Memuat pengaturan PPDB…</p>;
  }

  if (galatMuat) {
    return (
      <p role="alert" className="rounded-xl border border-error/30 bg-surface-white p-6 text-error">
        {galatMuat}
      </p>
    );
  }

  const berubah = !samaIsi(draf, tersimpan);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {notice && (
        <p
          role="status"
          className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark"
        >
          {notice}
        </p>
      )}

      <BagianPengaturan
        ikon="how_to_reg"
        judul="Penerimaan Peserta Didik Baru (PPDB)"
        subjudul="Atur pendaftaran online, jadwal, dan pengumuman yang terhubung ke halaman publik."
        aksi={
          <Link
            to="/ppdb"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-secondary underline underline-offset-2"
          >
            Lihat halaman publik
          </Link>
        }
      >
        <div className="space-y-4">
          <BarisSaklar
            ikon="how_to_reg"
            judul="Izinkan Pendaftaran PPDB Online"
            deskripsi="Mengaktifkan pendaftaran online PPDB dan tombol pendaftaran pada halaman publik."
            aktif={draf.ppdb}
            onUbah={(nilai) => ubah("ppdb", nilai)}
            sorotSaatAktif
          />

          <div className="rounded-xl border border-border-muted bg-surface-light/50 p-4">
            <FieldPengaturan
              id="set-ppdb-link"
              type="url"
              label="Tautan Google Form Pendaftaran PPDB"
              placeholder="https://forms.gle/..."
              value={draf.ppdbLink ?? ""}
              onChange={(e) => ubah("ppdbLink", e.target.value)}
              error={error.ppdbLink}
              bantuan="Tautan formulir yang digunakan tombol pendaftaran di halaman publik /ppdb."
            />
          </div>

          <div className="space-y-4 rounded-xl border border-border-muted bg-surface-light/50 p-4">
            <div>
              <h3 className="text-sm font-bold text-primary">Jadwal & pengumuman PPDB</h3>
              <p className="mt-1 text-xs text-text-muted">
                Banner tampil mulai tanggal tayang sampai pendaftaran berakhir.
                Jika tanggal tayang kosong, banner mulai tampil pada tanggal pendaftaran.
              </p>
            </div>
            <FieldPengaturan
              id="set-ppdb-tahun-ajaran"
              label="Tahun ajaran"
              placeholder="2026/2027"
              value={draf.ppdbTahunAjaran ?? ""}
              onChange={(e) => ubah("ppdbTahunAjaran", e.target.value)}
              error={error.ppdbTahunAjaran}
            />
            <FieldPengaturan
              id="set-ppdb-tanggal-tayang"
              type="date"
              label="Mulai tayang pengumuman"
              value={draf.ppdbTanggalTayang ?? ""}
              onChange={(e) => ubah("ppdbTanggalTayang", e.target.value)}
              error={error.ppdbTanggalTayang}
              bantuan="Atur lebih awal dari tanggal pendaftaran jika ingin mengumumkan PPDB sebelum dibuka."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldPengaturan
                id="set-ppdb-tanggal-mulai"
                type="date"
                label="Tanggal mulai pendaftaran"
                value={draf.ppdbTanggalMulai ?? ""}
                onChange={(e) => ubah("ppdbTanggalMulai", e.target.value)}
                error={error.ppdbTanggalMulai}
              />
              <FieldPengaturan
                id="set-ppdb-tanggal-selesai"
                type="date"
                label="Tanggal selesai"
                value={draf.ppdbTanggalSelesai ?? ""}
                onChange={(e) => ubah("ppdbTanggalSelesai", e.target.value)}
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
              value={draf.ppdbPengumuman ?? ""}
              onChange={(e) => ubah("ppdbPengumuman", e.target.value)}
              error={error.ppdbPengumuman}
              bantuan="Teks tampil sejak tanggal tayang sampai pendaftaran berakhir; gunakan kalimat yang tetap sesuai pada kedua masa."
            />
          </div>
        </div>
      </BagianPengaturan>

      <BarSimpan
        berubah={berubah}
        onBatal={batalkan}
        onSimpan={simpan}
        sedangSimpan={sedangSimpan}
      />
    </div>
  );
}
