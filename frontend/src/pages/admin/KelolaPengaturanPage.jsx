/** @format */

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PratinjauPeran from "@/components/pengaturan/PratinjauPeran";
import IdentitasSekolahForm from "@/components/pengaturan/IdentitasSekolahForm";
import KontakFooterForm from "@/components/pengaturan/KontakFooterForm";
import PortalStatusPanel from "@/components/pengaturan/PortalStatusPanel";
import AdminAksesPanel from "@/components/pengaturan/AdminAksesPanel";
import AdminFormModal from "@/components/pengaturan/AdminFormModal";
import SesiAdminPanel from "@/components/pengaturan/SesiAdminPanel";
import BarSimpan from "@/components/pengaturan/BarSimpan";
import { adminUser } from "@/mocks/admin";
import {
  idAdminSaatIni,
  mockAdmin,
  mockPengaturan,
  mockSesi,
} from "@/mocks/adminPengaturan";
import {
  BAGIAN_PER_PERAN,
  FORMAT_FAVICON,
  FORMAT_LOGO,
  KATA_BAGIAN,
} from "@/config/pengaturanAdmin";
import {
  adalahSuperAdmin,
  samaIsi,
  validasiAset,
  validasiPengaturan,
} from "@/utils/pengaturan";
import { getActiveAdmin } from "@/services/authService";
import { unggahGambar } from "@/services/upload.service";
import {
  ambilPengaturanLengkap,
  simpanPengaturanPortal,
  tambahAdmin,
  ubahAdmin,
  hapusAdminById,
} from "@/services/pengaturan.service";

