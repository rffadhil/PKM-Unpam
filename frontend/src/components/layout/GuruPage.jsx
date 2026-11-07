/** @format */

import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
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
} from "lucide-react";
import { ambilSemuaStaf } from "@/services/stafService";

const categories = [
  "Semua Pendidik",
  "MIPA & Sains",
  "IPS & Bahasa",
  "Olahraga & Seni Budaya",
  "Agama & Bimbingan Konseling",
  "Tenaga Kependidikan / Tata Usaha",
];

function getCategoryMatch(stafRumpun, categoryFilter) {
  if (!stafRumpun) return false;
  const rumpun = stafRumpun.toLowerCase();
  if (categoryFilter === "Semua Pendidik") return true;
  if (categoryFilter === "MIPA & Sains")
    return rumpun.includes("mipa") || rumpun.includes("sains");
  if (categoryFilter === "IPS & Bahasa")
    return rumpun.includes("ips") || rumpun.includes("bahasa");
  if (categoryFilter === "Olahraga & Seni Budaya")
    return (
      rumpun.includes("olahraga") ||
      rumpun.includes("seni") ||
      rumpun.includes("budaya")
    );
  if (categoryFilter === "Agama & Bimbingan Konseling")
    return (
      rumpun.includes("agama") ||
      rumpun.includes("bimbingan") ||
      rumpun.includes("konseling") ||
      rumpun.includes("bk")
    );
  if (categoryFilter === "Tenaga Kependidikan / Tata Usaha")
    return (
      rumpun.includes("tendik") ||
      rumpun.includes("tata usaha") ||
      rumpun.includes("tu") ||
      rumpun.includes("kependidikan")
    );
  return true;
}

function getDefaultIcon(rumpun) {
  if (!rumpun) return Users;
  const r = rumpun.toLowerCase();
  if (r.includes("mipa") || r.includes("sains")) return FlaskConical;
  if (r.includes("matematika")) return Calculator;
  if (r.includes("bahasa")) return Languages;
  if (r.includes("ips") || r.includes("sejarah")) return Landmark;
  if (r.includes("seni") || r.includes("budaya")) return Palette;
  if (r.includes("bimbingan") || r.includes("konseling") || r.includes("bk"))
    return HeartHandshake;
  if (r.includes("olahraga") || r.includes("penjaskes")) return Dumbbell;
  return Users;
}

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
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {children}
    </div>
  );
}

