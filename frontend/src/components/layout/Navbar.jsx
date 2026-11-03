<<<<<<< HEAD

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
=======
/** @format */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
import {
  Search,
  UserRoundCheck,
  ChevronDown,
  School,
  Target,
  Users,
  ChevronRight,
  X,
  ArrowRight,
} from "lucide-react";
import ModalDokumen from "@/components/dokumen/ModalDokumen";
import { mockPengaturan } from "@/mocks/adminPengaturan";

export default function Navbar({ portal = mockPengaturan }) {
  const location = useLocation();
<<<<<<< HEAD

=======
  const navigate = useNavigate();
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
  const [profileOpen, setProfileOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [hoverItem, setHoverItem] = useState("");
  const [dokumenOpen, setDokumenOpen] = useState(false);
  const [kataCari, setKataCari] = useState("");

  const ppdbAktif = portal?.ppdb !== false;
  const namaSekolah = portal?.namaInstitusi || "SMA Harapan Jaya";
  const akreditasi = portal?.akreditasi
    ? `AKREDITASI ${String(portal.akreditasi).toUpperCase()}`
    : "AKREDITASI UNGGUL (A) BAN-S/M";

  const isProfile =
    location.pathname === "/profil" || location.pathname.startsWith("/profil/");

  const isProfilHome = location.pathname === "/profil";
  const isVisiMisi = location.pathname === "/profil/visi-misi";
  const isGuru = location.pathname === "/profil/guru";

  // Menutup dropdown ketika halaman berpindah.
  useEffect(() => {
    setProfileOpen(false);
    setHoverItem("");
  }, [location.pathname]);

  const closeProfileDropdown = () => {
    setProfileOpen(false);
    setHoverItem("");
  };

  const navLinkStyle = (active = false) => ({
    textDecoration: "none",
    color: active ? "#34742c" : "#17202a",
    fontSize: "15px",
    fontWeight: active ? 700 : 500,
    whiteSpace: "nowrap",
    height: "68px",
    display: "flex",
    alignItems: "center",
    position: "relative",
  });

<<<<<<< HEAD
  const profileItemStyle = (active, hovered) => ({
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "9px",
    borderRadius: "7px",
    background:
      active || hovered ? "#eaf4e6" : "transparent",
    color:
      active || hovered ? "#1f641b" : "#1e293b",
    fontWeight: active || hovered ? 700 : 400,
    transition: "all 0.2s ease",
  });

  const profileIconStyle = (active, hovered) => ({
    width: "30px",
    height: "30px",
    borderRadius: "6px",
    background:
      active || hovered ? "#277421" : "#eff7eb",
    color:
      active || hovered ? "#ffffff" : "#3f8736",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s ease",
  });
=======
  const handleCariSubmit = (e) => {
    e.preventDefault();
    const q = kataCari.trim();
    if (q) {
      navigate(`/berita?q=${encodeURIComponent(q)}`);
    }
  };
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467

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
            box-shadow:
              0 5px 12px rgba(60, 122, 54, 0.22);
          }

          .header-ppdb-button:hover {
            box-shadow:
              0 5px 12px rgba(130, 145, 0, 0.28);
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
        `}
      </style>

      {/* PENGUMUMAN PPDB (Hanya muncul bila PPDB diizinkan) */}
      {announcementOpen && ppdbAktif && (
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
              Pendaftaran PPDB Jalur Prestasi & Zonasi TP 2026/2027 Resmi Dibuka
              Mulai 15 Mei 2026.
            </span>

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
          {/* LOGO & NAMA SEKOLAH */}
          <Link
            to="/"
            onClick={closeProfileDropdown}
            style={{
              textDecoration: "none",
              width: "300px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {portal?.logo && (
              <img
                src={portal.logo}
                alt={`Logo ${namaSekolah}`}
                style={{
                  width: "40px",
                  height: "40px",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />
            )}
            <div>
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
                {namaSekolah}
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
                {akreditasi}
              </div>
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
<<<<<<< HEAD
            <Link
              to="/"
              onClick={closeProfileDropdown}
              style={navLinkStyle(
                !profileOpen && location.pathname === "/"
              )}
            >
              Beranda

              {!profileOpen && location.pathname === "/" && (
=======
            <Link to="/" style={navLinkStyle(location.pathname === "/")}>
              Beranda
              {location.pathname === "/" && (
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
                <span
                  style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    right: "0",
                    height: "2px",
                    background: "#34742c",
                  }}
                />
              )}
            </Link>

            {/* PROFIL */}
            <div
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
                style={{
                  ...navLinkStyle(isProfile || profileOpen),
                  gap: "5px",
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "Arial, sans-serif",
                  fontWeight:
                    profileOpen || isProfile ? 700 : 500,
                  color:
                    profileOpen || isProfile
                      ? "#34742c"
                      : "#17202a",
                  transition: "all 0.2s ease",
                }}
              >
<<<<<<< HEAD
                <span
                  style={{
                    height: "68px",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  Profil

                  {(isProfile || profileOpen) && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "100%",
                        height: "2px",
                        background: "#34742c",
                      }}
                    />
                  )}
                </span>

=======
                Profil
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
                <ChevronDown
                  size={14}
                  strokeWidth={2}
                  style={{
                    transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "0.2s",
                  }}
                />
<<<<<<< HEAD
              </button>

              {/* DROPDOWN PROFIL */}
              <div
                className={`profile-dropdown ${
                  profileOpen ? "open" : ""
                }`}
                style={{
                  position: "absolute",
                  top: "58px",
                  left: "-28px",
                  width: "250px",
                  background: "#ffffff",
                  border: "1px solid #e1e8df",
                  borderRadius: "10px",
                  boxShadow:
                    "0 8px 25px rgba(25,50,30,0.14)",
                  padding: "9px",
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
                  <span
                    style={profileIconStyle(
                      isProfilHome,
                      hoverItem === "profil"
                    )}
                  >
                    <School size={16} strokeWidth={2.5} />
                  </span>

=======
                {isProfile && (
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
                  <span
                    style={{
                      flex: 1,
                      fontSize: "13px",
                    }}
                  >
                    Profil Sekolah
                  </span>

<<<<<<< HEAD
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
                  <span
                    style={profileIconStyle(
                      isVisiMisi,
                      hoverItem === "visi"
                    )}
                  >
                    <Target size={16} strokeWidth={2.5} />
                  </span>

                  <span
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      lineHeight: 1.35,
                    }}
                  >
                    Visi, Misi & Budaya
                    <br />
                    Sekolah
                  </span>

                  <ChevronRight size={15} />
                </Link>
=======
              {/* DROPDOWN */}
              {profileOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "58px",
                    left: "-28px",
                    width: "250px",
                    background: "#ffffff",
                    border: "1px solid #e1e8df",
                    borderRadius: "10px",
                    boxShadow: "0 8px 25px rgba(25,50,30,0.14)",
                    padding: "9px",
                  }}
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => {
                    setProfileOpen(false);
                    setHoverItem("");
                  }}
                >
                  <Link
                    to="/profil"
                    onMouseEnter={() => setHoverItem("profil")}
                    onMouseLeave={() => setHoverItem("")}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "9px",
                      borderRadius: "7px",
                      background:
                        hoverItem === "profil" ? "#eaf4e6" : "transparent",
                      color: hoverItem === "profil" ? "#1f641b" : "#173c19",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        background:
                          hoverItem === "profil" ? "#277421" : "#eff7eb",
                        color: hoverItem === "profil" ? "#ffffff" : "#3f8736",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <School size={16} />
                    </span>

                    <span
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        fontWeight: hoverItem === "profil" ? 700 : 400,
                      }}
                    >
                      Profil Sekolah
                    </span>
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467

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
                  <span
                    style={profileIconStyle(
                      isGuru,
                      hoverItem === "guru"
                    )}
                  >
                    <Users size={16} strokeWidth={2.5} />
                  </span>

<<<<<<< HEAD
                  <span
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      lineHeight: 1.35,
                    }}
                  >
                    Guru & Tenaga
                    <br />
                    Kependidikan
                  </span>

                  <ChevronRight size={15} />
                </Link>
              </div>
=======
                  <Link
                    to="/profil/visi-misi"
                    onMouseEnter={() => setHoverItem("visi")}
                    onMouseLeave={() => setHoverItem("")}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "9px",
                      borderRadius: "7px",
                      background:
                        hoverItem === "visi" ? "#eaf4e6" : "transparent",
                      color: hoverItem === "visi" ? "#1f641b" : "#1e293b",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        background:
                          hoverItem === "visi" ? "#277421" : "#eff7eb",
                        color: hoverItem === "visi" ? "#ffffff" : "#3f8736",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Target size={15} />
                    </span>

                    <span
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        lineHeight: 1.35,
                        fontWeight: hoverItem === "visi" ? 700 : 400,
                      }}
                    >
                      Visi, Misi & Budaya
                      <br />
                      Sekolah
                    </span>

                    <ChevronRight size={15} />
                  </Link>

                  <Link
                    to="/profil/guru"
                    onMouseEnter={() => setHoverItem("guru")}
                    onMouseLeave={() => setHoverItem("")}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "9px",
                      borderRadius: "7px",
                      background:
                        hoverItem === "guru" ? "#eaf4e6" : "transparent",
                      color: hoverItem === "guru" ? "#1f641b" : "#1e293b",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        background:
                          hoverItem === "guru" ? "#277421" : "#eff7eb",
                        color: hoverItem === "guru" ? "#ffffff" : "#3f8736",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Users size={15} />
                    </span>

                    <span
                      style={{
                        flex: 1,
                        fontSize: "13px",
                        lineHeight: 1.35,
                        fontWeight: hoverItem === "guru" ? 700 : 400,
                      }}
                    >
                      Guru & Tenaga
                      <br />
                      Kependidikan
                    </span>

                    <ChevronRight size={15} />
                  </Link>
                </div>
              )}
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
            </div>

            {/* BERITA */}
            <Link
              to="/berita"
<<<<<<< HEAD
              onClick={closeProfileDropdown}
              style={navLinkStyle(
                !profileOpen && location.pathname === "/berita"
              )}
=======
              style={navLinkStyle(location.pathname === "/berita")}
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
            >
              Berita
            </Link>

            {/* AGENDA */}
            <Link
              to="/agenda"
<<<<<<< HEAD
              onClick={closeProfileDropdown}
              style={navLinkStyle(
                !profileOpen && location.pathname === "/agenda"
              )}
=======
              style={navLinkStyle(location.pathname === "/agenda")}
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
            >
              Agenda
            </Link>

            {/* GALERI */}
            <Link
              to="/galeri"
<<<<<<< HEAD
              onClick={closeProfileDropdown}
              style={navLinkStyle(
                !profileOpen && location.pathname === "/galeri"
              )}
=======
              style={navLinkStyle(location.pathname === "/galeri")}
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
            >
              Galeri
            </Link>

            {/* KONTAK */}
            <Link
              to="/kontak"
<<<<<<< HEAD
              onClick={closeProfileDropdown}
              style={navLinkStyle(
                !profileOpen && location.pathname === "/kontak"
              )}
=======
              style={navLinkStyle(location.pathname === "/kontak")}
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
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
            {/* SEARCH */}
            <form
              onSubmit={handleCariSubmit}
              style={{
                width: "260px",
                height: "42px",
                border: "1px solid #dce4ec",
                borderRadius: "9px",
                display: "flex",
                alignItems: "center",
                padding: "0 13px",
                boxSizing: "border-box",
                background: "#fafbfd",
              }}
            >
              <Search size={15} color="#8492a3" />

              <input
                value={kataCari}
                onChange={(e) => setKataCari(e.target.value)}
                placeholder="Cari data artikel, agenda, pesan..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  marginLeft: "8px",
                  fontSize: "10px",
                  color: "#596574",
                }}
              />
            </form>

            {/* DOKUMEN */}
<<<<<<< HEAD
            <Link
              to="/dokumen"
              onClick={closeProfileDropdown}
=======
            <button
              type="button"
              onClick={() => setDokumenOpen(true)}
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
              className="header-action-button header-document-button"
              style={{
                width: "115px",
                height: "42px",
                border: "1px solid #3c7a36",
                background: "#ffffff",
                color: "#286322",
                borderRadius: "9px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Dokumen
            </button>

<<<<<<< HEAD
            {/* DAFTAR PPDB */}
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
=======
            {/* TOMBOL CTA EMAS DAFTAR PPDB (Hanya muncul bila saklar PPDB aktif) */}
            {ppdbAktif && (
              <Link
                to="/ppdb"
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
            )}
>>>>>>> 3f82f693003e9e40f2df5d59b1aec894599a8467
          </div>
        </div>
      </div>

      {/* MODAL DOKUMEN */}
      {dokumenOpen && <ModalDokumen onTutup={() => setDokumenOpen(false)} />}
    </header>
  );
}
