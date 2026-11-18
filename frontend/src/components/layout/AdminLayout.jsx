
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { cariItemNav } from "@/config/adminNav";
import { applyBrowserBranding } from "@/utils/browserBranding";

export default function AdminLayout() {
  const { pathname } = useLocation();
  const item = cariItemNav(pathname);

  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [notifikasi, setNotifikasi] = useState(null);

  /* ==========================================
     NOTIFIKASI GLOBAL ADMIN
  ========================================== */

  function tampilkanNotifikasi(tipe, pesan) {
    setNotifikasi({
      id: Date.now(),
      tipe,
      pesan,
    });
  }

  function tutupNotifikasi() {
    setNotifikasi(null);
  }

  // Notifikasi hilang otomatis setelah 4 detik
  useEffect(() => {
    if (!notifikasi) return;

    const timer = setTimeout(() => {
      setNotifikasi(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [notifikasi]);

  /* ==========================================
     BROWSER BRANDING
  ========================================== */

  useEffect(() => {
    applyBrowserBranding({
      title: "CMS Admin — SMA Harapan Jaya",
    });
  }, []);

  /* ==========================================
     TAMPILAN NOTIFIKASI
  ========================================== */

  const konfigurasiNotifikasi = {
    success: {
      judul: "Berhasil",
      ikon: "✓",
      warna:
        "bg-green-50 border-green-200 text-green-700",
      warnaIkon: "bg-green-100 text-green-600",
    },
    error: {
      judul: "Gagal",
      ikon: "!",
      warna:
        "bg-red-50 border-red-200 text-red-700",
      warnaIkon: "bg-red-100 text-red-600",
    },
    warning: {
      judul: "Perhatian",
      ikon: "!",
      warna:
        "bg-amber-50 border-amber-200 text-amber-700",
      warnaIkon: "bg-amber-100 text-amber-600",
    },
    info: {
      judul: "Informasi",
      ikon: "i",
      warna:
        "bg-blue-50 border-blue-200 text-blue-700",
      warnaIkon: "bg-blue-100 text-blue-600",
    },
  };

  const konfigurasi =
    konfigurasiNotifikasi[notifikasi?.tipe] ||
    konfigurasiNotifikasi.info;

  return (
    <div className="flex h-screen overflow-hidden bg-surface-light text-on-surface antialiased font-body-md text-body-md">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <AdminSidebar
        terbuka={menuTerbuka}
        onTutup={() => setMenuTerbuka(false)}
      />

      {/* ======================================
          KONTEN ADMIN
      ====================================== */}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <AdminTopbar
          judul={item.judul}
          onBukaMenu={() => setMenuTerbuka(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-4 lg:p-6 space-y-6">

            {/* HALAMAN ADMIN */}
            <Outlet
              context={{
                pencarian: "",
                tampilkanNotifikasi,
              }}
            />

          </div>
        </main>
      </div>

      {/* ======================================
          GLOBAL TOAST NOTIFICATION
      ====================================== */}

      {notifikasi && (
        <div
          key={notifikasi.id}
          role="alert"
          aria-live="polite"
          className={`fixed top-5 right-5 z-[9999] flex w-[calc(100%-2.5rem)] max-w-sm items-start gap-3 rounded-xl border p-4 shadow-xl ${konfigurasi.warna}`}
          style={{
            animation: "adminToastMasuk 0.35s ease-out",
          }}
        >
          {/* IKON */}

          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${konfigurasi.warnaIkon}`}
          >
            {konfigurasi.ikon}
          </div>

          {/* PESAN */}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">
              {konfigurasi.judul}
            </p>

            <p className="mt-1 text-sm leading-relaxed">
              {notifikasi.pesan}
            </p>
          </div>

          {/* TOMBOL TUTUP */}

          <button
            type="button"
            onClick={tutupNotifikasi}
            aria-label="Tutup notifikasi"
            className="rounded-md px-1 text-lg opacity-50 transition hover:bg-black/5 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      {/* ======================================
          ANIMASI NOTIFIKASI
      ====================================== */}

      <style>
        {`
          @keyframes adminToastMasuk {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}
