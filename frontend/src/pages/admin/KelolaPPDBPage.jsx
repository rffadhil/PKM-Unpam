
/** @format */

import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import BagianPengaturan from "@/components/pengaturan/BagianPengaturan";
import BarisSaklar from "@/components/pengaturan/BarisSaklar";
import BarSimpan from "@/components/pengaturan/BarSimpan";
import FieldPengaturan from "@/components/pengaturan/FieldPengaturan";
import Icon from "@/components/ui/Icon";

import {
  ambilPengaturanLengkap,
  simpanPengaturanPortal,
} from "@/services/pengaturan.service";

import {
  samaIsi,
  validasiPengaturanPPDB,
} from "@/utils/pengaturan";

import { mockPengaturan } from "@/mocks/adminPengaturan";
import { bacaAlurPpdb } from "@/config/alurPpdb";

const FIELD_PPDB = [
  "ppdb",
  "ppdbLink",
  "ppdbTahunAjaran",
  "ppdbTanggalTayang",
  "ppdbTanggalMulai",
  "ppdbTanggalSelesai",
  "ppdbPengumuman",
  "ppdbAlurJson",
];

export default function KelolaPPDBPage() {
  // Notifikasi global dari AdminLayout
  const {
    tampilkanNotifikasi = () => {},
  } = useOutletContext() ?? {};

  const [tersimpan, setTersimpan] = useState(mockPengaturan);
  const [draf, setDraf] = useState(mockPengaturan);

  const [error, setError] = useState({});
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [sedangSimpan, setSedangSimpan] = useState(false);
  const [galatMuat, setGalatMuat] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeId, setNoticeId] = useState(0);

  useEffect(() => {
    if (!notice) return;

    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice, noticeId]);

  function tampilkanToast(pesan) {
    setNotice(pesan);
    setNoticeId((sebelumnya) => sebelumnya + 1);
  }

  // Memuat pengaturan PPDB
  useEffect(() => {
    let aktif = true;

    async function muatPengaturanPPDB() {
      try {
        const respons = await ambilPengaturanLengkap();

        if (!respons?.portal) {
          throw new Error(
            "Data pengaturan PPDB tidak ditemukan."
          );
        }

        if (!aktif) return;

        const nilai = {
          ...mockPengaturan,
          ...respons.portal,
        };

        setTersimpan(nilai);
        setDraf(nilai);
      } catch (err) {
        if (aktif) {
          const pesan =
            err.message || "Gagal memuat pengaturan PPDB.";

          setGalatMuat(pesan);
          tampilkanNotifikasi("error", pesan);
        }
      } finally {
        if (aktif) {
          setSedangMemuat(false);
        }
      }
    }

    muatPengaturanPPDB();

    return () => {
      aktif = false;
    };
  }, []);

  // Mengubah nilai pengaturan
  function ubah(kunci, nilai) {
    setDraf((d) => ({
      ...d,
      [kunci]: nilai,
    }));

    setError((e) => {
      const berikutnya = { ...e };
      delete berikutnya[kunci];
      return berikutnya;
    });
  }

  function tambahLangkahAlur() {
    ubah(
      "ppdbAlurJson",
      JSON.stringify([...bacaAlurPpdb(draf.ppdbAlurJson), { judul: "", deskripsi: "" }]),
    );
    tampilkanToast("Langkah alur pendaftaran berhasil ditambahkan.");
  }

  function hapusLangkahAlur(index) {
    ubah(
      "ppdbAlurJson",
      JSON.stringify(
        bacaAlurPpdb(draf.ppdbAlurJson).filter(
          (_, itemIndex) => itemIndex !== index,
        ),
      ),
    );
    tampilkanToast("Langkah alur pendaftaran berhasil dihapus.");
  }

  // Membatalkan perubahan
  function batalkan() {
    setDraf(tersimpan);
    setError({});

    tampilkanNotifikasi(
      "success",
      "Perubahan pengaturan PPDB berhasil dibatalkan."
    );
  }

  // Menyimpan pengaturan PPDB
  async function simpan() {
    if (sedangSimpan) return;

    const hasilValidasi = validasiPengaturanPPDB(draf);

    const tautanForm = (draf.ppdbLink || "").trim();

    if (
      tautanForm &&
      !/^https?:\/\/\S+$/i.test(tautanForm)
    ) {
      hasilValidasi.ppdbLink =
        "Tautan Google Form harus berupa URL yang valid.";
    }

    setError(hasilValidasi);

    // Validasi gagal
    if (Object.keys(hasilValidasi).length > 0) {
      tampilkanNotifikasi(
        "error",
        "Periksa kembali isian PPDB yang ditandai."
      );
      return;
    }

    const dataPPDB = Object.fromEntries(
      FIELD_PPDB.map((kunci) => [
        kunci,
        draf[kunci],
      ])
    );

    setSedangSimpan(true);

    try {
      const respons = await simpanPengaturanPortal(dataPPDB);

      const nilaiBaru = {
        ...tersimpan,
        ...respons,
        ...dataPPDB,
      };

      setTersimpan(nilaiBaru);
      setDraf(nilaiBaru);
      setError({});

      tampilkanNotifikasi(
        "success",
        "Pengaturan PPDB berhasil disimpan dan diterapkan ke halaman publik."
      );
    } catch (err) {
      tampilkanNotifikasi(
        "error",
        err.message || "Gagal menyimpan pengaturan PPDB."
      );
    } finally {
      setSedangSimpan(false);
    }
  }

  // Tampilan loading
  if (sedangMemuat) {
    return (
      <p role="status" className="text-text-muted">
        Memuat pengaturan PPDB…
      </p>
    );
  }

  // Tampilan jika gagal memuat data
  if (galatMuat) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-error/30 bg-surface-white p-6 text-error"
      >
        <p className="font-semibold">
          Gagal memuat pengaturan PPDB
        </p>

        <p className="mt-1 text-sm">
          {galatMuat}
        </p>
      </div>
    );
  }

  const berubah = !samaIsi(draf, tersimpan);
  const alurPpdb = bacaAlurPpdb(draf.ppdbAlurJson);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {notice && (
        <div
          key={noticeId}
          role="status"
          aria-live="polite"
          className="fixed right-4 top-[88px] z-[80] flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-primary shadow-xl md:right-6"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Icon name="check_circle" className="text-[20px]" />
          </span>
          <p className="max-w-sm pt-1 text-sm font-semibold leading-5">
            {notice}
          </p>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-light hover:text-primary"
            aria-label="Tutup notifikasi"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>
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
              onChange={(e) =>
                ubah("ppdbLink", e.target.value)
              }
              error={error.ppdbLink}
              bantuan="Tautan formulir yang digunakan tombol pendaftaran di halaman publik /ppdb."
            />
          </div>

          <div className="space-y-4 rounded-xl border border-border-muted bg-surface-light/50 p-4">
            <div>
              <h3 className="text-sm font-bold text-primary">
                Jadwal & pengumuman PPDB
              </h3>

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
              onChange={(e) =>
                ubah("ppdbTahunAjaran", e.target.value)
              }
              error={error.ppdbTahunAjaran}
            />

            <FieldPengaturan
              id="set-ppdb-tanggal-tayang"
              type="date"
              label="Mulai tayang pengumuman"
              value={draf.ppdbTanggalTayang ?? ""}
              onChange={(e) =>
                ubah("ppdbTanggalTayang", e.target.value)
              }
              error={error.ppdbTanggalTayang}
              bantuan="Atur lebih awal dari tanggal pendaftaran jika ingin mengumumkan PPDB sebelum dibuka."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldPengaturan
                id="set-ppdb-tanggal-mulai"
                type="date"
                label="Tanggal mulai pendaftaran"
                value={draf.ppdbTanggalMulai ?? ""}
                onChange={(e) =>
                  ubah("ppdbTanggalMulai", e.target.value)
                }
                error={error.ppdbTanggalMulai}
              />

              <FieldPengaturan
                id="set-ppdb-tanggal-selesai"
                type="date"
                label="Tanggal selesai"
                value={draf.ppdbTanggalSelesai ?? ""}
                onChange={(e) =>
                  ubah("ppdbTanggalSelesai", e.target.value)
                }
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
              onChange={(e) =>
                ubah("ppdbPengumuman", e.target.value)
              }
              error={error.ppdbPengumuman}
              bantuan="Teks tampil sejak tanggal tayang sampai pendaftaran berakhir; gunakan kalimat yang tetap sesuai pada kedua masa."
            />
          </div>
        </div>
      </BagianPengaturan>

      <BagianPengaturan
        ikon="format_list_numbered"
        judul="Alur Pendaftaran"
        subjudul="Atur langkah-langkah yang ditampilkan pada halaman publik PPDB."
        aksi={
          <button
            type="button"
            onClick={tambahLangkahAlur}
            className="inline-flex items-center gap-2 rounded-full bg-cta-gold px-4 py-2 text-sm font-bold text-primary shadow-sm transition hover:brightness-95"
          >
            <Icon name="add" className="text-[18px]" />
            Tambah Langkah
          </button>
        }
      >
        {alurPpdb.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {alurPpdb.map((langkah, index) => (
              <div
                key={index}
                className="space-y-4 rounded-xl border border-border-muted bg-surface-light/40 p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-primary-container px-3 py-1 text-xs font-bold text-cta-gold">
                    Langkah {String(index + 1).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={() => hapusLangkahAlur(index)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-muted text-text-muted transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    title={`Hapus Langkah ${index + 1}`}
                    aria-label={`Hapus Langkah ${index + 1}`}
                  >
                    <Icon name="delete" className="text-[18px]" />
                  </button>
                </div>

                <FieldPengaturan
                  id={`set-ppdb-alur-judul-${index}`}
                  label="Judul langkah"
                  placeholder="Contoh: Isi formulir online"
                  value={langkah.judul}
                  onChange={(e) => {
                    const langkahBaru = alurPpdb.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, judul: e.target.value }
                        : item,
                    );
                    ubah("ppdbAlurJson", JSON.stringify(langkahBaru));
                  }}
                />

                <FieldPengaturan
                  id={`set-ppdb-alur-deskripsi-${index}`}
                  as="textarea"
                  rows={3}
                  label="Deskripsi langkah"
                  placeholder="Jelaskan proses yang perlu dilakukan calon siswa."
                  value={langkah.deskripsi}
                  onChange={(e) => {
                    const langkahBaru = alurPpdb.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, deskripsi: e.target.value }
                        : item,
                    );
                    ubah("ppdbAlurJson", JSON.stringify(langkahBaru));
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border-muted bg-surface-light/40 px-5 py-10 text-center text-sm text-text-muted">
            Belum ada langkah pendaftaran. Klik "Tambah Langkah" untuk
            menambahkan.
          </p>
        )}
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
