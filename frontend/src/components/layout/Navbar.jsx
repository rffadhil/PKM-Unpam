import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

export default function Navbar() {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [hoverItem, setHoverItem] = useState("");

  const isProfile =
    location.pathname === "/profil" ||
    location.pathname.startsWith("/profil/");

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
                animation:
                  "pentingGlow 1.8s ease-in-out infinite",
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
                animation:
                  "pentingTextGlow 1.8s ease-in-out infinite",
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

            <Link
              to="/ppdb"
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
          {/* NAMA SEKOLAH */}
          <Link
            to="/"
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
              style={navLinkStyle(location.pathname === "/")}
            >
              Beranda

              {location.pathname === "/" && (
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
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => {
                setProfileOpen(false);
                setHoverItem("");
              }}
            >
              <Link
                to="/profil"
                style={{
                  ...navLinkStyle(isProfile),
                  gap: "5px",
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

                {isProfile && (
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
                    boxShadow:
                      "0 8px 25px rgba(25,50,30,0.14)",
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
                    onMouseEnter={() =>
                      setHoverItem("profil")
                    }
                    onMouseLeave={() => setHoverItem("")}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "9px",
                      borderRadius: "7px",
                      background:
                        hoverItem === "profil"
                          ? "#eaf4e6"
                          : "transparent",
                      color:
                        hoverItem === "profil"
                          ? "#1f641b"
                          : "#173c19",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        background:
                          hoverItem === "profil"
                            ? "#277421"
                            : "#eff7eb",
                        color:
                          hoverItem === "profil"
                            ? "#ffffff"
                            : "#3f8736",
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
                        fontWeight:
                          hoverItem === "profil"
                            ? 700
                            : 400,
                      }}
                    >
                      Profil Sekolah
                    </span>

                    <ChevronRight size={15} />
                  </Link>

                  <Link
                    to="/profil/visi-misi"
                    onMouseEnter={() =>
                      setHoverItem("visi")
                    }
                    onMouseLeave={() => setHoverItem("")}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "9px",
                      borderRadius: "7px",
                      background:
                        hoverItem === "visi"
                          ? "#eaf4e6"
                          : "transparent",
                      color:
                        hoverItem === "visi"
                          ? "#1f641b"
                          : "#1e293b",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        background:
                          hoverItem === "visi"
                            ? "#277421"
                            : "#eff7eb",
                        color:
                          hoverItem === "visi"
                            ? "#ffffff"
                            : "#3f8736",
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
                        fontWeight:
                          hoverItem === "visi"
                            ? 700
                            : 400,
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
                    onMouseEnter={() =>
                      setHoverItem("guru")
                    }
                    onMouseLeave={() => setHoverItem("")}
                    style={{
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "9px",
                      borderRadius: "7px",
                      background:
                        hoverItem === "guru"
                          ? "#eaf4e6"
                          : "transparent",
                      color:
                        hoverItem === "guru"
                          ? "#1f641b"
                          : "#1e293b",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "6px",
                        background:
                          hoverItem === "guru"
                            ? "#277421"
                            : "#eff7eb",
                        color:
                          hoverItem === "guru"
                            ? "#ffffff"
                            : "#3f8736",
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
                        fontWeight:
                          hoverItem === "guru"
                            ? 700
                            : 400,
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
            </div>

            {/* BERITA */}
            <Link
              to="/berita"
              style={navLinkStyle(
                location.pathname === "/berita"
              )}
            >
              Berita
            </Link>

            {/* AGENDA */}
            <Link
              to="/agenda"
              style={navLinkStyle(
                location.pathname === "/agenda"
              )}
            >
              Agenda
            </Link>

            {/* GALERI */}
            <Link
              to="/galeri"
              style={navLinkStyle(
                location.pathname === "/galeri"
              )}
            >
              Galeri
            </Link>

            {/* KONTAK */}
            <Link
              to="/kontak"
              style={navLinkStyle(
                location.pathname === "/kontak"
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
            {/* SEARCH */}
            <div
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
              <Search
                size={15}
                color="#8492a3"
              />

              <input
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
            </div>

            {/* DOKUMEN */}
            <Link
              to="/dokumen"
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
              }}
            >
              Dokumen
            </Link>

            {/* DAFTAR PPDB */}
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
          </div>
        </div>
      </div>
    </header>
  );
}