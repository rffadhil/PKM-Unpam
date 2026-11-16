/** @format */

import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import {
  Award,
  BookOpen,
  Users,
} from "lucide-react";

const fontFamily = '"Times New Roman", Times, serif';

const sectionTitleStyle = {
  margin: 0,
  color: "#0b3712",
  fontFamily,
  fontSize: "32px",
  lineHeight: 1.25,
  fontWeight: 700,
};

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
        transform: hovered ? "translateY(-7px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 14px 28px rgba(20, 55, 25, 0.15), 0 5px 10px rgba(20, 55, 25, 0.08)"
          : style.boxShadow,
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {children}
    </div>
  );
}

// Kartu ekstrakurikuler.
function ExtracurricularCard({ item }) {
  return (
    <Lift
      style={{
        overflow: "hidden",
        border: "1px solid #dce4eb",
        borderRadius: "15px",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      {/* FOTO */}
      <div
        style={{
          width: "100%",
          height: "230px",
          overflow: "hidden",
          background: "#edf2ed",
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
            color: "#123b16",
            fontFamily,
            fontSize: "19px",
            fontWeight: 700,
            lineHeight: 1.4,
          }}
        >
          {item.nama}
        </h3>

        <p
          style={{
            margin: "8px 0 0",
            color: "#71809a",
            fontFamily,
            fontSize: "14px",
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

        const apiBaseUrl = (
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        ).replace(/\/$/, "");

        const response = await fetch(
          `${apiBaseUrl}/api/ekstrakurikuler`
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok || result.success === false) {
          throw new Error(
            result.message || "Gagal mengambil data ekstrakurikuler."
          );
        }

        const data = Array.isArray(result.data) ? result.data : [];

        setDaftarEkskul(
          data
            .filter(
              (item) =>
                String(item.status || "tayang").toLowerCase() === "tayang"
            )
            .map((item) => ({
              ...item,
              foto: item.foto_url || item.foto || item.image_url || "",
            }))
        );
      } catch (error) {
        console.error("Gagal memuat ekstrakurikuler:", error);
        setErrorEkskul(
          error.message || "Gagal memuat data ekstrakurikuler."
        );
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
      {/* ================= HERO ================= */}

      <section
        style={{
          background: "#f7f9fc",
          borderBottom: "1px solid #e7ebef",
          padding: "46px 3% 40px",
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
                marginBottom: "27px",
              }}
            >
              <span
                style={{
                  background: "#07520b",
                  color: "#ffffff",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontFamily,
                  fontSize: "11px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <Award size={13} strokeWidth={2.5} />
                AKREDITASI{" "}
                {String(portal?.akreditasi || "A (UNGGUL)").toUpperCase()}
              </span>

            </div>

            <h1
              style={{
                margin: 0,
                color: "#07380e",
                fontFamily,
                fontSize: "clamp(39px, 4.3vw, 57px)",
                lineHeight: 1.04,
                letterSpacing: "-1.8px",
                fontWeight: 700,
              }}
            >
              {judulHero}
            </h1>

            <p
              style={{
                maxWidth: "750px",
                margin: "27px 0 0",
                color: "#667894",
                fontFamily,
                fontSize: "17px",
                lineHeight: 1.7,
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
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid #cddbd2",
                boxShadow: "0 5px 16px rgba(0,0,0,0.08)",
                position: "relative",
                background: "#dbe8dc",
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
                  padding: "34px 18px 12px",
                  background:
                    "linear-gradient(transparent, rgba(0,55,10,0.85))",
                  color: "#e2eb24",
                  fontFamily,
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                {teksGambarHero}
              </div>
            </Lift>
          )}
        </div>
      </section>

      {/* ================= SEJARAH ================= */}

      <section
        style={{
          padding: "58px 3% 65px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns:
              "minmax(320px, 0.95fr) minmax(0, 1.45fr)",
            gap: "48px",
            alignItems: "start",
          }}
        >
          <div>
            <Lift
              style={{
                border: "1px solid #dce4e9",
                borderRadius: "14px",
                overflow: "hidden",
                background: "#ffffff",
                boxShadow: "0 3px 8px rgba(0,0,0,0.07)",
              }}
            >
              {gambarSejarah && (
                <div
                  style={{
                    height: "300px",
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
                      filter: "saturate(0.7)",
                    }}
                  />
                </div>
              )}

              <div style={{ padding: "25px 20px 22px" }}>
                <div
                  style={{
                    color: "#398032",
                    fontFamily,
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    marginBottom: "10px",
                  }}
                >
                  {labelKartuSejarah}
                </div>

                <h3
                  style={{
                    margin: 0,
                    color: "#0b3211",
                    fontFamily,
                    fontSize: "18px",
                    lineHeight: 1.3,
                    fontWeight: 700,
                  }}
                >
                  {judulKartuSejarah}
                </h3>

                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#71809a",
                    fontFamily,
                    fontSize: "13px",
                    lineHeight: 1.55,
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
                color: "#34752b",
                fontFamily,
                fontSize: "13px",
                fontWeight: 800,
                marginBottom: "25px",
              }}
            >
              <BookOpen size={17} />
              KILAS SEJARAH & TRANSFORMASI
            </div>

            <h2
              style={{
                ...sectionTitleStyle,
                fontWeight: 700,
              }}
            >
              {judulSejarah}
            </h2>

            <p
              style={{
                color: "#596159",
                fontFamily,
                fontSize: "14px",
                lineHeight: 1.75,
                marginTop: "23px",
                fontWeight: 400,
              }}
            >
              {sejarahParagraf1}
            </p>

            <p
              style={{
                color: "#596159",
                fontFamily,
                fontSize: "14px",
                lineHeight: 1.75,
                marginTop: "17px",
                fontWeight: 400,
              }}
            >
              {sejarahParagraf2}
            </p>

            <p
              style={{
                color: "#596159",
                fontFamily,
                fontSize: "14px",
                lineHeight: 1.75,
                marginTop: "17px",
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
            padding: "45px 3% 70px",
            background: "#ffffff",
            scrollMarginTop: "90px",
          }}
        >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* JUDUL */}
          <div style={{ textAlign: "center", marginBottom: "42px" }}>
            <div style={greenLabelStyle}>
              <Award size={16} />
              BAKAT, MINAT & KARAKTER
            </div>

            <h2
              style={{
                ...sectionTitleStyle,
                marginTop: "20px",
              }}
            >
              Portofolio Ekstrakurikuler Unggulan
            </h2>
          </div>

          {/* DAFTAR EKSTRAKURIKULER */}
          {memuatEkskul ? (
            <p
              style={{
                padding: "35px 15px",
                textAlign: "center",
                color: "#71809a",
                fontFamily,
                fontSize: "14px",
              }}
            >
              Memuat data ekstrakurikuler...
            </p>
          ) : errorEkskul ? (
            <p
              style={{
                padding: "35px 15px",
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
                  "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
                gap: "24px",
                alignItems: "stretch",
              }}
            >
              {daftarEkskul.map((item, index) => (
                <ExtracurricularCard
                  key={item.id || index}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <p
              style={{
                padding: "35px 15px",
                textAlign: "center",
                color: "#71809a",
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
          background: "#064b08",
          color: "#ffffff",
          padding: "45px 3%",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "30px",
            borderRadius: "14px",
            padding: "10px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <span
              style={{
                display: "inline-block",
                background: "#687d09",
                color: "#e2eb24",
                padding: "6px 11px",
                borderRadius: "4px",
                fontFamily,
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.5px",
              }}
            >
              PENERIMAAN PESERTA DIDIK BARU (PPDB) 2026/2027
            </span>

            <h2
              style={{
                margin: "13px 0 8px",
                color: "#ffffff",
                fontFamily,
                fontSize: "32px",
                lineHeight: 1.15,
                maxWidth: "700px",
                fontWeight: 700,
              }}
            >
              Bergabunglah Bersama Keluarga Besar SMA Harapan Jaya
            </h2>

            <p
              style={{
                margin: 0,
                maxWidth: "720px",
                color: "#c7d8c4",
                fontFamily,
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Pendaftaran jalur Prestasi Akademik/Non-Akademik dan Zonasi
              Reguler telah dibuka secara daring. Konsultasikan masa depan
              pendidikan putra-putri Anda.
            </p>
          </div>

          {isPpdbAktif ? (
            <Link
              to="/ppdb"
              style={{
                flexShrink: 0,
                background: "#e2eb24",
                color: "#183c12",
                textDecoration: "none",
                padding: "13px 24px",
                borderRadius: "24px",
                fontFamily,
                fontSize: "13px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "8px",
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
                  window.dispatchEvent(
                    new CustomEvent("buka_modal_ppdb")
                  );
                }
              }}
              style={{
                flexShrink: 0,
                background: "#e2eb24",
                color: "#183c12",
                padding: "13px 24px",
                borderRadius: "24px",
                fontFamily,
                fontSize: "13px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                cursor: "pointer",
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