import { useState } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  BriefcaseBusiness,
  GraduationCap,
  FlaskConical,
  Calculator,
  Languages,
  Landmark,
  Palette,
  HeartHandshake,
  Dumbbell,
  Mail,
  ChevronDown,
} from "lucide-react";

const wakasekData = [
  {
    label: "Kurikulum",
    name: "Dra. Hj. Siti Nurjanah, M.Si.",
    position: "Wakasek Bidang Akademik & Kurikulum",
    description:
      "Pakar Pengembangan Kurikulum Merdeka & Evaluasi Pembelajaran Digital.",
    nip: "197408121999032002",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=80",
  },
  {
    label: "Kesiswaan",
    name: "Ahmad Fauzi, S.Pd., M.Ed.",
    position: "Wakasek Bidang Kesiswaan & Karakter",
    description:
      "Pembina Kedisiplinan Siswa, Ekstrakurikuler, dan OSIS & MPK.",
    nip: "198205192006041007",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80",
  },
  {
    label: "Sarana Prasarana",
    name: "Ir. Budi Santoso, S.T., M.T.",
    position: "Wakasek Bidang Sarpras & Lingkungan",
    description:
      "Koordinator Utama Fasilitas Adiwiyata, Laboratorium, dan Green Campus.",
    nip: "197801202005011003",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80",
  },
  {
    label: "Humas & Kemitraan",
    name: "Ratna Dewi, S.Sos., M.I.Kom.",
    position: "Wakasek Bidang Humas & Kerjasama",
    description:
      "Pengelola Hubungan Alumni, Kemitraan Universitas, dan Dunia Industri.",
    nip: "198509142009022006",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80",
  },
];

const guruData = [
  {
    category: "MIPA - Biologi",
    name: "Endah Puspitasari, S.Si., M.Pd.",
    education: "S2 Pendidikan Biologi - UNJ",
    activity: "Koordinator Green House & Riset",
    masa: "11 Thn",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=300&q=80",
    icon: FlaskConical,
  },
  {
    category: "MIPA - Fisika",
    name: "Hendro Wicaksono, M.Sc.",
    education: "S2 Applied Physics - ITB",
    activity: "Pembina Robotika & Sains Club",
    masa: "8 Thn",
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?auto=format&fit=crop&w=300&q=80",
    icon: FlaskConical,
  },
  {
    category: "MIPA - Matematika",
    name: "Tri Gunawan, S.Pd., Gr.",
    education: "S1 Pendidikan Matematika - UPI",
    activity: "Pelatih Tim Olimpiade Matematika",
    masa: "6 Thn",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    icon: Calculator,
  },
  {
    category: "Bahasa & Sastra",
    name: "Dewi Lestari, S.S., M.Hum.",
    education: "S2 Ilmu Susastra - UI",
    activity: "Pembina Teater & Jurnalistik",
    masa: "15 Thn",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    icon: Languages,
  },
  {
    category: "IPS - Sejarah",
    name: "Bagus Prasetyo, S.Pd.",
    education: "S1 Pendidikan Sejarah - UNNES",
    activity: "Koordinator Pojok Kebudayaan",
    masa: "7 Thn",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    icon: Landmark,
  },
  {
    category: "Seni & Budaya",
    name: "Anindya Kusuma, S.Sn.",
    education: "S1 Seni Tari - ISI Surakarta",
    activity: "Pembina Sanggar Tari Nusantara",
    masa: "5 Thn",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    icon: Palette,
  },
  {
    category: "Bimbingan Konseling",
    name: "Maya Anggraini, S.Psi., M.Psi.",
    education: "S2 Psikologi Pendidikan - UGM",
    activity: "Konselor Karir & Masuk PTN",
    masa: "9 Thn",
    image:
      "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=300&q=80",
    icon: HeartHandshake,
  },
  {
    category: "Penjaskes & Olahraga",
    name: "Rahmat Hidayat, S.Pd.",
    education: "S1 Kepelatihan Olahraga - UNY",
    activity: "Pelatih Kepala Futsal & Atletik",
    masa: "7 Thn",
    image:
      "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=300&q=80",
    icon: Dumbbell,
  },
];

const categories = [
  "Semua Pendidik (78)",
  "MIPA & Sains (24)",
  "IPS & Bahasa (20)",
  "Olahraga & Seni Budaya (14)",
  "Agama & Bimbingan Konseling (12)",
  "Tenaga Kependidikan / Tata Usaha",
];

function LiftCard({ children, style = {} }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...style,
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hover
          ? "0 12px 28px rgba(21, 69, 22, 0.13)"
          : "0 2px 8px rgba(21, 69, 22, 0.04)",
        transition:
          "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {children}
    </div>
  );
}

