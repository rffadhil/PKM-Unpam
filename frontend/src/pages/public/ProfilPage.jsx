import { useState } from "react";
import {
  Award,
  BookOpen,
  Brain,
  Check,
  Flag,
  FlaskConical,
  Globe2,
  Palette,
  Recycle,
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

const checkItemStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  marginBottom: "11px",
  color: "#263126",
  fontFamily,
  fontSize: "13px",
  lineHeight: 1.5,
  fontWeight: 700,
};

const checkIconStyle = {
  color: "#3b8734",
  flexShrink: 0,
  marginTop: "2px",
};

function Lift({ children, style = {} }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...style,
        transform: hovered
          ? "translateY(-7px)"
          : "translateY(0)",
        boxShadow: hovered
          ? "0 14px 28px rgba(20, 55, 25, 0.15), 0 5px 10px rgba(20, 55, 25, 0.08)"
          : style.boxShadow,
        transition:
          "transform 0.25s ease, box-shadow 0.25s ease",
        willChange: "transform, box-shadow",
      }}
    >
      {children}
    </div>
  );
}

export default function ProfilPage() {
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
            gridTemplateColumns:
              "minmax(0, 1.6fr) minmax(320px, 0.8fr)",
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
                AKREDITASI A (98/100) BAN-S/M
              </span>

              <span
                style={{
                  background: "#34752b",
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
                <Recycle size={13} strokeWidth={2.5} />
                SEKOLAH ADIWIYATA MANDIRI NASIONAL
              </span>

              <span
                style={{
                  background: "#e8eefb",
                  color: "#536176",
                  padding: "6px 13px",
                  borderRadius: "20px",
                  fontFamily,
                  fontSize: "11px",
                  fontWeight: 700,
                }}
              >
                Kurikulum Merdeka Mandiri Berbagi
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
              Membangun Insan Cendekia
              <br />
              Berwawasan Global dan Berakar
              <br />
              Budaya Luhur
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
              Profil Lengkap, Visi Misi, Fasilitas Unggulan,
              serta Direktori Pendidik & Tenaga Kependidikan
              SMA Harapan Jaya. Mendedikasikan keunggulan
              literasi sains, integritas karakter bangsa,
              dan pelestarian ekosistem alam bumi nusantara.
            </p>
          </div>

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
              src="/src/assets/hero.png"
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
              KAMPUS HIJAU BERKELANJUTAN
            </div>
          </Lift>
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
              <div
                style={{
                  height: "300px",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/src/assets/hero.png"
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
                  PERJALANAN BERSEJARAH
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
                  Dedikasi Tiga Dekade Mencerdaskan
                  Kehidupan Bangsa
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
                  Berawal dari 3 ruang kelas perintis
                  hingga menjadi barometer rujukan
                  pendidikan menengah nasional
                  berbudaya lingkungan.
                </p>
              </div>
            </Lift>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "15px",
              }}
            >
              <Lift
                style={{
                  border: "1px solid #dce5eb",
                  borderRadius: "11px",
                  padding: "18px",
                  background: "#f8fafc",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    color: "#1e6720",
                    fontFamily,
                    fontSize: "23px",
                    fontWeight: 700,
                  }}
                >
                  1988
                </strong>

                <span
                  style={{
                    color: "#78879e",
                    fontFamily,
                    fontSize: "12px",
                    lineHeight: 1.4,
                    fontWeight: 400,
                  }}
                >
                  Resmi didirikan oleh Yayasan
                  Bhakti Cendekia
                </span>
              </Lift>

              <Lift
                style={{
                  border: "1px solid #dce5eb",
                  borderRadius: "11px",
                  padding: "18px",
                  background: "#f8fafc",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    color: "#1e6720",
                    fontFamily,
                    fontSize: "23px",
                    fontWeight: 700,
                  }}
                >
                  2018
                </strong>

                <span
                  style={{
                    color: "#78879e",
                    fontFamily,
                    fontSize: "12px",
                    lineHeight: 1.4,
                    fontWeight: 400,
                  }}
                >
                  Penghargaan Adiwiyata
                  Mandiri Presiden RI
                </span>
              </Lift>
            </div>
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
              Dari Fondasi Nilai Luhur Menuju Sekolah
              Berwawasan Masa Depan
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
              SMA Harapan Jaya didirikan pada tanggal
              17 Juli 1988 dengan tekad luhur menghadirkan
              akses pendidikan bermutu bagi masyarakat.
              Bermula dari tiga ruang kelas, sekolah ini
              berkembang menjadi lembaga pendidikan yang
              memadukan prestasi akademik, pembentukan
              karakter, dan kepedulian terhadap lingkungan.
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
              Dalam kurun waktu lebih dari 35 tahun,
              SMA Harapan Jaya telah melahirkan lebih dari
              12.000 alumni yang kini berkiprah di berbagai
              perguruan tinggi ternama dunia, lembaga
              pemerintahan, sains global, dan industri kreatif.
              Transformasi berkelanjutan terus dilakukan melalui
              pembelajaran berbasis proyek dan integrasi
              digitalisasi sekolah pintar.
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
              Komitmen nyata terhadap pelestarian bumi
              tercermin dari predikat Sekolah Adiwiyata
              Mandiri sejak 2018. Kami percaya bahwa
              kecerdasan kognitif hanya akan membawa
              kemaslahatan jika dibarengi kesadaran ekologis
              yang matang dan rasa tanggung jawab sosial
              yang tinggi.
            </p>

            <div style={{ marginTop: "25px" }}>
              <Lift
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "15px",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    width: "39px",
                    height: "39px",
                    borderRadius: "50%",
                    background: "#dcf7ce",
                    color: "#39812e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <BookOpen size={20} />
                </span>

                <div>
                  <strong
                    style={{
                      display: "block",
                      color: "#173c19",
                      fontFamily,
                      fontSize: "15px",
                      fontWeight: 700,
                    }}
                  >
                    Kurikulum Merdeka Mandiri
                  </strong>

                  <span
                    style={{
                      color: "#7a879b",
                      fontFamily,
                      fontSize: "12px",
                      fontWeight: 400,
                    }}
                  >
                    Diferensiasi minat bakat siswa secara optimal
                  </span>
                </div>
              </Lift>

              <Lift
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px",
                  borderRadius: "10px",
                }}
              >
                <span
                  style={{
                    width: "39px",
                    height: "39px",
                    borderRadius: "50%",
                    background: "#dcf7ce",
                    color: "#39812e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Brain size={20} />
                </span>

                <div>
                  <strong
                    style={{
                      display: "block",
                      color: "#173c19",
                      fontFamily,
                      fontSize: "15px",
                      fontWeight: 700,
                    }}
                  >
                    Riset Ilmiah Siswa Unggul
                  </strong>

                  <span
                    style={{
                      color: "#7a879b",
                      fontFamily,
                      fontSize: "12px",
                      fontWeight: 400,
                    }}
                  >
                    Pendampingan publikasi ilmiah & inovasi teknologi
                  </span>
                </div>
              </Lift>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EKSTRAKURIKULER ================= */}

      <section
        style={{
          padding: "30px 3% 70px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={greenLabelStyle}>
              <Award size={16} />
              BAKAT, MINAT & KARAKTER
            </div>

            <h2
              style={{
                ...sectionTitleStyle,
                marginTop: "20px",
                fontWeight: 700,
              }}
            >
              Portofolio Ekstrakurikuler Unggulan
            </h2>

            <p
              style={{
                maxWidth: "750px",
                margin: "12px auto 46px",
                color: "#71809a",
                fontFamily,
                fontSize: "14px",
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Wadah aktualisasi diri murid melalui 24 cabang
              kegiatan kesiswaan yang terstruktur dan dibina
              oleh pelatih profesional bersertifikat.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, minmax(0, 1fr))",
              gap: "23px",
              alignItems: "stretch",
            }}
          >
            <ExtracurricularCard
              icon={<FlaskConical size={22} />}
              category="KLUSTER KEILMUAN"
              title="Sains & Riset Teknologi"
              description="Mengasah kemampuan penalaran kritis, metodologi penelitian empiris, pemrograman, dan rekayasa instrumen teknologi modern."
              items={[
                "KIR (Karya Ilmiah Remaja)",
                "Klub Robotika & IoT",
                "Olimpiade Sains Club (OSC)",
                "Coding & Artificial Intelligence",
              ]}
              achievement="Emas KSN 2025 & Medali Perak WICE"
            />

            <ExtracurricularCard
              icon={<Palette size={22} />}
              category="KLUSTER ESTETIKA"
              title="Seni & Budaya Luhur"
              description="Melestarikan khazanah warisan tari dan musik nusantara sekaligus mengekspresikan seni panggung kontemporer yang berkarakter."
              items={[
                "Tari Tradisional & Saman",
                "Teater Topeng & Sastra",
                "Paduan Suara Gita Cendekia",
                "Band Akustik & Karawitan",
              ]}
              achievement="Juara 1 FLS2N Tingkat Provinsi"
            />

            <ExtracurricularCard
              icon={<Globe2 size={22} />}
              category="KLUSTER KINESTETIK"
              title="Olahraga & Bela Diri"
              description="Menempa ketangguhan fisik, sportivitas tim, konsistensi latihan, dan ketangkasan bela diri asli kebanggaan Indonesia."
              items={[
                "Bola Basket Putra & Putri",
                "Futsal & Sepak Bola",
                "Pencak Silat Merpati Putih",
                "Bulutangkis & Tenis Meja",
              ]}
              achievement="Juara DBL Regional & O2SN Silat"
            />

            <ExtracurricularCard
              icon={<Flag size={22} />}
              category="KLUSTER KEPEMIMPINAN"
              title="Kepemimpinan & Sosial"
              description="Melatih kecakapan manajerial organisasi, mitigasi kebencanaan, pertolongan pertama, dan jiwa korsa kesetiakawanan sosial."
              items={[
                "OSIS & MPK Parlemen Siswa",
                "Pramuka Gugus Depan Garuda",
                "PMR Wira (Palang Merah Remaja)",
                "Paskibra Satya Bhakti",
              ]}
              achievement="Duta Pelajar Teladan Nasional 2025"
            />
          </div>
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
              Bergabunglah Bersama Keluarga Besar SMA
              Harapan Jaya
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
              Pendaftaran jalur Prestasi Akademik/Non-Akademik
              dan Zonasi Reguler telah dibuka secara daring.
              Konsultasikan masa depan pendidikan putra-putri Anda.
            </p>
          </div>

          <a
            href="#ppdb"
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
          </a>
        </div>
      </section>
    </div>
  );
}

function ExtracurricularCard({
  icon,
  category,
  title,
  description,
  items,
  achievement,
}) {
  return (
    <Lift
      style={{
        border: "1px solid #dce4eb",
        borderRadius: "12px",
        padding: "25px 23px 20px",
        background: "#ffffff",
        height: "430px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* IKON */}

      <div
        style={{
          width: "48px",
          height: "48px",
          minHeight: "48px",
          borderRadius: "12px",
          background: "#07500b",
          color: "#e2eb24",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* KATEGORI */}

      <div
        style={{
          color: "#36772f",
          fontFamily,
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: "0.5px",
          height: "16px",
          marginBottom: "9px",
          flexShrink: 0,
        }}
      >
        {category}
      </div>

      {/* JUDUL */}

      <h3
        style={{
          margin: 0,
          color: "#123b16",
          fontFamily,
          fontSize: "17px",
          lineHeight: 1.3,
          fontWeight: 700,
          height: "44px",
          display: "flex",
          alignItems: "flex-start",
          flexShrink: 0,
        }}
      >
        {title}
      </h3>

      {/* DESKRIPSI */}

      <p
        style={{
          color: "#74819a",
          fontFamily,
          fontSize: "13px",
          lineHeight: 1.55,
          margin: "8px 0 15px",
          fontWeight: 400,
          height: "80px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {description}
      </p>

      {/* DAFTAR KEGIATAN */}

      <div
        style={{
          flex: 1,
          minHeight: 0,
        }}
      >
        {items.map((item) => (
          <div
            key={item}
            style={checkItemStyle}
          >
            <Check
              size={14}
              style={checkIconStyle}
            />

            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* PRESTASI */}

      <div
        style={{
          paddingTop: "15px",
          borderTop: "1px solid #e1e7ec",
          color: "#397932",
          fontFamily,
          fontSize: "11px",
          lineHeight: 1.5,
          fontWeight: 700,
          minHeight: "33px",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        Prestasi: {achievement}
      </div>
    </Lift>
  );
}