export default function GuruPage() {
  const { portal } = useOutletContext();
  const ppdbAktif = portal?.ppdb !== false;

  const [stafData, setStafData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua Pendidik");
  const [search, setSearch] = useState("");

  const sambutanText =
    portal?.sambutan_kepsek ||
    "Selamat datang di portal resmi SMA Harapan Jaya. Institusi kami tidak hanya mendidik murid untuk mahir menyelesaikan soal-soal ujian, namun mendidik manusia seutuhnya: beretika, memiliki kepekaan rasa, cinta terhadap lingkungan lestari, dan berani berinovasi. Bersama seluruh dewan guru dan tenaga kependidikan, kami memastikan setiap anak menemukan potensi terbaiknya dalam iklim sekolah yang aman, suportif, dan membanggakan.";
  const sambutanJudul =
    portal?.sambutan_judul ||
    "“Menyemai Karakter Adiluhung dalam Harmoni Alam dan Perkembangan Teknologi Abad 21”";

  useEffect(() => {
    let aktif = true;
    ambilSemuaStaf()
      .then((res) => {
        if (aktif && Array.isArray(res.data)) {
          // Hanya ambil yang di-setting tampil di publik
          const stafTampil = res.data.filter((s) => s.tampil_publik !== false);
          setStafData(stafTampil);
        }
      })
      .catch((err) => console.error("Gagal memuat staf:", err))
      .finally(() => {
        if (aktif) setLoading(false);
      });
    return () => {
      aktif = false;
    };
  }, []);

  const kepsek = stafData.find(
    (s) =>
      s.jabatan?.toLowerCase().includes("kepala sekolah") &&
      !s.jabatan?.toLowerCase().includes("wakil"),
  );
  const wakasek = stafData.filter((s) =>
    s.jabatan?.toLowerCase().includes("wakil kepala"),
  );
  const guruTendik = stafData.filter(
    (s) => !s.jabatan?.toLowerCase().includes("kepala sekolah"),
  );

  const filteredGuru = guruTendik.filter((guru) => {
    const keyword = search.toLowerCase();
    const nama = (guru.nama || "").toLowerCase();
    const mapel = (guru.mata_pelajaran || "").toLowerCase();
    const rumpun = (guru.rumpun || "").toLowerCase();

    const matchesSearch =
      nama.includes(keyword) ||
      mapel.includes(keyword) ||
      rumpun.includes(keyword);

    if (selectedCategory === "Semua Pendidik") {
      return matchesSearch;
    }
    return matchesSearch && getCategoryMatch(guru.rumpun, selectedCategory);
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
            Tata kelola sekolah dipimpin oleh figur berdedikasi tinggi dengan
            rekam jejak kepemimpinan akademik yang teruji dan akuntabel.
          </p>
        </div>

        {/* Kepala Sekolah */}
        {kepsek && (
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
                  src={
                    kepsek.foto_url ||
                    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85"
                  }
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
                    {kepsek.nama}
                  </div>

                  <div
                    style={{
                      color: "#b8ec8f",
                      fontSize: "11px",
                      marginTop: "4px",
                    }}
                  >
                    {kepsek.nip_nuptk
                      ? `NIP/NUPTK. ${kepsek.nip_nuptk}`
                      : "Kepala Sekolah"}
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
                {sambutanJudul}
              </h2>

              <div
                style={{
                  margin: "0 0 17px",
                  color: "#69758a",
                  fontSize: "14px",
                  fontStyle: "italic",
                  lineHeight: 1.75,
                }}
                dangerouslySetInnerHTML={{
                  __html: sambutanText.replace(/\n/g, "<br/>"),
                }}
              />

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
                    {kepsek.nama}
                  </div>

                  <div
                    style={{
                      marginTop: "4px",
                      color: "#74829a",
                      fontSize: "12px",
                    }}
                  >
                    Kepala {portal?.namaInstitusi || "SMA Harapan Jaya"}
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
        )}
      </section>

      {/* =========================
          WAKASEK
      ========================= */}
      {wakasek.length > 0 && (
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
            <ShieldCheck size={20} color="#34752b" strokeWidth={2} />
            Wakil Kepala Sekolah (Wakasek)
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
              alignItems: "stretch",
            }}
          >
            {wakasek.map((item) => (
              <LiftCard
                key={item.id}
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
                    src={
                      item.foto_url ||
                      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                    }
                    alt={item.nama}
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
                    Wakil Kepala Sekolah
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
                    {item.nama}
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
                    {item.jabatan}
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
                    {item.mata_pelajaran}
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
                    <BriefcaseBusiness size={13} color="#34752b" />
                    {item.nip_nuptk
                      ? `NIP/NUPTK. ${item.nip_nuptk}`
                      : item.status_kepegawaian || "Pendidik"}
                  </div>
                </div>
              </LiftCard>
            ))}
          </div>
        </section>
      )}

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
              Pendidik berkualifikasi S1 & S2 lulusan universitas unggulan dalam
              dan luar negeri, tersertifikasi pendidik profesional.
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
            <Search size={15} color="#71809a" />

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
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                style={{
                  border: active ? "1px solid #07530a" : "1px solid #dce4eb",
                  background: active ? "#07530a" : "#ffffff",
                  color: active ? "#ffffff" : "#283548",
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

        {loading ? (
          <p
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#666",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Memuat direktori pendidik...
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "30px 23px",
              marginTop: "33px",
              alignItems: "stretch",
            }}
          >
            {filteredGuru.map((guru) => {
              const IconComp = getDefaultIcon(guru.rumpun);

              return (
                <LiftCard
                  key={guru.id}
                  style={{
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
                        src={
                          guru.foto_url ||
                          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                        }
                        alt={guru.nama}
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
                        {guru.rumpun || "Pendidik"}
                      </span>

                      <div
                        style={{
                          color: "#0b3712",
                          fontFamily: '"Times New Roman", serif',
                          fontSize: "16px",
                          fontWeight: 700,
                          lineHeight: 1.3,
                          minHeight: "42px",
                        }}
                      >
                        {guru.nama}
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
                      <GraduationCap size={15} color="#34752b" flexShrink={0} />
                      <span>{guru.pendidikan_terakhir || "S1 Pendidikan"}</span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <IconComp size={15} color="#34752b" flexShrink={0} />
                      <span>{guru.mata_pelajaran || guru.jabatan || "-"}</span>
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
                      <strong>Status:</strong>{" "}
                      {guru.status_kepegawaian || "GTY/PTY"}
                    </span>

                    <Mail size={16} color="#34752b" />
                  </div>
                </LiftCard>
              );
            })}
          </div>
        )}
      </section>

      {/* =========================
          PPDB
      ========================= */}
      {ppdbAktif && (
        <section
          style={{
            width: "100%",
            background: "#07530a",
            color: "#ffffff",
            padding: "60px 30px",
            boxSizing: "border-box",
            marginTop: "60px",
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

            <Link
              to="/ppdb"
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
                textDecoration: "none",
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
