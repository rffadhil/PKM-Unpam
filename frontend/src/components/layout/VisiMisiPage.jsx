/** @format */

import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import {
  CheckCircle2,
  Heart,
  FlaskConical,
  Trees,
  Users,
  Handshake,
  GraduationCap,
} from "lucide-react";

const fontFamily = '"Times New Roman", Times, serif';

function Lift({ children, style = {} }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 14px 28px rgba(20,55,25,0.14), 0 5px 10px rgba(20,55,25,0.08)"
          : style.boxShadow,
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        willChange: "transform, box-shadow",
      }}
    >
      {children}
    </div>
  );
}

const defaultMissionData = [
  {
    nomor: "01",
    ikon: <Heart size={22} strokeWidth={2.2} />,
    judul: "Penanaman Akhlak & Nilai Religius",
    deskripsi:
      "Menumbuhkembangkan penghayatan spiritual serta pengamalan ajaran agama untuk membentuk karakter pribadi yang jujur, santun, toleran, dan berintegritas.",
    indikator: "Profil Pelajar Pancasila",
  },
  {
    nomor: "02",
    ikon: <FlaskConical size={22} strokeWidth={2.2} />,
    judul: "Keunggulan Literasi Sains & Teknologi",
    deskripsi:
      "Menyelenggarakan proses pembelajaran saintifik interaktif berbasis digital dan riset terapan guna melahirkan talenta unggul di kancah olimpiade dan inovasi internasional.",
    indikator: "Publikasi Riset & Prestasi OSN",
  },
  {
    nomor: "03",
    ikon: <Trees size={22} strokeWidth={2.2} />,
    judul: "Budaya Lingkungan & Konservasi Alam",
    deskripsi:
      "Mengintegrasikan pendidikan lingkungan hidup (Adiwiyata) secara komprehensif dalam kurikulum dan aksi nyata pelestarian hayati serta pengurangan jejak karbon.",
    indikator: "Kampus Zero Plastic & Bank Sampah",
  },
  {
    nomor: "04",
    ikon: <Users size={22} strokeWidth={2.2} />,
    judul: "Pengembangan Potensi Multitalenta Siswa",
    deskripsi:
      "Memfasilitasi wadah eksplorasi minat, bakat, kepemimpinan organisasi, seni budaya tradisional nusantara, dan kebugaran jasmani secara inklusif.",
    indikator: "24 Cabang Ekstrakurikuler Aktif",
  },
  {
    nomor: "05",
    ikon: <Handshake size={22} strokeWidth={2.2} />,
    judul: "Kemitraan Global & Sinergi Masyarakat",
    deskripsi:
      "Membangun jejaring kolaborasi strategis bersama perguruan tinggi bereputasi, dunia usaha dan dunia industri (DUDI), alumni, serta institusi luar negeri guna menyiapkan peserta didik menembus kancah universitas top dunia.",
    indikator: "Sister School Program & Beasiswa Kuliah Luar Negeri",
  },
];

