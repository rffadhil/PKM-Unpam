import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Outlet, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import Icon from "@/components/ui/Icon";
import { cariItemNav } from "@/config/adminNav";
import { applyBrowserBranding } from "@/utils/browserBranding";

const KUNCI_SIDEBAR_DESKTOP = "cms_sidebar_desktop_terbuka";

function bacaSidebarDesktop() {
  try {
    return localStorage.getItem(KUNCI_SIDEBAR_DESKTOP) !== "false";
  } catch {
    return true;
  }
}

const VARIAN_TOAST = {
  success: {
    judul: "Berhasil",
    Icon: CheckCircle2,
    warna: "border-green-200 text-green-800",
    warnaIcon: "bg-green-100 text-green-700",
  },
  error: {
    judul: "Gagal",
    Icon: AlertCircle,
    warna: "border-red-200 text-red-800",
    warnaIcon: "bg-red-100 text-red-700",
  },
  warning: {
    judul: "Perhatian",
    Icon: AlertTriangle,
    warna: "border-yellow-200 text-yellow-800",
    warnaIcon: "bg-yellow-100 text-yellow-700",
  },
  info: {
    judul: "Informasi",
    Icon: Info,
    warna: "border-blue-200 text-blue-800",
    warnaIcon: "bg-blue-100 text-blue-700",
  },
};

function ToastGlobal({ data, onTutup }) {
  if (!data || typeof document === "undefined") return null;

  const varian = VARIAN_TOAST[data.tipe] || VARIAN_TOAST.info;
  const Ikon = varian.Icon;

  // Portal membuat toast berada langsung di body, sehingga tidak terpotong
  // oleh overflow, stacking context, atau modal dari halaman admin.
  return createPortal(
    <div
      key={data.id}
      role={data.tipe === "error" ? "alert" : "status"}
      aria-live={data.tipe === "error" ? "assertive" : "polite"}
      className={`fixed right-5 top-5 z-[2147483647] flex w-[calc(100%-2.5rem)] max-w-sm items-start gap-3 rounded-xl border bg-white p-4 shadow-2xl ${varian.warna}`}
      style={{ pointerEvents: "auto" }}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${varian.warnaIcon}`}
      >
        <Ikon size={21} strokeWidth={2.3} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold">{varian.judul}</p>
        <p className="mt-1 break-words text-sm">{data.pesan}</p>
      </div>

      <button
        type="button"
        onClick={onTutup}
        aria-label="Tutup notifikasi"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
      >
        <X size={17} />
      </button>
    </div>,
    document.body,
  );
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const item = cariItemNav(pathname);

  const [menuTerbuka, setMenuTerbuka] = useState(false);
  const [sidebarDesktopTerbuka, setSidebarDesktopTerbuka] =
    useState(bacaSidebarDesktop);

  const [toast, setToast] = useState(null);
  const timerToast = useRef(null);

  const tampilkanNotifikasi = useCallback((tipe = "info", pesan = "") => {
    if (timerToast.current) {
      clearTimeout(timerToast.current);
    }

    const tipeAman = VARIAN_TOAST[tipe] ? tipe : "info";

    setToast({
      id: Date.now(),
      tipe: tipeAman,
      pesan: String(pesan || ""),
    });

    timerToast.current = setTimeout(() => {
      setToast(null);
      timerToast.current = null;
    }, 4000);
  }, []);

  const tutupNotifikasi = useCallback(() => {
    if (timerToast.current) {
      clearTimeout(timerToast.current);
      timerToast.current = null;
    }
    setToast(null);
  }, []);

  useEffect(() => {
    applyBrowserBranding({
      title: "CMS Admin — SMA Harapan Jaya",
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        KUNCI_SIDEBAR_DESKTOP,
        String(sidebarDesktopTerbuka),
      );
    } catch {
      // Abaikan jika penyimpanan tidak tersedia.
    }
  }, [sidebarDesktopTerbuka]);

  useEffect(() => {
    return () => {
      if (timerToast.current) {
        clearTimeout(timerToast.current);
      }
    };
  }, []);

  return (
    <div className="relative flex h-screen overflow-hidden bg-surface-light text-on-surface antialiased font-body-md text-body-md">
      <AdminSidebar
        terbuka={menuTerbuka}
        onTutup={() => setMenuTerbuka(false)}
        desktopTerbuka={sidebarDesktopTerbuka}
      />

      <button
        type="button"
        onClick={() => setSidebarDesktopTerbuka((v) => !v)}
        aria-label={sidebarDesktopTerbuka ? "Tutup sidebar" : "Buka sidebar"}
        title={sidebarDesktopTerbuka ? "Tutup sidebar" : "Buka sidebar"}
        aria-expanded={sidebarDesktopTerbuka}
        aria-controls="sidebar-cms"
        className={
          "hidden lg:flex absolute top-1/2 z-50 h-14 w-6 -translate-y-1/2 items-center justify-center border shadow-md transition-[left,background-color,color] duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary " +
          (sidebarDesktopTerbuka
            ? "left-[248px] rounded-lg border-border-muted bg-surface-white text-primary hover:bg-cta-gold"
            : "left-0 rounded-r-lg border-l-0 border-secondary bg-secondary text-white hover:bg-primary-container")
        }
      >
        <Icon
          name={sidebarDesktopTerbuka ? "chevron_left" : "chevron_right"}
          className="text-[20px]"
        />
      </button>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar
          judul={item.judul}
          onBukaMenu={() => setMenuTerbuka(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full p-4 lg:p-6 space-y-6">
            <Outlet
              context={{
                pencarian: "",
                tampilkanNotifikasi,
              }}
            />
          </div>
        </main>
      </div>

      <ToastGlobal data={toast} onTutup={tutupNotifikasi} />
    </div>
  );
}