export default function GuruPage() {
  const [selectedCategory, setSelectedCategory] = useState(
    "Semua Pendidik (78)"
  );

  const [search, setSearch] = useState("");

  const filteredGuru = guruData.filter((guru) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      guru.name.toLowerCase().includes(keyword) ||
      guru.category.toLowerCase().includes(keyword) ||
      guru.education.toLowerCase().includes(keyword) ||
      guru.activity.toLowerCase().includes(keyword);

    if (selectedCategory === "Semua Pendidik (78)") {
      return matchesSearch;
    }

    if (selectedCategory === "MIPA & Sains (24)") {
      return (
        matchesSearch &&
        guru.category.startsWith("MIPA")
      );
    }

    if (selectedCategory === "IPS & Bahasa (20)") {
      return (
        matchesSearch &&
        (guru.category.startsWith("IPS") ||
          guru.category.startsWith("Bahasa"))
      );
    }

    if (selectedCategory === "Olahraga & Seni Budaya (14)") {
      return (
        matchesSearch &&
        (guru.category.includes("Olahraga") ||
          guru.category.includes("Seni"))
      );
    }

    if (
      selectedCategory ===
      "Agama & Bimbingan Konseling (12)"
    ) {
      return (
        matchesSearch &&
        guru.category.includes("Bimbingan")
      );
    }

    return matchesSearch;
  });

  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        fontFamily: '"Times New Roman", serif',
        color: "#123b16",
      }}
    >
      {/* =========================
          STRUKTUR ORGANISASI
      ========================= */}
      <section
        style={{
          padding: "62px 30px 0",
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
              gap: "7px",
              color: "#34752b",
              fontFamily: "Arial, sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            <Users size={16} strokeWidth={2} />
            STRUKTUR ORGANISASI
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              lineHeight: 1.15,
              fontWeight: 700,
              color: "#0b3712",
            }}
          >
            Dewan Pimpinan & Manajemen Eksekutif
          </h1>

          <p
            style={{
              maxWidth: "760px",
              margin: "14px auto 24px",
              fontFamily: "Arial, sans-serif",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#71809a",
            }}
          >
            Tata kelola sekolah dipimpin oleh figur
            berdedikasi tinggi dengan rekam jejak
            kepemimpinan akademik yang teruji dan
            akuntabel.
          </p>
        </div>

        {/* Kepala Sekolah */}
        <LiftCard
          style={{
            maxWidth: "1200px",
            minHeight: "365px",
            margin: "24px auto 0",
            border: "1px solid #dce4eb",
            borderRadius: "15px",
            overflow: "hidden",
            background: "#ffffff",
            display: "grid",
            gridTemplateColumns: "400px 1fr",
          }}
        >
          <div
            style={{
              background: "#004b05",
              padding: "40px 42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "315px",
                height: "315px",
                borderRadius: "12px",
                border: "2px solid #9be76e",
                overflow: "hidden",
                position: "relative",
                background: "#0b3b10",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85"
                alt="Kepala Sekolah"
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
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "38px 12px 13px",
                  background:
                    "linear-gradient(transparent, rgba(0,45,4,0.96))",
                  textAlign: "center",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <div
                  style={{
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: 700,
                  }}
                >
                  Drs. H. Bambang Sudirman, M.Pd.
                </div>

                <div
                  style={{
                    color: "#b8ec8f",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  NIP. 196804151993031004
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "65px 50px 35px",
              boxSizing: "border-box",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "#d9f8c9",
                color: "#184f16",
                borderRadius: "4px",
                padding: "6px 12px",
                fontSize: "10px",
                fontWeight: 700,
              }}
            >
              SAMBUTAN KEPALA SEKOLAH
            </span>

            <h2
              style={{
                margin: "17px 0 14px",
                maxWidth: "720px",
                color: "#0b3712",
                fontFamily: '"Times New Roman", serif',
                fontSize: "24px",
                lineHeight: 1.3,
                fontWeight: 700,
              }}
            >
              “Menyemai Karakter Adiluhung dalam Harmoni
              Alam dan Perkembangan Teknologi Abad 21”
            </h2>

            <p
              style={{
                margin: "0 0 17px",
                color: "#69758a",
                fontSize: "14px",
                fontStyle: "italic",
                lineHeight: 1.75,
              }}
            >
              “Assalamu’alaikum Warahmatullahi Wabarakatuh,
              Salam Sejahtera, Om Swastiastu, Namo Buddhaya.
            </p>

            <p
              style={{
                margin: 0,
                color: "#667188",
                fontSize: "14px",
                fontStyle: "italic",
                lineHeight: 1.8,
              }}
            >
              Selamat datang di portal resmi SMA Harapan
              Jaya. Institusi kami tidak hanya mendidik murid
              untuk mahir menyelesaikan soal-soal ujian,
              namun mendidik manusia seutuhnya: beretika,
              memiliki kepekaan rasa, cinta terhadap lingkungan
              lestari, dan berani berinovasi. Bersama seluruh
              dewan guru dan tenaga kependidikan, kami
              memastikan setiap anak menemukan potensi
              terbaiknya dalam iklim sekolah yang aman,
              suportif, dan membanggakan.”
            </p>

            <div
              style={{
                marginTop: "28px",
                paddingTop: "18px",
                borderTop: "1px solid #e0e6ec",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#123b16",
                  }}
                >
                  Drs. H. Bambang Sudirman, M.Pd.
                </div>

                <div
                  style={{
                    marginTop: "4px",
                    color: "#74829a",
                    fontSize: "12px",
                  }}
                >
                  Kepala SMA Harapan Jaya (Periode 2021 -
                  Sekarang)
                </div>
              </div>

              <div
                style={{
                  border: "1px solid #dce5e8",
                  borderRadius: "8px",
                  padding: "9px 12px",
                  fontSize: "11px",
                  color: "#234f25",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <ShieldCheck size={14} />
                Sertifikasi Kepala Sekolah LPPKS
              </div>
            </div>
          </div>
        </LiftCard>
      </section>

      {/* =========================
          WAKASEK
      ========================= */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "45px auto 0",
          padding: "0 30px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            margin: "0 0 23px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#103b16",
            fontFamily: "Arial, sans-serif",
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          <ShieldCheck
            size={20}
            color="#34752b"
            strokeWidth={2}
          />
          Wakil Kepala Sekolah (Wakasek)
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {wakasekData.map((item) => (
            <LiftCard
              key={item.name}
              style={{
                height: "100%",
                minHeight: "420px",
                border: "1px solid #dce4eb",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: "190px",
                  minHeight: "190px",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                <span
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    background: "#07530a",
                    color: "#ffffff",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </span>
              </div>

              <div
                style={{
                  padding: "22px 20px 18px",
                  fontFamily: "Arial, sans-serif",
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    color: "#123b16",
                    fontSize: "15px",
                    fontWeight: 700,
                    lineHeight: 1.35,
                    minHeight: "40px",
                  }}
                >
                  {item.name}
                </div>

                <div
                  style={{
                    color: "#34752b",
                    fontSize: "12px",
                    marginTop: "4px",
                    lineHeight: 1.4,
                    minHeight: "34px",
                  }}
                >
                  {item.position}
                </div>

                <p
                  style={{
                    margin: "11px 0 15px",
                    color: "#71809a",
                    fontSize: "12px",
                    lineHeight: 1.7,
                    minHeight: "62px",
                  }}
                >
                  {item.description}
                </p>

                <div
                  style={{
                    marginTop: "auto",
                    borderTop: "1px solid #e2e7eb",
                    paddingTop: "13px",
                    color: "#73819a",
                    fontSize: "11px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <BriefcaseBusiness
                    size={13}
                    color="#34752b"
                  />
                  NIP. {item.nip}
                </div>
              </div>
            </LiftCard>
          ))}
        </div>
      </section>

      {/* =========================
          CIVITAS AKADEMIKA
      ========================= */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "105px auto 0",
          padding: "0 30px 70px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "30px",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "#34752b",
                fontFamily: "Arial, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                marginBottom: "14px",
              }}
            >
              <BriefcaseBusiness size={16} />
              CIVITAS AKADEMIKA
            </div>

            <h2
              style={{
                margin: 0,
                color: "#0b3712",
                fontSize: "35px",
                lineHeight: 1.15,
                fontWeight: 700,
              }}
            >
              Direktori Pendidik & Tenaga Kependidikan
            </h2>

            <p
              style={{
                margin: "10px 0 0",
                color: "#74829a",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
              }}
            >
              Pendidik berkualifikasi S1 & S2 lulusan
              universitas unggulan dalam dan luar negeri,
              tersertifikasi pendidik profesional.
            </p>
          </div>

          <div
            style={{
              width: "315px",
              height: "38px",
              border: "1px solid #dce4eb",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              padding: "0 11px",
              boxSizing: "border-box",
              flexShrink: 0,
              fontFamily: "Arial, sans-serif",
            }}
          >
            <Search
              size={15}
              color="#71809a"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama guru / mata pelajaran..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                marginLeft: "8px",
                fontFamily: "Arial, sans-serif",
                fontSize: "11px",
                color: "#455264",
                background: "transparent",
              }}
            />
          </div>
        </div>

        {/* Filter kategori */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginTop: "28px",
            overflowX: "auto",
            paddingBottom: "5px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {categories.map((category) => {
            const active =
              selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setSelectedCategory(category)
                }
                style={{
                  border: active
                    ? "1px solid #07530a"
                    : "1px solid #dce4eb",
                  background: active
                    ? "#07530a"
                    : "#ffffff",
                  color: active
                    ? "#ffffff"
                    : "#283548",
                  borderRadius: "22px",
                  padding: "10px 15px",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Direktori guru */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, minmax(0, 1fr))",
            gap: "30px 23px",
            marginTop: "33px",
            alignItems: "stretch",
          }}
        >
          {filteredGuru.map((guru) => {
            const Icon = guru.icon;

            return (
              <LiftCard
                key={guru.name}
                style={{
                  height: "285px",
                  minHeight: "285px",
                  border: "1px solid #dce4eb",
                  borderRadius: "12px",
                  background: "#ffffff",
                  padding: "20px",
                  boxSizing: "border-box",
                  fontFamily: "Arial, sans-serif",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "50%",
                      border: "2px solid #34752b",
                      padding: "3px",
                      boxSizing: "border-box",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={guru.image}
                      alt={guru.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        background: "#a9ef86",
                        color: "#174316",
                        borderRadius: "4px",
                        padding: "7px 9px",
                        fontSize: "10px",
                        fontWeight: 700,
                        marginBottom: "8px",
                      }}
                    >
                      {guru.category}
                    </span>

                    <div
                      style={{
                        color: "#0b3712",
                        fontFamily:
                          '"Times New Roman", serif',
                        fontSize: "16px",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        minHeight: "42px",
                      }}
                    >
                      {guru.name}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "9px",
                    color: "#74829a",
                    fontSize: "12px",
                    lineHeight: 1.4,
                    minHeight: "52px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <GraduationCap
                      size={15}
                      color="#34752b"
                      flexShrink={0}
                    />
                    <span>{guru.education}</span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Icon
                      size={15}
                      color="#34752b"
                      flexShrink={0}
                    />
                    <span>{guru.activity}</span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: "13px",
                    borderTop: "1px solid #e0e6eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    color: "#4e574f",
                    fontSize: "11px",
                  }}
                >
                  <span>
                    <strong>Masa Bakti:</strong>{" "}
                    {guru.masa}
                  </span>

                  <Mail
                    size={16}
                    color="#34752b"
                  />
                </div>
              </LiftCard>
            );
          })}
        </div>

        {/* Tombol seluruh guru */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "38px",
          }}
        >
          <button
            type="button"
            style={{
              minWidth: "370px",
              height: "42px",
              borderRadius: "22px",
              border: "1px solid #34752b",
              background: "#ffffff",
              color: "#34752b",
              fontFamily: "Arial, sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
            }}
          >
            Lihat Seluruh 78 Guru & Tenaga Kependidikan
            <ChevronDown size={15} />
          </button>
        </div>
      </section>

      {/* =========================
          PPDB
      ========================= */}
      <section
        style={{
          width: "100%",
          background: "#07530a",
          color: "#ffffff",
          padding: "60px 30px",
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
            gap: "35px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              flex: 1,
              fontFamily: '"Times New Roman", serif',
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#a9ef86",
                color: "#174316",
                borderRadius: "4px",
                padding: "7px 12px",
                fontFamily: "Arial, sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                marginBottom: "17px",
              }}
            >
              PENERIMAAN PESERTA DIDIK BARU (PPDB) 2026/2027
            </div>

            <h2
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "32px",
                lineHeight: 1.2,
                fontWeight: 700,
              }}
            >
              Bergabunglah Bersama Keluarga Besar SMA Harapan Jaya
            </h2>

            <p
              style={{
                margin: "12px 0 0",
                maxWidth: "760px",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              Pendaftaran jalur Prestasi Akademik/Non-Akademik dan Zonasi
              Reguler telah dibuka secara daring. Konsultasikan masa depan
              pendidikan putra-putri Anda.
            </p>
          </div>

          <button
            type="button"
            style={{
              minWidth: "218px",
              height: "50px",
              border: "none",
              borderRadius: "28px",
              background: "#e2eb24",
              color: "#153e19",
              fontFamily: '"Times New Roman", serif',
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            <Users size={17} />
            Daftar PPDB Sekarang
          </button>
        </div>
      </section>
    </div>
  );
}