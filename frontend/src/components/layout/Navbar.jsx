import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  UserRoundCheck,
  ChevronDown,
  ChevronRight,
  X,
  ArrowRight,
} from "lucide-react";
import ModalDokumen from "@/components/dokumen/ModalDokumen";

export default function Navbar({ portal, onBukaModalPpdb }) {
  const isPpdbAktif =
    portal?.ppdb !== false &&
    portal?.ppdb_online_aktif !== false &&
    portal?.ppdb !== "false" &&
    portal?.ppdb_online_aktif !== "false";
  const location = useLocation();
  const navigate = useNavigate();

  const profileDropdownRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [hoverItem, setHoverItem] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dokumenOpen, setDokumenOpen] = useState(false);

  const isProfile =
    location.pathname === "/profil" ||
    location.pathname.startsWith("/profil/");

  const isProfilHome = location.pathname === "/profil";
  const isVisiMisi = location.pathname === "/profil/visi-misi";
  const isGuru = location.pathname === "/profil/guru";

  // Menutup dropdown ketika halaman berpindah.
  useEffect(() => {
    setProfileOpen(false);
    setHoverItem("");
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

  const closeProfileDropdown = () => {
    setProfileOpen(false);
    setHoverItem("");
  };

  // Fungsi pencarian global.
  const handleSearch = (event) => {
    event.preventDefault();

    const keyword = searchQuery.trim();

    if (!keyword) return;

    navigate(`/pencarian?q=${encodeURIComponent(keyword)}`);
    setSearchQuery("");
    closeProfileDropdown();
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
        `}
      </style>

      {/* PENGUMUMAN */}
      {announcementOpen && (
        <div
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
              style={{
                color: "#e5f000",
                fontWeight: 800,
                fontSize: "13px",
                animation: "pentingTextGlow 1.8s ease-in-out infinite",
                whiteSpace: "nowrap",
              }}
            >
              PPDB 2026/2027:
            </span>

            <span
              style={{
                color: "#ffffff",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              Pendaftaran PPDB Jalur Prestasi & Zonasi TP
              2026/2027 Resmi Dibuka Mulai 15 Mei 2026.
            </span>

            {isPpdbAktif ? (
              <Link
                to="/ppdb"
                onClick={closeProfileDropdown}
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
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeProfileDropdown();
                  setModalPpdbOpen(true);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "inherit",
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
              </button>
            )}

            <button
              type="button"
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

      {/* NAVBAR UTAMA */}
      <div
        style={{
          width: "100%",
          height: "68px",
          borderBottom: "1px solid #e8ece8",
          boxSizing: "border-box",
          background: "#ffffff",
        }}
      >
        <div
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
            onClick={closeProfileDropdown}
            style={{
              textDecoration: "none",
              width: "300px",
              flexShrink: 0,
            }}
          >
            <div
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

          {/* MENU UTAMA */}
          <nav
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
                {/* 1. PROFIL SEKOLAH */}
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

                {/* 2. VISI MISI */}
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

                {/* 3. GURU DAN TENAGA KEPENDIDIKAN */}
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

          {/* BAGIAN KANAN */}
          <div
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
                onClick={() => {
                  closeProfileDropdown();
                  if (onBukaModalPpdb) {
                    onBukaModalPpdb();
                  } else {
                    window.dispatchEvent(new CustomEvent("buka_modal_ppdb"));
                  }
                }}
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
        </div>
      </div>

      {dokumenOpen && (
        <ModalDokumen onTutup={() => setDokumenOpen(false)} />
      )}
    </header>
  );
}