export default function KelolaPengaturanPage() {
  const { pencarian = "" } = useOutletContext() ?? {};
  const profilAktif = getActiveAdmin(adminUser);

  const [peran, setPeran] = useState(
    adalahSuperAdmin(profilAktif.peran) ? "superadmin" : "admin",
  );
  const [tersimpan, setTersimpan] = useState(mockPengaturan);
  const [draf, setDraf] = useState(mockPengaturan);
  const [error, setError] = useState({});
  const [admin, setAdmin] = useState(mockAdmin);
  const [sesi, setSesi] = useState({
    ...mockSesi,
    nama: profilAktif.nama,
    peran: adalahSuperAdmin(profilAktif.peran)
      ? "Super Admin Utama"
      : "Admin Portal",
  });
  const [modalAdmin, setModalAdmin] = useState(null); // { item } | null
  const [galatAdmin, setGalatAdmin] = useState("");
  const [akanDihapus, setAkanDihapus] = useState(null);
  const [konfirmasiPemeliharaan, setKonfirmasiPemeliharaan] = useState(false);
  const [notice, setNotice] = useState("");

  const idSaya = profilAktif.id || idAdminSaatIni;

  useEffect(() => {
    let aktif = true;
    ambilPengaturanLengkap()
      .then((res) => {
        if (!aktif) return;
        if (res.portal) {
          setTersimpan(res.portal);
          setDraf(res.portal);
        }
        if (Array.isArray(res.admin) && res.admin.length > 0) {
          setAdmin(res.admin);
        }
        if (res.sesi) {
          setSesi((prev) => ({
            ...prev,
            ...res.sesi,
            nama: profilAktif.nama || res.sesi.nama,
          }));
        }
      })
      .catch(() => {
        // Fallback ke mock jika gagal memuat (mis. saat testing)
      });
    return () => {
      aktif = false;
    };
  }, [profilAktif.nama]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(t);
  }, [notice]);

  const berubah = !samaIsi(draf, tersimpan);
  const kata = pencarian.trim().toLowerCase();
  const bagian = BAGIAN_PER_PERAN[peran].filter(
    (b) => !kata || KATA_BAGIAN[b].includes(kata),
  );

  function ubah(kunci, nilai) {
    if (kunci === "maintenance" && nilai)
      return setKonfirmasiPemeliharaan(true);
    setDraf((d) => ({ ...d, [kunci]: nilai }));
  }

  async function gantiAset(kunci, file) {
    const pesan = validasiAset(
      file,
      kunci === "logo" ? FORMAT_LOGO : FORMAT_FAVICON,
    );
    setError((e) => ({ ...e, [kunci]: pesan || undefined }));
    if (pesan) return;

    try {
      const url = await unggahGambar(file);
      setDraf((d) => ({ ...d, [kunci]: url, [`${kunci}Nama`]: file.name }));
      setNotice(
        `${kunci === "logo" ? "Logo" : "Favicon"} berhasil diunggah. Klik Simpan Perubahan untuk menerapkan.`,
      );
    } catch (err) {
      setError((e) => ({
        ...e,
        [kunci]: err.message || "Gagal mengunggah berkas.",
      }));
    }
  }

  async function simpanPengaturan() {
    const hasil = validasiPengaturan(draf);
    setError(hasil);
    if (Object.keys(hasil).length)
      return setNotice("Periksa kembali isian yang ditandai merah.");

    try {
      const dataBaru = await simpanPengaturanPortal(draf);
      setTersimpan(dataBaru);
      setDraf(dataBaru);
      setNotice("Pengaturan berhasil disimpan dan diterapkan ke portal.");
    } catch (err) {
      setNotice(err.message || "Gagal menyimpan pengaturan ke server.");
    }
  }

  function batalkan() {
    setDraf(tersimpan);
    setError({});
  }

  async function simpanAdmin(data) {
    const calonDaftar = data.id
      ? admin.map((a) => (a.id === data.id ? { ...a, ...data } : a))
      : [...admin, { ...data, id: Date.now(), aktif: data.aktif ?? true }];

    if (
      !calonDaftar.some((a) => a.role === "superadmin" && a.aktif !== false)
    ) {
      return setGalatAdmin("Harus ada minimal satu Super Admin yang aktif.");
    }

    try {
      if (data.id) {
        const updated = await ubahAdmin(data.id, data);
        setAdmin((prev) =>
          prev.map((a) => (String(a.id) === String(data.id) ? updated : a)),
        );
        setNotice("Data admin diperbarui.");
      } else {
        const created = await tambahAdmin(data);
        setAdmin((prev) => [...prev, created]);
        setNotice("Akun admin baru dibuat.");
      }
      setModalAdmin(null);
      setGalatAdmin("");
    } catch (err) {
      setGalatAdmin(err.message || "Gagal menyimpan data admin.");
    }
  }

  async function konfirmasiHapus() {
    if (!akanDihapus) return;
    try {
      await hapusAdminById(akanDihapus.id);
      setAdmin((d) => d.filter((a) => String(a.id) !== String(akanDihapus.id)));
      setAkanDihapus(null);
      setNotice("Akun admin dihapus.");
    } catch (err) {
      setNotice(err.message || "Gagal menghapus akun admin.");
      setAkanDihapus(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <PratinjauPeran nilai={peran} onUbah={setPeran} />

      {notice && (
        <p
          role="status"
          className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark"
        >
          {notice}
        </p>
      )}

      {bagian.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border-muted bg-surface-white p-10 text-center text-text-muted">
          Tidak ada pengaturan yang cocok dengan “{pencarian}”.
        </p>
      )}

      {bagian.includes("identitas") && (
        <IdentitasSekolahForm
          nilai={draf}
          error={error}
          onUbah={ubah}
          onGantiAset={gantiAset}
        />
      )}
      {bagian.includes("kontak") && (
        <KontakFooterForm nilai={draf} error={error} onUbah={ubah} />
      )}
      {bagian.includes("portal") && (
        <PortalStatusPanel nilai={draf} onUbah={ubah} />
      )}
      {bagian.includes("akses") && (
        <AdminAksesPanel
          daftar={admin}
          idSaya={idSaya}
          onTambah={() => {
            setGalatAdmin("");
            setModalAdmin({ item: null });
          }}
          onEdit={(item) => {
            setGalatAdmin("");
            setModalAdmin({ item });
          }}
          onHapus={setAkanDihapus}
        />
      )}
      {bagian.includes("sesi") && <SesiAdminPanel sesi={sesi} />}

      <BarSimpan
        berubah={berubah}
        onBatal={batalkan}
        onSimpan={simpanPengaturan}
      />

      {modalAdmin && (
        <AdminFormModal
          admin={modalAdmin.item}
          saya={String(modalAdmin.item?.id) === String(idSaya)}
          galat={galatAdmin}
          onSimpan={simpanAdmin}
          onTutup={() => setModalAdmin(null)}
        />
      )}

      {akanDihapus && (
        <ConfirmDialog
          judul="Hapus akun admin ini?"
          pesan={`Akun “${akanDihapus.nama}” akan dihapus dan tidak bisa login lagi.`}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}

      {konfirmasiPemeliharaan && (
        <ConfirmDialog
          judul="Aktifkan Mode Pemeliharaan?"
          pesan="Setelah Anda menyimpan, seluruh halaman publik akan diganti halaman pemberitahuan pemeliharaan. Akses CMS Admin tetap dapat dibuka."
          labelKonfirmasi="Aktifkan"
          ikon="build"
          onKonfirmasi={() => {
            setDraf((d) => ({ ...d, maintenance: true }));
            setKonfirmasiPemeliharaan(false);
          }}
          onBatal={() => setKonfirmasiPemeliharaan(false)}
        />
      )}
    </div>
  );
}
