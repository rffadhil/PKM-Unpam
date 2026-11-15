import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
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
    <div className="flex h-screen overflow-hidden bg-surface-light text-on-surface antialiased font-body-md text-body-md">
      <AdminSidebar
        terbuka={menuTerbuka}
        onTutup={() => setMenuTerbuka(false)}
        desktopTerbuka={sidebarDesktopTerbuka}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopbar
          judul={item.judul}
          onBukaMenu={() => setMenuTerbuka(true)}
          sidebarDesktopTerbuka={sidebarDesktopTerbuka}
          onToggleSidebar={() => setSidebarDesktopTerbuka((v) => !v)}
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