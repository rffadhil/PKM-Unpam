/** @format */

import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import IdentitasSekolahForm from "@/components/pengaturan/IdentitasSekolahForm";
import KontakFooterForm from "@/components/pengaturan/KontakFooterForm";
import PortalStatusPanel from "@/components/pengaturan/PortalStatusPanel";
import AdminAksesPanel from "@/components/pengaturan/AdminAksesPanel";
import AdminFormModal from "@/components/pengaturan/AdminFormModal";
import SesiAdminPanel from "@/components/pengaturan/SesiAdminPanel";
import BarSimpan from "@/components/pengaturan/BarSimpan";

import { adminUser } from "@/mocks/admin";
import { mockAdmin, mockPengaturan, mockSesi } from "@/mocks/adminPengaturan";
import {
  BAGIAN_PER_PERAN,
  FORMAT_FAVICON,
  FORMAT_LOGO,
  KATA_BAGIAN,
  ROLE_ADMIN,
} from "@/config/pengaturanAdmin";
import {
  adalahSuperAdmin,
  samaIsi,
  validasiAset,
  validasiPengaturan,
} from "@/utils/pengaturan";
import {
  getActiveAdmin,
  updateActiveAdminStorage,
} from "@/services/authService";
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

  const peran = adalahSuperAdmin(profilAktif.peran) ? "superadmin" : "subadmin";
  const adalahSuper = peran === "superadmin";

  const [tersimpan, setTersimpan] = useState(mockPengaturan);
  const [draf, setDraf] = useState(mockPengaturan);
  const [error, setError] = useState({});
  const [admin, setAdmin] = useState(mockAdmin);
  const [infoSesiServer, setInfoSesiServer] = useState(mockSesi);
  const [modalAdmin, setModalAdmin] = useState(null);
  const [galatAdmin, setGalatAdmin] = useState("");
  const [akanDihapus, setAkanDihapus] = useState(null);
  const [konfirmasiPemeliharaan, setKonfirmasiPemeliharaan] = useState(false);
  const [notice, setNotice] = useState("");

  const akunSaya =
    admin.find((a) => String(a.id) === String(profilAktif.id)) ??
    admin.find((a) => a.role === peran) ??
    admin[0] ??
    mockAdmin[0];

  const sesi = {
    ...infoSesiServer,
    nama: akunSaya?.nama || profilAktif.nama,
    foto: akunSaya?.foto || profilAktif.foto || "",
    peran: ROLE_ADMIN.find((r) => r.kunci === peran)?.label ?? peran,
  };

  useEffect(() => {
    let aktif = true;
    ambilPengaturanLengkap()
      .then((res) => {
        if (!aktif) return;
        if (res.portal) {
          setTersimpan(res.portal);
          setDraf(res.portal);
        }
        if (res.sesi) {
          setInfoSesiServer((prev) => ({ ...prev, ...res.sesi }));
        }
        if (Array.isArray(res.admin) && res.admin.length > 0) {
          setAdmin(res.admin);
          const sayaDiDb = res.admin.find(
            (a) =>
              String(a.id) === String(profilAktif.id) ||
              (profilAktif.email &&
                a.email?.toLowerCase() === profilAktif.email.toLowerCase()),
          );
          if (sayaDiDb) {
            updateActiveAdminStorage({
              id: sayaDiDb.id,
              nama: sayaDiDb.nama,
              foto: sayaDiDb.foto || "",
            });
          }
        }
      })
      .catch(() => {
        // Gunakan fallback mock jika server belum merespons
      });
    return () => {
      aktif = false;
    };
  }, [profilAktif.email, profilAktif.id]);

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
    if (
      (kunci === "maintenance" || kunci === "ppdb" || kunci === "ppdbLink") &&
      !adalahSuper
    )
      return;
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
    } catch (err) {
      setError((e) => ({
        ...e,
        [kunci]: err.message || "Gagal mengunggah berkas.",
      }));
    }
  }

  async function simpanPengaturan() {
    const hasil = validasiPengaturan(draf)

    console.log('HASIL VALIDASI:', hasil)

    setError(hasil)

    if (Object.keys(hasil).length)
      return setNotice('Periksa kembali isian yang ditandai merah.')

    try {
      const dataBaru = await simpanPengaturanPortal(draf)
      setTersimpan(dataBaru)
      setDraf(dataBaru)
      setNotice('Pengaturan berhasil disimpan dan diterapkan ke portal.')
    } catch (err) {
      setNotice(err.message || 'Gagal menyimpan pengaturan.')
    }
  }

  function batalkan() {
    setDraf(tersimpan);
    setError({});
  }

  async function simpanAdmin(data, sandi) {
    if (!adalahSuper) return;
    const daftarBaru = data.id
      ? admin.map((a) =>
          String(a.id) === String(data.id) ? { ...a, ...data } : a,
        )
      : [...admin, { ...data, id: Date.now() }];

    if (!daftarBaru.some((a) => a.role === "superadmin" && a.aktif)) {
      return setGalatAdmin("Harus ada minimal satu Super Admin yang aktif.");
    }

    try {
      if (data.id) {
        const updated = await ubahAdmin(data.id, { ...data, sandi });
        setAdmin((prev) =>
          prev.map((a) => (String(a.id) === String(data.id) ? updated : a)),
        );
        setNotice("Data admin diperbarui.");

        if (String(updated.id) === String(akunSaya?.id)) {
          updateActiveAdminStorage({
            nama: updated.nama,
            foto: updated.foto || "",
          });
        }
      } else {
        const created = await tambahAdmin({ ...data, sandi });
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
    if (!adalahSuper || !akanDihapus) return;
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
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-6">
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

      {/* Khusus Super Admin */}
      {adalahSuper && bagian.includes("portal") && (
        <PortalStatusPanel nilai={draf} error={error} onUbah={ubah} />
      )}
      {adalahSuper && bagian.includes("akses") && (
        <AdminAksesPanel
          daftar={admin}
          idSaya={akunSaya.id}
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

      {/* Khusus Sub Admin */}
      {!adalahSuper && bagian.includes("sesi") && (
        <SesiAdminPanel sesi={sesi} />
      )}

      <BarSimpan
        berubah={berubah}
        onBatal={batalkan}
        onSimpan={simpanPengaturan}
      />

      {adalahSuper && modalAdmin && (
        <AdminFormModal
          admin={modalAdmin.item}
          saya={String(modalAdmin.item?.id) === String(akunSaya.id)}
          galat={galatAdmin}
          onSimpan={simpanAdmin}
          onTutup={() => setModalAdmin(null)}
        />
      )}

      {adalahSuper && akanDihapus && (
        <ConfirmDialog
          judul="Hapus akun admin ini?"
          pesan={`Akun “${akanDihapus.nama}” akan dihapus dan tidak bisa login lagi. Untuk sementara, pertimbangkan menonaktifkan akun saja.`}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}

      {adalahSuper && konfirmasiPemeliharaan && (
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
