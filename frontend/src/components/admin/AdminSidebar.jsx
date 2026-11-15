/** @format */

import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import Icon from "@/components/ui/Icon";
import Avatar from "@/components/ui/Avatar";
import { site } from "@/config/site";
import { adminNavItems } from "@/config/adminNav";
import { adminUser } from "@/mocks/admin";
import { getActiveAdmin, logout } from "@/services/authService";

const BADGE_BAWAAN =
  "bg-surface-white/20 text-surface-white text-[11px] font-semibold px-2 py-0.5 rounded-full";
const BADGE_MERAH =
  "bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded-full";

export default function AdminSidebar({ terbuka, onTutup }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [profil, setProfil] = useState(() => getActiveAdmin(adminUser));
  const [konfirmasiKeluar, setKonfirmasiKeluar] = useState(false);
  const [sedangKeluar, setSedangKeluar] = useState(false);

  // Buka otomatis sub-menu Profil & Staf jika sedang berada di halaman /admin/profil-staf/*
  const sedangDiProfilStaf = pathname.startsWith("/admin/profil-staf");
  const [subOverride, setSubOverride] = useState(null);
  const subTerbuka =
    subOverride?.pathname === pathname
      ? subOverride.open
      : sedangDiProfilStaf;

  useEffect(() => {
    const sinkron = () => setProfil(getActiveAdmin(adminUser));
    window.addEventListener("cms_user_updated", sinkron);
    return () => window.removeEventListener("cms_user_updated", sinkron);
  }, []);

  function handleKeluar(e) {
    e.preventDefault();
    setKonfirmasiKeluar(true);
  }

  async function prosesKeluar() {
    if (sedangKeluar) return;

    setSedangKeluar(true);
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } catch {
      setSedangKeluar(false);
    }
  }

  return (
    <>
      {terbuka && (
        <div
          className="fixed inset-0 z-30 bg-primary/50 lg:hidden"
          onClick={onTutup}
          aria-hidden="true"
        />
      )}
      <aside
        aria-label="Sidebar CMS"
        className={clsx(
          "w-[260px] bg-primary-container shrink-0 flex flex-col justify-between h-full select-none shadow-xl z-40",
          "fixed inset-y-0 left-0 transition-transform duration-200 lg:static lg:translate-x-0",
          terbuka ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col min-h-0">
          {/* Identitas CMS */}
          <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center">
            <div className="min-w-0">
              <span className="block text-sm font-bold text-surface-white truncate leading-tight">
                CMS {site.nama}
                </span>
                <span className="block text-[12px] text-surface-white/70 truncate">
                Portal Publikasi &amp; Informasi
              </span>
            </div>
          </div>
          </div>

          {/* Navigasi */}
          <nav
            aria-label="Navigasi CMS"
            className="px-3 py-4 space-y-1.5 overflow-y-auto"
          >
            <div className="px-3 pt-1 pb-1.5 text-[11px] font-bold tracking-wider text-surface-white/50 uppercase">
              Navigasi Utama
            </div>
            {adminNavItems.map((item) => {
              // Jika item memiliki sub-menu (Profil & Staf)
              if (item.children) {
                const aktifInduk =
                  pathname === item.to || pathname.startsWith(`${item.to}/`);
                return (
                  <div key={item.to} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setSubOverride({ pathname, open: !subTerbuka });
                      }}
                      aria-expanded={subTerbuka}
                      aria-controls="submenu-profil-staf"
                      className={clsx(
                        "w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg transition-colors text-left",
                        aktifInduk
                        ? "bg-secondary/60 text-surface-white font-bold"
                        : "text-surface-white/80 hover:text-surface-white hover:bg-secondary/40 font-medium",
                      )}
                    >

                      <span className="flex items-center gap-3 min-w-0">
                        <Icon name={item.ikon} className="text-[20px]" />
                        <span className="font-label-lg text-label-lg">
                          {item.label}
                        </span>
                      </span>
                      <Icon
                        name="expand_more"
                        className={clsx(
                          "text-[20px] transition-transform duration-200",
                          subTerbuka
                            ? "rotate-180 text-cta-gold"
                            : "opacity-70",
                        )}
                      />
                    </button>

                    {subTerbuka && (
                      <div id="submenu-profil-staf" className="ml-5 pl-3 border-l-2 border-white/15 space-y-1 py-0.5">
                        {item.children.map((sub) => (
                          <NavLink
                            key={sub.to}
                            to={sub.to}
                            onClick={onTutup}
                            className={({ isActive }) =>
                              clsx(
                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors",
                                isActive
                                  ? "bg-cta-gold text-primary font-bold shadow-sm"
                                  : "text-surface-white/75 hover:text-surface-white hover:bg-white/10 font-medium",
                              )
                            }
                          >
                            <Icon name={sub.ikon} className="text-[17px]" />
                            <span className="truncate">{sub.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Item menu biasa tanpa sub-menu
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onTutup}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-cta-gold text-primary font-bold"
                        : "text-surface-white/80 hover:text-surface-white hover:bg-secondary/40 font-medium",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3 min-w-0">
                        <Icon name={item.ikon} className="text-[20px]" />
                        <span className="font-label-lg text-label-lg">
                          {item.label}
                        </span>
                      </span>
                      {item.badge && (
                        <span
                          className={
                            item.badgeTone === "merah"
                              ? BADGE_MERAH
                              : BADGE_BAWAAN
                          }
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.ikonKanan && (
                        <Icon
                          name={item.ikonKanan}
                          className={clsx(
                            "text-[20px]",
                            !isActive && "opacity-60",
                          )}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Akun & keluar */}
        <div className="p-3 border-t border-white/10 bg-primary/40">
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-primary-container/60 border border-white/10">
            <Avatar
              ukuran="lg"
              nama={profil.namaSingkat}
              inisial={profil.inisial}
              src={profil.foto}
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm text-surface-white font-bold truncate leading-tight">
                {profil.namaSingkat}
              </span>
              <span className="text-[12px] text-surface-white/70 truncate">
                {profil.jabatan}
              </span>
            </div>
            <Link
              to="/admin/pengaturan"
              aria-label="Pengaturan akun"
              className="shrink-0 rounded-md p-1.5 text-surface-white/70 hover:bg-white/10 hover:text-surface-white"
            >
              <Icon name="tune" className="text-[20px]" />
            </Link>
          </div>
          <button
            type="button"
            onClick={handleKeluar}
            disabled={sedangKeluar}
            className="w-full flex items-center justify-center gap-2.5 px-3 py-2 rounded-lg text-surface-white/80 hover:text-surface-white hover:bg-white/10 transition-colors font-medium text-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            {sedangKeluar ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-surface-white/70 border-t-transparent" aria-label="Sedang keluar" />
                <span>Keluar...</span>
              </>
            ) : (
              <>
                <Icon name="logout" className="text-[18px]" />
                <span>Keluar dari Sistem</span>
              </>
            )}
          </button>
        </div>
              </aside>

      {/* Modal Konfirmasi Keluar */}
      {konfirmasiKeluar && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setKonfirmasiKeluar(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="judul-konfirmasi-keluar"
            aria-describedby="deskripsi-konfirmasi-keluar"
            className="w-full max-w-md bg-surface-white rounded-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ikon Peringatan */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <Icon
                  name="logout"
                  className="text-[32px] text-red-600"
                />
              </div>
            </div>

            {/* Judul dan Deskripsi */}
            <div className="text-center mb-6">
              <h2
                id="judul-konfirmasi-keluar"
                className="text-xl font-bold text-gray-900 mb-2"
              >
                Konfirmasi Keluar
              </h2>

              <p
                id="deskripsi-konfirmasi-keluar"
                className="text-sm text-gray-500 leading-relaxed"
              >
                Apakah Anda yakin ingin keluar dari sistem CMS
                SMA Harapan Jaya? Anda perlu login kembali
                untuk mengakses halaman administrator.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setKonfirmasiKeluar(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={prosesKeluar}
                disabled={sedangKeluar}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sedangKeluar ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" aria-label="Sedang keluar" />
                    Memproses...
                  </span>
                ) : (
                  'Ya, Keluar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
