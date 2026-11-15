import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  UserRoundCheck,
  ChevronDown,
  ChevronRight,
  X,
  ArrowRight,
  Menu,
} from "lucide-react";
import ModalDokumen from "@/components/dokumen/ModalDokumen";
import { isPpdbAnnouncementActive } from "@/utils/ppdb";

// Breakpoint: di bawah lebar ini navbar berubah menjadi menu hamburger.
const BREAKPOINT_DESKTOP = 1024;

export default function Navbar({ portal, onBukaModalPpdb }) {
  const isPpdbAktif =
    portal?.ppdb !== false &&
    portal?.ppdb_online_aktif !== false &&
    portal?.ppdb !== "false" &&
    portal?.ppdb_online_aktif !== "false";
  const tampilkanPengumumanPpdb = isPpdbAnnouncementActive(portal);
  const location = useLocation();
  const navigate = useNavigate();

  const profileDropdownRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [hoverItem, setHoverItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dokumenOpen, setDokumenOpen] = useState(false);

  // State khusus mobile
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileProfilOpen, setMobileProfilOpen] = useState(false);

  const isProfile =
    location.pathname === "/profil" ||
    location.pathname.startsWith("/profil/");

  const isProfilHome = location.pathname === "/profil";
  const isVisiMisi = location.pathname === "/profil/visi-misi";
  const isGuru = location.pathname === "/profil/guru";

  // Menutup dropdown & menu mobile ketika halaman berpindah.
  useEffect(() => {
    setProfileOpen(false);
    setHoverItem("");
    setMenuOpen(false);
    setMobileProfilOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!profileOpen) return;

    const closeOnOutsideClick = (event) => {
      if (!profileDropdownRef.current?.contains(event.target)) {
        setProfileOpen(false);
        setHoverItem("");
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [profileOpen]);

  // Kunci scroll halaman saat menu mobile terbuka + tutup dengan tombol Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const overflowAwal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflowAwal;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Jika layar diperbesar ke ukuran desktop, tutup menu mobile.
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${BREAKPOINT_DESKTOP}px)`);
    const onChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const closeProfileDropdown = () => {
    setProfileOpen(false);
    setHoverItem("");
  };

  const closeAll = () => {
    closeProfileDropdown();
    setMenuOpen(false);
  };

  const bukaModalPpdb = () => {
    closeAll();
    if (onBukaModalPpdb) {
      onBukaModalPpdb();
    } else {
      window.dispatchEvent(new CustomEvent("buka_modal_ppdb"));
    }
  };

  // Fungsi pencarian global.
  const handleSearch = (event) => {
    event.preventDefault();

    const keyword = searchQuery.trim();

    if (!keyword) return;

    navigate(`/pencarian?q=${encodeURIComponent(keyword)}`);
    setSearchQuery("");
    closeAll();
  };

  // position: relative diatur lewat class .nav-item
  const navLinkStyle = (active = false) => ({
    textDecoration: "none",
    color: active ? "#34742c" : "#17202a",
    fontSize: "15px",
    fontWeight: active ? 700 : 500,
    whiteSpace: "nowrap",
    height: "68px",
    display: "flex",
    alignItems: "center",
  });

  // Style submenu tanpa ikon dan background ikon.
  const profileItemStyle = (active, hovered) => ({
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    width: "100%",
    minHeight: "44px",
    boxSizing: "border-box",
    padding: "12px 14px",
    borderRadius: "7px",
    background: active || hovered ? "#eaf4e6" : "transparent",
    color: active || hovered ? "#1f641b" : "#1e293b",
    fontWeight: active || hovered ? 700 : 400,
    fontSize: "13px",
    lineHeight: 1.4,
    transition: "all 0.2s ease",
  });

  // Daftar menu untuk tampilan mobile.
  const menuMobile = [
    { label: "Beranda", to: "/" },
    { label: "Berita", to: "/berita" },
    { label: "Agenda", to: "/agenda" },
    { label: "Galeri", to: "/galeri" },
    { label: "Kontak", to: "/kontak" },
  ];

  const subMenuProfil = [
    { label: "Profil Sekolah", to: "/profil", active: isProfilHome },
    { label: "Visi, Misi & Budaya Sekolah", to: "/profil/visi-misi", active: isVisiMisi },
    { label: "Guru & Tenaga Kependidikan", to: "/profil/guru", active: isGuru },
  ];

  return (
    <header
      style={{
        width: "100%",
        background: "#ffffff",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        zIndex: 1000,
        border: "none",
        boxShadow: "none",
      }}
    >
      <style>
        {`
          @keyframes pentingGlow {
            0% {
              opacity: 0.68;
              box-shadow: 0 0 0 rgba(229, 240, 0, 0);
            }

            50% {
              opacity: 1;
              box-shadow:
                0 0 7px rgba(229, 240, 0, 0.55),
                0 0 14px rgba(229, 240, 0, 0.28);
            }

            100% {
              opacity: 0.68;
              box-shadow: 0 0 0 rgba(229, 240, 0, 0);
            }
          }

          @keyframes pentingTextGlow {
            0% {
              text-shadow: 0 0 0 rgba(229, 240, 0, 0);
            }

            50% {
              text-shadow:
                0 0 5px rgba(229, 240, 0, 0.75),
                0 0 9px rgba(229, 240, 0, 0.35);
            }

            100% {
              text-shadow: 0 0 0 rgba(229, 240, 0, 0);
            }
          }

          .header-action-button {
            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease;
          }

          .header-action-button:hover {
            transform: translateY(-3px);
          }

          .header-document-button:hover {
            box-shadow: 0 5px 12px rgba(60, 122, 54, 0.22);
          }

          .header-ppdb-button:hover {
            box-shadow: 0 5px 12px rgba(130, 145, 0, 0.28);
          }

          .profile-dropdown {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transform: translateY(10px);
            transition:
              opacity 0.25s ease,
              transform 0.25s ease,
              visibility 0.25s ease;
          }

          .profile-dropdown.open {
            opacity: 1;
            visibility: visible;
            pointer-events: auto;
            transform: translateY(0);
          }

          /* Garis bawah hijau untuk semua menu navigasi */
          .nav-item {
            position: relative;
          }

          .nav-item::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: #34742c;
            transform: scaleX(0);
            transform-origin: center;
            transition: transform 0.2s ease;
          }

          .nav-item:hover::after,
          .nav-item.active::after {
            transform: scaleX(1);
          }

          .nav-item:hover {
            color: #34742c !important;
          }

          /* ===== MOBILE / RESPONSIF ===== */

          /* Tombol hamburger & panel mobile disembunyikan di desktop */
          .nav-burger,
          .nav-mobile-panel,
          .nav-backdrop {
            display: none;
          }

          .nav-burger {
            width: 44px;
            height: 44px;
            margin-left: auto;
            border: 1px solid #d8e2d5;
            border-radius: 10px;
            background: #ffffff;
            color: #103b16;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
          }

          .nav-burger:focus-visible,
          .m-link:focus-visible,
          .m-toggle:focus-visible {
            outline: 2px solid #34742c;
            outline-offset: -2px;
          }

          .m-link,
          .m-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            min-height: 50px;
            padding: 0 20px;
            box-sizing: border-box;
            border: none;
            border-bottom: 1px solid #eef2ed;
            background: #ffffff;
            color: #17202a;
            font-family: Arial, sans-serif;
            font-size: 15px;
            font-weight: 500;
            text-decoration: none;
            text-align: left;
            cursor: pointer;
          }

          .m-link.active,
          .m-toggle.active {
            color: #34742c;
            font-weight: 700;
            background: #f3f9f1;
          }

          .m-sublink {
            display: flex;
            align-items: center;
            min-height: 46px;
            padding: 0 20px 0 36px;
            box-sizing: border-box;
            border-bottom: 1px solid #e6eee3;
            background: #f6faf4;
            color: #1e293b;
            font-size: 14px;
            text-decoration: none;
          }

          .m-sublink.active {
            color: #1f641b;
            font-weight: 700;
            background: #eaf4e6;
          }

          @media (max-width: ${BREAKPOINT_DESKTOP - 1}px) {
            /* Sembunyikan menu desktop, tampilkan hamburger */
            .nav-desktop,
            .nav-actions {
              display: none !important;
            }

            .nav-burger {
              display: flex;
            }

            .nav-backdrop {
              display: block;
              position: fixed;
              inset: 0;
              background: rgba(10, 30, 12, 0.4);
              z-index: 2;
            }

            .nav-mobile-panel {
              display: block;
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              z-index: 4;
              max-height: calc(100vh - 68px);
              max-height: calc(100dvh - 68px);
              overflow-y: auto;
              background: #ffffff;
              border-bottom: 1px solid #e8ece8;
              box-shadow: 0 14px 28px rgba(25, 50, 30, 0.18);
            }

            /* Lebar kontainer mengikuti layar kecil */
            .nav-wrap {
              width: calc(100% - 32px) !important;
            }

            .nav-logo {
              width: auto !important;
              min-width: 0;
              flex-shrink: 1 !important;
            }

            .nav-logo-title {
              font-size: 20px !important;
            }

            /* Pengumuman: boleh turun baris, tidak terpotong */
            .ann-bar {
              height: auto !important;
              padding: 10px 0;
            }

            .ann-inner {
              flex-wrap: wrap;
              row-gap: 6px !important;
              align-items: flex-start !important;
            }

            .ann-text {
              white-space: normal !important;
              line-height: 1.45;
            }

            .ann-text-title {
              font-size: 12px !important;
            }

            .ann-text-body {
              flex: 1 1 100%;
              order: 5;
            }

            .ann-link {
              order: 6;
            }

            .ann-close {
              order: 3;
            }
          }

          @media (max-width: 380px) {
            .nav-logo-title {
              font-size: 17px !important;
            }

            .nav-logo-sub {
              font-size: 8px !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .profile-dropdown,
            .nav-item::after,
            .header-action-button {
              transition: none;
            }
          }
        `}
      </style>

      {/* PENGUMUMAN */}
      {tampilkanPengumumanPpdb && announcementOpen && (
        <div
          className="ann-bar"
          style={{
            width: "100%",
            height: "50px",
            boxSizing: "border-box",
            background: "#003804",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            fontSize: "13px",
          }}
        >
          <div
            className="nav-wrap ann-inner"
            style={{
              width: "calc(100% - 80px)",
              maxWidth: "1740px",
              height: "100%",
              margin: "0 auto",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              gap: "9px",
            }}
          >
            <span
              style={{
                background: "#e5f000",
                color: "#1d400f",
                padding: "7px 12px",
                borderRadius: "5px",
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.3px",
                animation: "pentingGlow 1.8s ease-in-out infinite",
                flexShrink: 0,
              }}
            >
              PENTING
            </span>

            <span
              className="ann-text ann-text-title"
              style={{
                color: "#e5f000",
                fontWeight: 800,
                fontSize: "13px",
                animation: "pentingTextGlow 1.8s ease-in-out infinite",
                whiteSpace: "nowrap",
              }}
            >
              PPDB {portal.ppdbTahunAjaran}:
            </span>

            <span
              className="ann-text ann-text-body"
              style={{
                color: "#ffffff",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              {portal.ppdbPengumuman}
            </span>

            <Link
              to="/ppdb"
              onClick={closeAll}
              className="ann-link"
              style={{
                color: "#e5f000",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "3px",
                whiteSpace: "nowrap",
              }}
            >
              Lihat Panduan & Syarat
              <ArrowRight size={13} />
            </Link>

            <button
              type="button"
              className="ann-close"
              onClick={() => setAnnouncementOpen(false)}
              aria-label="Tutup pengumuman"
              style={{
                marginLeft: "auto",
                border: "none",
                background: "transparent",
                color: "#d7e1d5",
                padding: "3px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>
      )}

      {/* Latar gelap di belakang menu mobile (klik untuk menutup) */}
      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* NAVBAR UTAMA */}
      <div
        style={{
          width: "100%",
          height: "68px",
          borderBottom: "1px solid #e8ece8",
          boxSizing: "border-box",
          background: "#ffffff",
          position: "relative",
          zIndex: 3,
        }}
      >
        <div
          className="nav-wrap"
          style={{
            width: "calc(100% - 80px)",
            maxWidth: "1740px",
            height: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* NAMA SEKOLAH */}
          <Link
            to="/"
            onClick={closeAll}
            className="nav-logo"
            style={{
              textDecoration: "none",
              width: "300px",
              flexShrink: 0,
            }}
          >
            <div
              className="nav-logo-title"
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "24px",
                fontWeight: 700,
                color: "#103b16",
                lineHeight: 1.05,
                whiteSpace: "nowrap",
              }}
            >
              SMA Harapan Jaya
            </div>

            <div
              className="nav-logo-sub"
              style={{
                marginTop: "6px",
                color: "#78849a",
                fontSize: "9px",
                lineHeight: 1.35,
                letterSpacing: "0.15px",
                maxWidth: "240px",
                whiteSpace: "nowrap",
              }}
            >
              AKREDITASI UNGGUL (A) BAN-S/M
            </div>
          </Link>

          {/* MENU UTAMA (DESKTOP) */}
          <nav
            className="nav-desktop"
            aria-label="Navigasi utama"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "29px",
              height: "68px",
              marginLeft: "28px",
              flexShrink: 0,
            }}
          >
            {/* BERANDA */}
            <Link
              to="/"
              onClick={closeProfileDropdown}
              className={`nav-item ${
                !profileOpen && location.pathname === "/" ? "active" : ""
              }`}
              style={navLinkStyle(!profileOpen && location.pathname === "/")}
            >
              Beranda
            </Link>

            {/* PROFIL */}
            <div
              ref={profileDropdownRef}
              style={{
                position: "relative",
                height: "68px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((previous) => !previous);
                  setHoverItem("");
                }}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className={`nav-item ${
                  isProfile || profileOpen ? "active" : ""
                }`}
                style={{
                  ...navLinkStyle(isProfile || profileOpen),
                  gap: "5px",
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Profil
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  style={{
                    transform: profileOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "0.2s",
                  }}
                />
              </button>

              {/* DROPDOWN PROFIL */}
              <div
                className={`profile-dropdown ${profileOpen ? "open" : ""}`}
                style={{
                  position: "absolute",
                  top: "58px",
                  left: "-28px",
                  width: "265px",
                  background: "#ffffff",
                  border: "1px solid #e1e8df",
                  borderRadius: "10px",
                  boxShadow: "0 8px 25px rgba(25,50,30,0.14)",
                  padding: "9px",
                  boxSizing: "border-box",
                }}
              >
                <Link
                  to="/profil"
                  onClick={closeProfileDropdown}
                  onMouseEnter={() => setHoverItem("profil")}
                  onMouseLeave={() => setHoverItem("")}
                  style={profileItemStyle(
                    isProfilHome,
                    hoverItem === "profil"
                  )}
                >
                  <span>Profil Sekolah</span>
                  <ChevronRight size={15} />
                </Link>

                <Link
                  to="/profil/visi-misi"
                  onClick={closeProfileDropdown}
                  onMouseEnter={() => setHoverItem("visi")}
                  onMouseLeave={() => setHoverItem("")}
                  style={profileItemStyle(
                    isVisiMisi,
                    hoverItem === "visi"
                  )}
                >
                  <span>Visi, Misi & Budaya Sekolah</span>
                  <ChevronRight size={15} />
                </Link>

                <Link
                  to="/profil/guru"
                  onClick={closeProfileDropdown}
                  onMouseEnter={() => setHoverItem("guru")}
                  onMouseLeave={() => setHoverItem("")}
                  style={profileItemStyle(
                    isGuru,
                    hoverItem === "guru"
                  )}
                >
                  <span>Guru & Tenaga Kependidikan</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* BERITA */}
            <Link
              to="/berita"
              onClick={closeProfileDropdown}
              className={`nav-item ${
                !profileOpen && location.pathname === "/berita" ? "active" : ""
              }`}
              style={navLinkStyle(
                !profileOpen && location.pathname === "/berita"
              )}
            >
              Berita
            </Link>

            {/* AGENDA */}
            <Link
              to="/agenda"
              onClick={closeProfileDropdown}
              className={`nav-item ${
                !profileOpen && location.pathname === "/agenda" ? "active" : ""
              }`}
              style={navLinkStyle(
                !profileOpen && location.pathname === "/agenda"
              )}
            >
              Agenda
            </Link>

            {/* GALERI */}
            <Link
              to="/galeri"
              onClick={closeProfileDropdown}
              className={`nav-item ${
                !profileOpen && location.pathname === "/galeri" ? "active" : ""
              }`}
              style={navLinkStyle(
                !profileOpen && location.pathname === "/galeri"
              )}
            >
              Galeri
            </Link>

            {/* KONTAK */}
            <Link
              to="/kontak"
              onClick={closeProfileDropdown}
              className={`nav-item ${
                !profileOpen && location.pathname === "/kontak" ? "active" : ""
              }`}
              style={navLinkStyle(
                !profileOpen && location.pathname === "/kontak"
              )}
            >
              Kontak
            </Link>
          </nav>

          {/* BAGIAN KANAN (DESKTOP) */}
          <div
            className="nav-actions"
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              flexShrink: 0,
            }}
          >
            {/* DOKUMEN */}
            <button
              type="button"
              onClick={() => {
                closeProfileDropdown();
                setDokumenOpen(true);
              }}
              className="header-action-button header-document-button"
              style={{
                textDecoration: "none",
                width: "115px",
                height: "42px",
                border: "1px solid #3c7a36",
                color: "#286322",
                borderRadius: "9px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 600,
                flexShrink: 0,
                background: "#ffffff",
                cursor: "pointer",
              }}
            >
              Dokumen
            </button>

            {/* DAFTAR PPDB */}
            {isPpdbAktif ? (
              <Link
                to="/ppdb"
                onClick={closeProfileDropdown}
                className="header-action-button header-ppdb-button"
                style={{
                  textDecoration: "none",
                  width: "135px",
                  height: "42px",
                  background: "#e5f000",
                  color: "#183c12",
                  borderRadius: "25px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <UserRoundCheck size={15} />
                Daftar PPDB
              </Link>
            ) : (
              <button
                type="button"
                onClick={bukaModalPpdb}
                className="header-action-button header-ppdb-button"
                style={{
                  border: "none",
                  width: "135px",
                  height: "42px",
                  background: "#e5f000",
                  color: "#183c12",
                  borderRadius: "25px",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 800,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <UserRoundCheck size={15} />
                Daftar PPDB
              </button>
            )}
          </div>

          {/* TOMBOL HAMBURGER (MOBILE) */}
          <button
            type="button"
            className="nav-burger"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* PANEL MENU MOBILE */}
        {menuOpen && (
          <nav
            id="menu-mobile"
            className="nav-mobile-panel"
            aria-label="Navigasi utama"
          >
            {/* Beranda */}
            <Link
              to="/"
              onClick={closeAll}
              className={`m-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Beranda
            </Link>

            {/* Profil (accordion) */}
            <button
              type="button"
              className={`m-toggle ${isProfile ? "active" : ""}`}
              onClick={() => setMobileProfilOpen((previous) => !previous)}
              aria-expanded={mobileProfilOpen}
            >
              Profil
              <ChevronDown
                size={18}
                style={{
                  transform: mobileProfilOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>

            {mobileProfilOpen &&
              subMenuProfil.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeAll}
                  className={`m-sublink ${item.active ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}

            {/* Menu lainnya */}
            {menuMobile
              .filter((item) => item.to !== "/")
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeAll}
                  className={`m-link ${
                    location.pathname === item.to ? "active" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}

            {/* Tombol aksi */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "16px 20px 20px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  closeAll();
                  setDokumenOpen(true);
                }}
                style={{
                  width: "100%",
                  height: "46px",
                  border: "1px solid #3c7a36",
                  color: "#286322",
                  borderRadius: "9px",
                  background: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                Dokumen
              </button>

              {isPpdbAktif ? (
                <Link
                  to="/ppdb"
                  onClick={closeAll}
                  style={{
                    textDecoration: "none",
                    width: "100%",
                    height: "46px",
                    background: "#e5f000",
                    color: "#183c12",
                    borderRadius: "25px",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: 800,
                  }}
                >
                  <UserRoundCheck size={16} />
                  Daftar PPDB
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={bukaModalPpdb}
                  style={{
                    border: "none",
                    width: "100%",
                    height: "46px",
                    background: "#e5f000",
                    color: "#183c12",
                    borderRadius: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: 800,
                    fontFamily: "inherit",
                    cursor: "pointer",
                  }}
                >
                  <UserRoundCheck size={16} />
                  Daftar PPDB
                </button>
              )}
            </div>
          </nav>
        )}
      </div>

      {dokumenOpen && (
        <ModalDokumen onTutup={() => setDokumenOpen(false)} />
      )}
    </header>
  );
}