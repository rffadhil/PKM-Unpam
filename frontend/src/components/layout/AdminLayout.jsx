import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import Icon from "@/components/ui/Icon";
import { cariItemNav } from "@/config/adminNav";
import { applyBrowserBranding } from "@/utils/browserBranding";

const KUNCI_SIDEBAR_DESKTOP = "cms_sidebar_desktop_terbuka";

// Membaca pilihan terakhir admin. Default: sidebar terbuka.
function bacaSidebarDesktop() {
  try {
    return localStorage.getItem(KUNCI_SIDEBAR_DESKTOP) !== "false";
  } catch {
    return true;
  }
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const item = cariItemNav(pathname);

  // Drawer untuk mobile
  const [menuTerbuka, setMenuTerbuka] = useState(false);

  // Tutup/buka sidebar untuk desktop (diingat antar halaman & refresh)
  const [sidebarDesktopTerbuka, setSidebarDesktopTerbuka] =
    useState(bacaSidebarDesktop);

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
      // Abaikan jika penyimpanan tidak tersedia
    }
  }, [sidebarDesktopTerbuka]);

  return (
    <div className="relative flex h-screen overflow-hidden bg-surface-light text-on-surface antialiased font-body-md text-body-md">
      <AdminSidebar
        terbuka={menuTerbuka}
        onTutup={() => setMenuTerbuka(false)}
        desktopTerbuka={sidebarDesktopTerbuka}
      />

      {/* Tab tutup/buka sidebar di tepi sidebar (khusus desktop) */}
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
            ? // Terbuka: tombol "<" putih
              "left-[248px] rounded-lg border-border-muted bg-surface-white text-primary hover:bg-cta-gold"
            : // Tertutup: tombol ">" hijau
              "left-0 rounded-r-lg border-l-0 border-secondary bg-secondary text-white hover:bg-primary-container")
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
            <Outlet context={{ pencarian: "" }} />
          </div>
        </main>
      </div>
    </div>
  );
}