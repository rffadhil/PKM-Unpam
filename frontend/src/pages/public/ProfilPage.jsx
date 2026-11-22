/** @format */

import { useEffect, useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import { Award, BookOpen, Users } from "lucide-react";

const fontFamily = '"Times New Roman", Times, serif';

const greenLabelStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  color: "#327329",
  fontFamily,
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.4px",
};

// Efek hover kartu.
function Lift({ children, style = {} }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 14px 28px rgba(2, 35, 0, 0.12), 0 5px 10px rgba(2, 35, 0, 0.06)"
          : style.boxShadow,
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {children}
    </div>
  );
}

// Kartu ekstrakurikuler dengan bingkai yang lebih rapi dan seimbang.
function ExtracurricularCard({ item }) {
  return (
    <Lift
      style={{
        overflow: "hidden",
        border: "1px solid rgba(47, 107, 25, 0.2)",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(2, 35, 0, 0.04)",
      }}
    >
      {/* FOTO */}
      <div
        style={{
          width: "100%",
          height: "210px",
          overflow: "hidden",
          background: "#f1f5f2",
        }}
      >
        {item.foto ? (
          <img
            src={item.foto}
            alt={item.alt || item.nama}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#71809a",
              fontFamily,
              fontSize: "14px",
            }}
          >
            Foto belum tersedia
          </div>
        )}
      </div>

      {/* NAMA DAN PEMBINA */}
      <div
        style={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#022300",
            fontFamily,
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {item.nama}
        </h3>

        <p
          style={{
            margin: "8px 0 0",
            color: "#667894",
            fontFamily,
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          Pembina: {item.pembina || "-"}
        </p>
      </div>
    </Lift>
  );
}

export default function ProfilPage() {
  const { portal, bukaModalPpdb } = useOutletContext() || {};

  const isPpdbAktif =
    portal?.ppdb !== false &&
    portal?.ppdb_online_aktif !== false &&
    portal?.ppdb !== "false" &&
    portal?.ppdb_online_aktif !== "false";

  // Scroll otomatis menuju bagian berdasarkan hash URL.
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const el = document.querySelector(hash);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [hash]);

  // Judul hero.
  const judulHero =
    portal?.profilJudulHero ||
    portal?.profil_judul_hero ||
    "Membangun Insan Cendekia Berwawasan Global dan Berakar Budaya Luhur";

  // Deskripsi hero.
  const deskripsiHero =
    portal?.profilDeskripsiHero ||
    portal?.profil_deskripsi_hero ||
    "Profil Lengkap, Visi Misi, Fasilitas Unggulan, serta Direktori Pendidik & Tenaga Kependidikan SMA Harapan Jaya. Mendedikasikan keunggulan literasi sains, integritas karakter bangsa, dan pelestarian ekosistem alam bumi nusantara.";

  // Judul sejarah.
  const judulSejarah =
    portal?.profilJudulSejarah ||
    portal?.profil_judul_sejarah ||
    "Dari Fondasi Nilai Luhur Menuju Sekolah Berwawasan Masa Depan";

  const sejarahParagraf1 =
    portal?.profilSejarahP1 ||
    portal?.profil_sejarah_p1 ||
    "SMA Harapan Jaya didirikan pada tanggal 17 Juli 1988 dengan tekad luhur menghadirkan akses pendidikan bermutu bagi masyarakat. Bermula dari tiga ruang kelas, sekolah ini berkembang menjadi lembaga pendidikan yang memadukan prestasi akademik, pembentukan karakter, dan kepedulian terhadap lingkungan.";

  const sejarahParagraf2 =
    portal?.profilSejarahP2 ||
    portal?.profil_sejarah_p2 ||
    "Dalam kurun waktu lebih dari 35 tahun, SMA Harapan Jaya telah melahirkan lebih dari 12.000 alumni yang kini berkiprah di berbagai perguruan tinggi ternama dunia, lembaga pemerintahan, sains global, dan industri kreatif.";

  const sejarahParagraf3 =
    portal?.profilSejarahP3 ||
    portal?.profil_sejarah_p3 ||
    "Komitmen nyata terhadap pelestarian bumi tercermin dari predikat Sekolah Adiwiyata Mandiri sejak 2018. Kami percaya bahwa kecerdasan kognitif hanya akan membawa kemaslahatan jika dibarengi kesadaran ekologis yang matang.";

  const gambarHero = portal?.profil_gambar_hero || "";
  const teksGambarHero =
    portal?.profil_teks_gambar_hero || "KAMPUS HIJAU BERKELANJUTAN";
  const gambarSejarah = portal?.profil_gambar_sejarah || "";
  const labelKartuSejarah =
    portal?.profil_label_kartu_sejarah || "PERJALANAN BERSEJARAH";
  const judulKartuSejarah =
    portal?.profil_judul_kartu_sejarah ||
    "Dedikasi Tiga Dekade Mencerdaskan Kehidupan Bangsa";
  const deskripsiKartuSejarah =
    portal?.profil_deskripsi_kartu_sejarah ||
    "Berawal dari 3 ruang kelas perintis hingga menjadi barometer rujukan pendidikan menengah nasional berbudaya lingkungan.";

  // Data ekstrakurikuler halaman Profil diambil dari database melalui API.
  const [daftarEkskul, setDaftarEkskul] = useState([]);
  const [memuatEkskul, setMemuatEkskul] = useState(true);
  const [errorEkskul, setErrorEkskul] = useState("");

  useEffect(() => {
    const ambilEkstrakurikuler = async () => {
      try {
        setMemuatEkskul(true);
        setErrorEkskul("");

        const apiBaseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

        const response = await fetch(`${apiBaseUrl}/api/ekstrakurikuler`);

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
          throw new Error(
            result.message || "Gagal mengambil data ekstrakurikuler.",
          );
        }

        const data = Array.isArray(result.data) ? result.data : [];

        setDaftarEkskul(
          data
            .filter(
              (item) =>
                String(item.status || "tayang").toLowerCase() === "tayang",
            )
            .map((item) => ({
              ...item,
              foto: item.foto_url || item.foto || item.image_url || "",
            })),
        );
      } catch (error) {
        console.error("Gagal memuat ekstrakurikuler:", error);
        setErrorEkskul(error.message || "Gagal memuat data ekstrakurikuler.");
      } finally {
        setMemuatEkskul(false);
      }
    };

    ambilEkstrakurikuler();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        color: "#1d2b21",
        fontFamily,
        margin: 0,
        padding: 0,
      }}
    >
      {/* ================= HERO (Latar Putih Bersih) ================= */}
      <section
        style={{
          background: "#f8fafc",
          borderBottom: "1px solid rgba(47, 107, 25, 0.15)",
          padding: "50px 3% 45px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: gambarHero
              ? "minmax(0, 1.6fr) minmax(320px, 0.8fr)"
              : "minmax(0, 1fr)",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  background: "#022300",
                  color: "#ffffff",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontFamily,
                  fontSize: "11px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 6px rgba(2, 35, 0, 0.15)",
                }}
              >
                <Award size={13} strokeWidth={2.5} className="text-[#E1E100]" />
                AKREDITASI{" "}
                {String(portal?.akreditasi || "A (UNGGUL)").toUpperCase()}
              </span>
            </div>

            <h1
              style={{
                margin: 0,
                color: "#022300",
                fontFamily,
                fontSize: "clamp(36px, 4vw, 52px)",
                lineHeight: 1.1,
                letterSpacing: "-1px",
                fontWeight: 700,
              }}
            >
              {judulHero}
            </h1>

            <p
              style={{
                maxWidth: "750px",
                margin: "24px 0 0",
                color: "#667894",
                fontFamily,
                fontSize: "16px",
                lineHeight: 1.75,
                fontWeight: 400,
              }}
            >
              {deskripsiHero}
            </p>
          </div>

          {gambarHero && (
            <Lift
              style={{
                height: "300px",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(47, 107, 25, 0.25)",
                boxShadow: "0 8px 20px rgba(2, 35, 0, 0.1)",
                position: "relative",
                background: "#f1f5f2",
              }}
            >
              <img
                src={gambarHero}
                alt="Kampus SMA Harapan Jaya"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "34px 18px 14px",
                  background:
                    "linear-gradient(transparent, rgba(2, 35, 0, 0.88))",
                  color: "#E1E100",
                  fontFamily,
                  fontSize: "11px",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                }}
              >
                {teksGambarHero}
              </div>
            </Lift>
          )}
        </div>
      </section>

      {/* ================= SEJARAH (Blok section memanjang penuh latar hijau tua) ================= */}
      <section
        style={{
          background: "#063b00",
          color: "#ffffff",
          padding: "70px 3%",
          borderBottom: "4px solid #E1E100",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(300px, 0.9fr) minmax(0, 1.4fr)",
            gap: "50px",
            alignItems: "center",
          }}
        >
          <div>
            <Lift
              style={{
                border: "1px solid rgba(225, 225, 0, 0.25)",
                borderRadius: "16px",
                overflow: "hidden",
                background: "#022300",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
              }}
            >
              {gambarSejarah && (
                <div
                  style={{
                    height: "280px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={gambarSejarah}
                    alt="Sejarah SMA Harapan Jaya"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              )}

              <div style={{ padding: "24px 20px" }}>
                <div
                  style={{
                    color: "#E1E100",
                    fontFamily,
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    marginBottom: "8px",
                  }}
                >
                  {labelKartuSejarah}
                </div>

                <h3
                  style={{
                    margin: 0,
                    color: "#ffffff",
                    fontFamily,
                    fontSize: "18px",
                    lineHeight: 1.35,
                    fontWeight: 700,
                  }}
                >
                  {judulKartuSejarah}
                </h3>

                <p
                  style={{
                    margin: "10px 0 0",
                    color: "rgba(255, 255, 255, 0.75)",
                    fontFamily,
                    fontSize: "13px",
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  {deskripsiKartuSejarah}
                </p>
              </div>
            </Lift>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#E1E100",
                fontFamily,
                fontSize: "13px",
                fontWeight: 800,
                marginBottom: "16px",
              }}
            >
              <BookOpen size={17} />
              KILAS SEJARAH &amp; TRANSFORMASI
            </div>

            <h2
              style={{
                margin: 0,
                color: "#ffffff",
                fontFamily,
                fontSize: "32px",
                lineHeight: 1.25,
                fontWeight: 700,
              }}
            >
              {judulSejarah}
            </h2>

            <div className="mt-3 flex items-center gap-1.5 mb-6">
              <span className="h-1 w-14 rounded-full bg-[#E1E100]" />
              <span className="h-1 w-4 rounded-full bg-[#2f6b19]" />
            </div>

            <p
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontFamily,
                fontSize: "15px",
                lineHeight: 1.8,
                marginTop: "16px",
                fontWeight: 400,
              }}
            >
              {sejarahParagraf1}
            </p>

            <p
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontFamily,
                fontSize: "15px",
                lineHeight: 1.8,
                marginTop: "16px",
                fontWeight: 400,
              }}
            >
              {sejarahParagraf2}
            </p>

            <p
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontFamily,
                fontSize: "15px",
                lineHeight: 1.8,
                marginTop: "16px",
                fontWeight: 400,
              }}
            >
              {sejarahParagraf3}
            </p>
          </div>
        </div>
      </section>

      {/* ================= EKSTRAKURIKULER ================= */}
      <section
        id="ekskul"
        style={{
          padding: "60px 3% 75px",
          background: "#ffffff",
          scrollMarginTop: "90px",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="pb-6 mb-8 border-b-2 border-secondary/20 text-center">
            <div style={greenLabelStyle} className="justify-center">
              <Award size={16} />
              BAKAT, MINAT &amp; KARAKTER
            </div>

            <h2
              style={{
                margin: 0,
                color: "#022300",
                fontFamily,
                fontSize: "32px",
                lineHeight: 1.25,
                fontWeight: 700,
                marginTop: "10px",
              }}
            >
              Portofolio Ekstrakurikuler Unggulan
            </h2>

            <div className="mt-3 flex items-center justify-center gap-1.5">
              <span className="h-1 w-14 rounded-full bg-[#2f6b19]" />
              <span className="h-1 w-4 rounded-full bg-[#E1E100]" />
            </div>
          </div>

          {/* DAFTAR EKSTRAKURIKULER */}
          {memuatEkskul ? (
            <p
              style={{
                padding: "45px 15px",
                textAlign: "center",
                color: "#667894",
                fontFamily,
                fontSize: "14px",
              }}
            >
              Memuat data ekstrakurikuler...
            </p>
          ) : errorEkskul ? (
            <p
              style={{
                padding: "45px 15px",
                textAlign: "center",
                color: "#dc2626",
                fontFamily,
                fontSize: "14px",
              }}
            >
              {errorEkskul}
            </p>
          ) : daftarEkskul.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
                gap: "24px",
                alignItems: "stretch",
              }}
            >
              {daftarEkskul.map((item, index) => (
                <ExtracurricularCard key={item.id || index} item={item} />
              ))}
            </div>
          ) : (
            <p
              style={{
                padding: "45px 15px",
                textAlign: "center",
                color: "#667894",
                fontFamily,
                fontSize: "14px",
              }}
            >
              Belum ada data ekstrakurikuler yang tersedia.
            </p>
          )}
        </div>
      </section>

      {/* ================= PPDB ================= */}
      <section
        style={{
          background: "#ffffff",
          padding: "48px 3% 60px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            background: "#063b00",
            borderBottom: "4px solid #e2eb24",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "32px",
            borderRadius: "18px",
            padding: "40px 44px",
            boxShadow: "0 14px 28px rgba(2, 35, 0, 0.14)",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "700px" }}>
            <span
              style={{
                display: "inline-block",
                background: "#e2eb24",
                color: "#022300",
                padding: "6px 12px",
                borderRadius: "6px",
                fontFamily,
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.4px",
                textTransform: "uppercase",
              }}
            >
              PENERIMAAN PESERTA DIDIK BARU (PPDB)
            </span>

            <h2
              style={{
                margin: "14px 0 10px",
                color: "#ffffff",
                fontFamily,
                fontSize: "32px",
                lineHeight: 1.2,
                fontWeight: 700,
              }}
            >
              Bergabunglah Bersama Keluarga Besar SMA Harapan Jaya
            </h2>

            <p
              style={{
                margin: 0,
                maxWidth: "720px",
                color: "rgba(255, 255, 255, 0.88)",
                fontFamily,
                fontSize: "14px",
                lineHeight: 1.65,
              }}
            >
              Temukan kesempatan untuk belajar, berkembang, dan meraih prestasi
              bersama SMA Harapan Jaya. Jadilah bagian dari lingkungan
              pendidikan yang mendukung potensi, kreativitas, dan pembentukan
              karakter siswa untuk masa depan yang lebih baik.
            </p>
          </div>

          {isPpdbAktif ? (
            <Link
              to="/ppdb"
              style={{
                flexShrink: 0,
                background: "#e2eb24",
                color: "#022300",
                textDecoration: "none",
                padding: "13px 24px",
                borderRadius: "8px",
                fontFamily,
                fontSize: "13px",
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
              }}
            >
              <Users size={17} />
              Daftar PPDB Sekarang
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (bukaModalPpdb) {
                  bukaModalPpdb();
                } else {
                  window.dispatchEvent(new CustomEvent("buka_modal_ppdb"));
                }
              }}
              style={{
                flexShrink: 0,
                background: "#e2eb24",
                color: "#022300",
                padding: "13px 24px",
                borderRadius: "8px",
                fontFamily,
                fontSize: "13px",
                fontWeight: 800,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
              }}
            >
              <Users size={17} />
              Daftar PPDB Sekarang
            </button>
          )}
        </div>
      </section>
    </div>
  );
}