export default function VisiMisiPage() {
  const { portal } = useOutletContext();
  const ppdbAktif = portal?.ppdb !== false;

  const visi =
    portal?.visiSekolah || portal?.visi_sekolah ||
    "Terwujudnya lulusan yang beriman, berakhlak mulia, unggul dalam sains dan teknologi, serta berbudaya lingkungan hidup yang asri dan lestari.";

  const komitmenBudaya =
    portal?.komitmenBudaya || portal?.komitmen_budaya ||
    "Memandu langkah seluruh civitas akademika menuju pencapaian standar mutu pendidikan global yang berakar pada nilai-nilai kebangsaan Indonesia dan budaya lingkungan Adiwiyata.";

  let misiData = defaultMissionData;
  const jsonMisi = portal?.misiSekolahJson || portal?.misi_sekolah_json;

  if (jsonMisi) {
    try {
      const parsed = JSON.parse(jsonMisi);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Cocokkan ikon dengan urutan
        misiData = parsed.map((m, i) => ({
          ...m,
          ikon: defaultMissionData[i % 5].ikon,
        }));
      }
    } catch {
      // Abaikan dan gunakan default
    }
  }

  return (
    <div
      style={{
        width: "100%",
        background: "#f7f9fc",
        minHeight: "500px",
        fontFamily,
        color: "#173c19",
        margin: 0,
        padding: 0,
      }}
    >
      {/* ================= BAGIAN JUDUL ================= */}

      <section
        style={{
          padding: "62px 3% 47px",
          background: "#f7f9fc",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#34752b",
              fontFamily,
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            <CheckCircle2 size={18} strokeWidth={2.2} />
            ARAH STRATEGIS & LANDASAN NILAI
          </div>

          <h1
            style={{
              margin: 0,
              color: "#07380e",
              fontFamily,
              fontSize: "38px",
              lineHeight: 1.2,
              fontWeight: 700,
            }}
          >
            Visi, Misi & Komitmen Karakter Institusi
          </h1>

          <p
            style={{
              maxWidth: "760px",
              margin: "13px auto 0",
              color: "#71809a",
              fontFamily,
              fontSize: "16px",
              lineHeight: 1.55,
              fontWeight: 400,
            }}
          >
            {komitmenBudaya}
          </p>
        </div>
      </section>

      {/* ================= BAGIAN VISI ================= */}

      <section
        style={{
          padding: "0 3% 48px",
          background: "#f7f9fc",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Lift
            style={{
              width: "100%",
              minHeight: "230px",
              background: "#ffffff",
              border: "2px solid #c8dec2",
              borderRadius: "15px",
              padding: "48px 40px",
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 3px 8px rgba(20,55,25,0.07)",
            }}
          >
            <div
              style={{
                position: "relative",
                zIndex: 2,
                maxWidth: "900px",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "#b8f39d",
                  color: "#173c19",
                  padding: "5px 11px",
                  borderRadius: "4px",
                  fontFamily,
                  fontSize: "11px",
                  fontWeight: 700,
                  marginBottom: "18px",
                }}
              >
                VISI UTAMA SEKOLAH
              </div>

              <div
                style={{
                  color: "#0a3510",
                  fontFamily,
                  fontSize: "24px",
                  lineHeight: 1.4,
                  fontWeight: 700,
                  fontStyle: "italic",
                  marginBottom: "16px",
                }}
              >
                “{visi}”
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#71809a",
                  fontFamily,
                  fontSize: "13px",
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                Ditetapkan berdasarkan Musyawarah Dewan Guru, Komite Sekolah,
                dan Pengawas Pembina Dinas Pendidikan Provinsi.
              </p>
            </div>

            <GraduationCap
              size={155}
              strokeWidth={1.1}
              color="#eef1ef"
              style={{
                position: "absolute",
                right: "-5px",
                bottom: "-38px",
              }}
            />
          </Lift>
        </div>
      </section>

      {/* ================= BAGIAN MISI ================= */}

      <section
        style={{
          padding: "0 3% 60px",
          background: "#f7f9fc",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#0a3510",
              fontFamily,
              fontSize: "21px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            <CheckCircle2 size={22} color="#39812e" strokeWidth={2.2} />
            {misiData.length} Misi Strategis Penyelenggaraan Pendidikan
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
              alignItems: "stretch",
            }}
          >
            {misiData.map((mission, index) => (
              <MissionCard key={index} mission={mission} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= BAGIAN BAWAH ================= */}
      {ppdbAktif && (
        <section
          style={{
            background: "#064b08",
            color: "#ffffff",
            padding: "45px 3%",
            boxSizing: "border-box",
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
              padding: "10px",
              boxSizing: "border-box",
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
                  fontWeight: 700,
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
                  fontWeight: 400,
                }}
              >
                Pendaftaran jalur Prestasi Akademik/Non-Akademik dan Zonasi
                Reguler telah dibuka secara daring. Konsultasikan masa depan
                pendidikan putra-putri Anda.
              </p>
            </div>

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
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Users size={17} />
              Daftar PPDB Sekarang
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function MissionCard({ mission }) {
  return (
    <Lift
      style={{
        width: "100%",
        minHeight: "272px",
        background: "#ffffff",
        border: "1px solid #dce4eb",
        borderRadius: "12px",
        padding: "24px 24px 20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 5px rgba(20,55,25,0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          height: "50px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: "#aec8a7",
            fontFamily,
            fontSize: "34px",
            lineHeight: 1,
            fontWeight: 700,
          }}
        >
          {mission.nomor || mission.number}
        </div>

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: "#f7faf7",
            color: "#0b3511",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {mission.ikon || mission.icon}
        </div>
      </div>

      <h3
        style={{
          margin: "13px 0 0",
          color: "#0c3512",
          fontFamily,
          fontSize: "17px",
          lineHeight: 1.25,
          fontWeight: 700,
          minHeight: "43px",
        }}
      >
        {mission.judul || mission.title}
      </h3>

      <p
        style={{
          margin: "7px 0 0",
          color: "#71809a",
          fontFamily,
          fontSize: "13px",
          lineHeight: 1.55,
          fontWeight: 400,
          flex: 1,
        }}
      >
        {mission.deskripsi || mission.description}
      </p>

      <div
        style={{
          marginTop: "16px",
          paddingTop: "13px",
          borderTop: "1px solid #edf0f2",
          color: "#34752b",
          fontFamily,
          fontSize: "12px",
          lineHeight: 1.4,
          fontWeight: 700,
          boxSizing: "border-box",
        }}
      >
        Indikator: {mission.indikator || mission.indicator}
      </div>
    </Lift>
  );
}
