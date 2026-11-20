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
import { ekstrakNomorPtk, inisialPtk } from "@/utils/ptk";

const categories = [
  "Semua Pendidik",
  "Pimpinan Sekolah",
  "Wakil Kepala Sekolah",
  "MIPA & Sains",
  "IPS & Bahasa",
  "Olahraga & Seni Budaya",
  "Agama & Bimbingan Konseling",
  "Tenaga Kependidikan / Tata Usaha",
];

const latarPutihBertekstur = {
  backgroundColor: "#ffffff",
  backgroundImage:
    "radial-gradient(rgba(47, 107, 25, 0.08) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

// Gaya responsif. Inline style tidak bisa memakai media query,
// jadi bagian yang perlu berubah di layar kecil diberi class "gp-*".
const gayaResponsif = `
  .gp-kepsek-foto {
    max-width: 100%;
  }

  .gp-wrap-teks {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .gp-card-accent {
    position: relative;
    overflow: hidden;
  }

  .gp-card-accent::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2f6b19 0%, #063b00 65%, #E1E100 100%);
    transform: scaleX(0.35);
    transform-origin: left;
    transition: transform 0.28s ease;
    z-index: 2;
  }

  .gp-card-accent:hover::before {
    transform: scaleX(1);
  }

  /* Tablet ke bawah: kartu kepala sekolah menjadi satu kolom */
  @media (max-width: 900px) {
    .gp-kepsek {
      grid-template-columns: 1fr !important;
      min-height: 0 !important;
    }

    .gp-kepsek-left {
      padding: 28px 20px !important;
    }

    .gp-kepsek-foto {
      width: 100% !important;
      max-width: 315px;
      height: auto !important;
      aspect-ratio: 1 / 1;
    }

    .gp-kepsek-right {
      padding: 28px 24px 26px !important;
    }
  }

  /* Mobile */
  @media (max-width: 767px) {
    .gp-hero {
      padding: 40px 16px 0 !important;
    }

    .gp-h1 {
      font-size: 26px !important;
    }

    .gp-sub {
      font-size: 14px !important;
      margin-bottom: 8px !important;
    }

    .gp-sambutan-title {
      font-size: 20px !important;
    }

    .gp-kepsek-right {
      padding: 24px 18px 22px !important;
    }

    .gp-badge-pendidikan {
      white-space: normal !important;
      align-items: flex-start !important;
    }

    .gp-wakasek {
      margin-top: 44px !important;
      padding: 44px 16px !important;
    }

    .gp-civitas {
      margin-top: 48px !important;
      padding: 0 16px 44px !important;
    }

    .gp-civitas-head {
      gap: 18px !important;
    }

    .gp-civitas-h2 {
      font-size: 26px !important;
    }

    .gp-search {
      width: 100% !important;
    }

    .gp-ppdb {
      padding: 0 16px 48px !important;
      margin-top: 36px !important;
    }

    .gp-ppdb-inner {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 22px !important;
      padding: 28px 20px !important;
    }

    .gp-ppdb-h2 {
      font-size: 24px !important;
    }

    .gp-ppdb-btn {
      width: 100% !important;
      min-width: 0 !important;
    }
  }

  @media (max-width: 380px) {
    .gp-h1 {
      font-size: 23px !important;
    }

    .gp-civitas-h2 {
      font-size: 23px !important;
    }
  }
`;

function formatLabelNomorPublik(nipNuptk) {
  const { tipeNomor, nomor } = ekstrakNomorPtk(nipNuptk || "", "NUPTK");
  if (!nomor) return "";
  return `${tipeNomor}: ${nomor}`;
}

function getCategoryMatch(guru, categoryFilter) {
  if (categoryFilter === "Semua Pendidik") return true;
  if (guru.rumpun === categoryFilter) return true;

  const gabung =
    `${guru.rumpun || ""} ${guru.mata_pelajaran || ""} ${guru.jabatan || ""}`.toLowerCase();

  if (categoryFilter === "Pimpinan Sekolah")
    return (
      gabung.includes("kepala sekolah") &&
      !gabung.includes("wakil") &&
      !gabung.includes("wakasek")
    );
  if (categoryFilter === "Wakil Kepala Sekolah")
    return gabung.includes("wakil kepala") || gabung.includes("wakasek");
  if (categoryFilter === "MIPA & Sains")
    return [
      "mipa",
      "sains",
      "matematika",
      "fisika",
      "kimia",
      "biologi",
      "informatika",
    ].some((k) => gabung.includes(k));
  if (categoryFilter === "IPS & Bahasa")
    return [
      "ips",
      "bahasa",
      "ekonomi",
      "sosiologi",
      "geografi",
      "sejarah",
      "sastra",
    ].some((k) => gabung.includes(k));
  if (categoryFilter === "Olahraga & Seni Budaya")
    return [
      "olahraga",
      "penjaskes",
      "pjok",
      "seni",
      "budaya",
      "musik",
      "tari",
    ].some((k) => gabung.includes(k));
  if (categoryFilter === "Agama & Bimbingan Konseling")
    return ["agama", "pai", "bimbingan", "konseling", "bk", "ppkn"].some((k) =>
      gabung.includes(k),
    );
  if (categoryFilter === "Tenaga Kependidikan / Tata Usaha")
    return [
      "tendik",
      "tata usaha",
      "tu",
      "kependidikan",
      "perpustakaan",
      "administrasi",
    ].some((k) => gabung.includes(k));

  return false;
}

function getDefaultIcon(guru) {
  const r =
    `${guru.rumpun || ""} ${guru.mata_pelajaran || ""} ${guru.jabatan || ""}`.toLowerCase();
  if (r.includes("kepala sekolah") || r.includes("pimpinan"))
    return ShieldCheck;
  if (r.includes("matematika")) return Calculator;
  if (
    r.includes("mipa") ||
    r.includes("sains") ||
    r.includes("kimia") ||
    r.includes("fisika") ||
    r.includes("biologi")
  )
    return FlaskConical;
  if (r.includes("bahasa") || r.includes("sastra")) return Languages;
  if (r.includes("ips") || r.includes("sejarah") || r.includes("ekonomi"))
    return Landmark;
  if (r.includes("seni") || r.includes("budaya")) return Palette;
  if (r.includes("bimbingan") || r.includes("konseling") || r.includes("bk"))
    return HeartHandshake;
  if (r.includes("olahraga") || r.includes("penjaskes") || r.includes("pjok"))
    return Dumbbell;
  return BriefcaseBusiness;
}

function LiftCard({ children, style = {}, className = "" }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...style,
        transform: hover ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hover
          ? "0 14px 28px rgba(2, 35, 0, 0.16), 0 5px 10px rgba(2, 35, 0, 0.08)"
          : style.boxShadow || "0 4px 12px rgba(2, 35, 0, 0.06)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {children}
    </div>
  );
}

function GarisAksenTengah() {
  return (
    <div
      style={{
        marginTop: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
      }}
    >
      <span
        style={{
          display: "inline-block",
          height: "4px",
          width: "56px",
          borderRadius: "999px",
          background: "#2f6b19",
        }}
      />
      <span
        style={{
          display: "inline-block",
          height: "4px",
          width: "16px",
          borderRadius: "999px",
          background: "#E1E100",
        }}
      />
    </div>
  );
}

export default function GuruPage() {
  const { portal, bukaModalPpdb } = useOutletContext() || {};
  const isPpdbAktif =
    portal?.ppdb !== false &&
    portal?.ppdb_online_aktif !== false &&
    portal?.ppdb !== "false" &&
    portal?.ppdb_online_aktif !== "false";

  const [stafData, setStafData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua Pendidik");
  const [search, setSearch] = useState("");

  const sambutanText =
    portal?.sambutan_kepsek ||
    portal?.sambutanKepsek ||
    portal?.sambutan_kepala_sekolah ||
    "Selamat datang di gerbang digital SMA Harapan Jaya. Kami berkomitmen menyelenggarakan ekosistem pendidikan berwawasan lingkungan hijau Adiwiyata Mandiri, menumbuhkan integritas moral, serta mengantarkan generasi muda meraih prestasi unggul di kancah nasional maupun global.";

  const sambutanJudul =
    portal?.sambutan_judul ||
    portal?.sambutanJudul ||
    "“Menyemai Karakter Adiluhung dalam Harmoni Alam dan Perkembangan Teknologi Abad 21”";

  useEffect(() => {
    let aktif = true;
    ambilSemuaStaf()
      .then((res) => {
        if (aktif && Array.isArray(res.data)) {
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

  const isKepsek = (s) => {
    const jab = (s.jabatan || "").toLowerCase();
    const rum = (s.rumpun || "").toLowerCase();
    return (
      rum === "pimpinan sekolah" ||
      rum === "manajemen pimpinan" ||
      (jab.includes("kepala sekolah") && !jab.includes("wakil"))
    );
  };

  const isWakasek = (s) => {
    const jab = (s.jabatan || "").toLowerCase();
    const rum = (s.rumpun || "").toLowerCase();
    return (
      !isKepsek(s) &&
      (rum === "wakil kepala sekolah" ||
        jab.includes("wakil kepala") ||
        jab.includes("wakasek"))
    );
  };

  const kepsekDariStaf = stafData.find(isKepsek);
  const kepsek = kepsekDariStaf || {
    nama: portal?.nama_kepala_sekolah || "Junaidi",
    nip_nuptk: "NUPTK: 6642741646200002",
    jabatan: "Kepala Sekolah",
    pendidikan_terakhir: "S2 Manajemen Pendidikan",
    almamater: "",
    foto_url: "",
  };

  const wakasek = stafData.filter(isWakasek);

  // Tampilkan SEMUA data PTK yang aktif publik pada Direktori Pendidik & Tenaga Kependidikan
  // agar jumlah & daftarnya 100% sama dengan tabel di halaman Admin (/admin/profil-staf/guru)
  const filteredGuru = stafData.filter((guru) => {
    const keyword = search.toLowerCase();
    const nama = (guru.nama || "").toLowerCase();
    const mapel = (guru.mata_pelajaran || "").toLowerCase();
    const rumpun = (guru.rumpun || "").toLowerCase();
    const jabatan = (guru.jabatan || "").toLowerCase();
    const kampus = (guru.almamater || "").toLowerCase();
    const nip = (guru.nip_nuptk || "").toLowerCase();

    const matchesSearch =
      nama.includes(keyword) ||
      mapel.includes(keyword) ||
      rumpun.includes(keyword) ||
      jabatan.includes(keyword) ||
      kampus.includes(keyword) ||
      nip.includes(keyword);

    if (selectedCategory === "Semua Pendidik") {
      return matchesSearch;
    }
    return matchesSearch && getCategoryMatch(guru, selectedCategory);
  });

  const pendidikanKepsek = [kepsek.pendidikan_terakhir, kepsek.almamater]
    .filter(Boolean)
    .join(" - ");

  return (
    <div
      style={{
        width: "100%",
        ...latarPutihBertekstur,
        fontFamily: '"Times New Roman", serif',
        color: "#123b16",
      }}
    >
      <style>{gayaResponsif}</style>

      {/* =========================
          STRUKTUR ORGANISASI
      ========================= */}
      <section
        className="gp-hero"
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
          <h1
            className="gp-h1"
            style={{
              margin: 0,
              fontSize: "36px",
              lineHeight: 1.15,
              fontWeight: 700,
              color: "#022300",
            }}
          >
            Dewan Pimpinan &amp; Manajemen Eksekutif
          </h1>

          <p
            className="gp-sub"
            style={{
              maxWidth: "760px",
              margin: "14px auto 0",
              fontFamily: "Arial, sans-serif",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#667894",
            }}
          >
            Tata kelola sekolah dipimpin oleh figur berdedikasi tinggi dengan
            rekam jejak kepemimpinan akademik yang teruji dan akuntabel.
          </p>

          <GarisAksenTengah />
        </div>

        {/* Kepala Sekolah */}
        <LiftCard
          className="gp-kepsek"
          style={{
            maxWidth: "1200px",
            minHeight: "365px",
            margin: "28px auto 0",
            border: "1px solid rgba(47, 107, 25, 0.25)",
            borderLeft: "5px solid #2f6b19",
            borderRadius: "16px",
            overflow: "hidden",
            background: "#ffffff",
            display: "grid",
            gridTemplateColumns: "400px 1fr",
          }}
        >
          <div
            className="gp-kepsek-left"
            style={{
              background: "linear-gradient(155deg, #022300 0%, #063b00 100%)",
              padding: "40px 42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="gp-kepsek-foto"
              style={{
                width: "315px",
                height: "315px",
                borderRadius: "14px",
                border: "2px solid rgba(225, 225, 0, 0.55)",
                overflow: "hidden",
                position: "relative",
                background: "#022300",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.28)",
              }}
            >
              {kepsek.foto_url ? (
                <img
                  src={kepsek.foto_url}
                  alt={kepsek.nama}
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
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    border: "2px solid rgba(225, 225, 0, 0.8)",
                    background: "rgba(6, 59, 0, 0.7)",
                    color: "#e2eb24",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "48px",
                    fontWeight: 800,
                    fontFamily: "Arial, sans-serif",
                    marginBottom: "28px",
                  }}
                >
                  {inisialPtk(kepsek.nama)}
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: "38px 12px 13px",
                  background: "linear-gradient(transparent, rgba(2, 35, 0, 0.96))",
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
                    color: "#e2eb24",
                    fontSize: "11px",
                    marginTop: "4px",
                  }}
                >
                  {formatLabelNomorPublik(kepsek.nip_nuptk) || "Kepala Sekolah"}
                </div>
              </div>
            </div>
          </div>

          <div
            className="gp-kepsek-right gp-wrap-teks"
            style={{
              padding: "56px 50px 35px",
              boxSizing: "border-box",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <span
              style={{
                display: "inline-block",
                background: "#b0f591",
                color: "#022300",
                borderRadius: "6px",
                padding: "6px 12px",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.4px",
              }}
            >
              SAMBUTAN KEPALA SEKOLAH
            </span>

            <h2
              className="gp-sambutan-title"
              style={{
                margin: "17px 0 12px",
                maxWidth: "720px",
                color: "#022300",
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
                width: "68px",
                height: "3px",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #2f6b19, #E1E100)",
                marginBottom: "16px",
              }}
            />

            <div
              style={{
                margin: "0 0 17px",
                color: "#667894",
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
                borderTop: "1px dashed rgba(47, 107, 25, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#022300",
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
                  Kepala {portal?.namaInstitusi || "SMAS Harapan Jaya"}
                </div>
              </div>

              <div
                className="gp-badge-pendidikan"
                style={{
                  border: "1px solid rgba(47, 107, 25, 0.25)",
                  background: "rgba(176, 245, 145, 0.16)",
                  borderRadius: "8px",
                  padding: "9px 12px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#063b00",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <ShieldCheck size={14} color="#2f6b19" style={{ flexShrink: 0 }} />
                {pendidikanKepsek || "Sertifikasi Kepala Sekolah LPPKS"}
              </div>
            </div>
          </div>
        </LiftCard>
      </section>

      {/* =========================
          WAKASEK (BLOK HIJAU TUA PEKAT)
      ========================= */}
      {wakasek.length > 0 && (
        <section
          className="gp-wakasek"
          style={{
            width: "100%",
            marginTop: "56px",
            padding: "54px 30px",
            background: "#063b00",
            borderBottom: "4px solid #e2eb24",
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2
              style={{
                margin: "0 0 24px",
                paddingBottom: "14px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#ffffff",
                fontFamily: "Arial, sans-serif",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              <ShieldCheck
                size={20}
                color="#e2eb24"
                strokeWidth={2.2}
                style={{ flexShrink: 0 }}
              />
              Wakil Kepala Sekolah (Wakasek)
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(250px, 100%), 1fr))",
                gap: "24px",
                alignItems: "stretch",
              }}
            >
              {wakasek.map((item) => {
                const pendidikanWakasek = [
                  item.pendidikan_terakhir,
                  item.almamater,
                ]
                  .filter(Boolean)
                  .join(" - ");

                return (
                  <LiftCard
                    key={item.id}
                    className="gp-card-accent"
                    style={{
                      height: "100%",
                      minHeight: "420px",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      borderRadius: "14px",
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
                        background: "#eef6eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.foto_url ? (
                        <img
                          src={item.foto_url}
                          alt={item.nama}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            width: "84px",
                            height: "84px",
                            borderRadius: "50%",
                            background: "#063b00",
                            border: "2px solid #E1E100",
                            color: "#e2eb24",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            fontWeight: 800,
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          {inisialPtk(item.nama)}
                        </span>
                      )}

                      <span
                        style={{
                          position: "absolute",
                          top: "14px",
                          left: "12px",
                          background: "#063b00",
                          color: "#e2eb24",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "10px",
                          fontWeight: 700,
                        }}
                      >
                        Wakil Kepala Sekolah
                      </span>
                    </div>

                    <div
                      className="gp-wrap-teks"
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
                          color: "#022300",
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
                          color: "#2f6b19",
                          fontSize: "12px",
                          fontWeight: 600,
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
                          color: "#667894",
                          fontSize: "12px",
                          lineHeight: 1.7,
                          minHeight: "62px",
                        }}
                      >
                        {[item.mata_pelajaran, pendidikanWakasek]
                          .filter(Boolean)
                          .join(" • ") || "-"}
                      </p>

                      <div
                        style={{
                          marginTop: "auto",
                          borderTop: "1px dashed rgba(47, 107, 25, 0.25)",
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
                          color="#2f6b19"
                          style={{ flexShrink: 0 }}
                        />
                        {formatLabelNomorPublik(item.nip_nuptk) ||
                          item.status_kepegawaian ||
                          "Pendidik"}
                      </div>
                    </div>
                  </LiftCard>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =========================
          CIVITAS AKADEMIKA
      ========================= */}
      <section
        className="gp-civitas"
        style={{
          maxWidth: "1200px",
          margin: "64px auto 0",
          padding: "0 30px 56px",
          boxSizing: "border-box",
        }}
      >
        <div
          className="gp-civitas-head"
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "30px",
            flexWrap: "wrap",
            paddingBottom: "20px",
            borderBottom: "2px solid rgba(47, 107, 25, 0.18)",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                color: "#2f6b19",
                fontFamily: "Arial, sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              <BriefcaseBusiness size={16} />
              CIVITAS AKADEMIKA
            </div>

            <h2
              className="gp-civitas-h2"
              style={{
                margin: 0,
                color: "#022300",
                fontSize: "35px",
                lineHeight: 1.15,
                fontWeight: 700,
              }}
            >
              Direktori Pendidik &amp; Tenaga Kependidikan
            </h2>

            <p
              style={{
                margin: "10px 0 0",
                color: "#667894",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Pendidik berkualifikasi S1 &amp; S2 lulusan universitas unggulan
              dalam dan luar negeri, tersertifikasi pendidik profesional.
            </p>
          </div>

          <div
            className="gp-search"
            style={{
              width: "315px",
              height: "40px",
              border: "1px solid rgba(47, 107, 25, 0.28)",
              background: "#ffffff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              boxSizing: "border-box",
              flexShrink: 0,
              fontFamily: "Arial, sans-serif",
              boxShadow: "0 2px 6px rgba(2, 35, 0, 0.04)",
            }}
          >
            <Search size={15} color="#2f6b19" style={{ flexShrink: 0 }} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama guru / mata pelajaran..."
              aria-label="Cari nama guru atau mata pelajaran"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                marginLeft: "8px",
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                color: "#022300",
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
            marginTop: "24px",
            overflowX: "auto",
            paddingBottom: "6px",
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
                aria-pressed={active}
                style={{
                  border: active
                    ? "1px solid #063b00"
                    : "1px solid rgba(47, 107, 25, 0.22)",
                  background: active ? "#063b00" : "#ffffff",
                  color: active ? "#e2eb24" : "#123b16",
                  fontWeight: active ? 700 : 500,
                  borderRadius: "22px",
                  padding: "9px 15px",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  flexShrink: 0,
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
        ) : filteredGuru.length === 0 ? (
          <div
            style={{
              marginTop: "33px",
              padding: "44px 24px",
              borderRadius: "14px",
              border: "1px dashed rgba(47, 107, 25, 0.35)",
              background: "#ffffff",
              textAlign: "center",
              fontFamily: "Arial, sans-serif",
              color: "#64748b",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 700,
                color: "#022300",
              }}
            >
              Belum ada data pendidik atau tenaga kependidikan pada kategori ini
            </p>
            <p style={{ margin: "6px 0 0", fontSize: "13px" }}>
              Tambahkan pendidik atau staf baru melalui panel CMS Admin pada
              menu Profil &amp; Staf &rarr; Guru &amp; Tendik.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(260px, 100%), 1fr))",
              gap: "26px 22px",
              marginTop: "30px",
              alignItems: "stretch",
            }}
          >
            {filteredGuru.map((guru) => {
              const IconComp = getDefaultIcon(guru);
              const pendidikanLengkap = [
                guru.pendidikan_terakhir,
                guru.almamater,
              ]
                .filter(Boolean)
                .join(" - ");
              const nomorPegawai = formatLabelNomorPublik(guru.nip_nuptk);

              return (
                <LiftCard
                  key={guru.id}
                  className="gp-wrap-teks gp-card-accent"
                  style={{
                    minHeight: "285px",
                    border: "1px solid rgba(47, 107, 25, 0.22)",
                    borderRadius: "15px",
                    background: "#ffffff",
                    padding: "22px 20px 20px",
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
                        border: "2px solid #2f6b19",
                        padding: "3px",
                        boxSizing: "border-box",
                        flexShrink: 0,
                      }}
                    >
                      {guru.foto_url ? (
                        <img
                          src={guru.foto_url}
                          alt={guru.nama}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            background: "rgba(176, 245, 145, 0.3)",
                            color: "#022300",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: 800,
                          }}
                        >
                          {inisialPtk(guru.nama)}
                        </div>
                      )}
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
                          background: "#b0f591",
                          color: "#022300",
                          borderRadius: "6px",
                          padding: "5px 9px",
                          fontSize: "10px",
                          fontWeight: 700,
                          marginBottom: "8px",
                        }}
                      >
                        {guru.rumpun || "Pendidik"}
                      </span>

                      <div
                        style={{
                          color: "#022300",
                          fontFamily: '"Times New Roman", serif',
                          fontSize: "16px",
                          fontWeight: 700,
                          lineHeight: 1.3,
                        }}
                      >
                        {guru.nama}
                      </div>

                      {nomorPegawai && (
                        <div
                          style={{
                            marginTop: "3px",
                            color: "#74829a",
                            fontSize: "11px",
                            fontFamily: "monospace",
                          }}
                        >
                          {nomorPegawai}
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "18px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "9px",
                      color: "#667894",
                      fontSize: "12px",
                      lineHeight: 1.4,
                      minHeight: "52px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <GraduationCap
                        size={15}
                        color="#2f6b19"
                        style={{ flexShrink: 0, marginTop: "1px" }}
                      />
                      <span style={{ minWidth: 0 }}>
                        {pendidikanLengkap || "-"}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                      }}
                    >
                      <IconComp
                        size={15}
                        color="#2f6b19"
                        style={{ flexShrink: 0, marginTop: "1px" }}
                      />
                      <span style={{ minWidth: 0 }}>
                        {[guru.jabatan, guru.mata_pelajaran]
                          .filter(Boolean)
                          .join(" • ") || "-"}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "13px",
                      borderTop: "1px dashed rgba(47, 107, 25, 0.22)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                      color: "#4e574f",
                      fontSize: "11px",
                    }}
                  >
                    <span>
                      <strong>Status:</strong>{" "}
                      {guru.status_kepegawaian || "GTY/PTY"}
                    </span>

                    <Mail size={16} color="#2f6b19" style={{ flexShrink: 0 }} />
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
      <section
        className="gp-ppdb"
        style={{
          width: "100%",
          background: "transparent",
          padding: "0 30px 60px",
          boxSizing: "border-box",
          marginTop: "24px",
        }}
      >
        <div
          className="gp-ppdb-inner"
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
            borderRadius: "16px",
            padding: "36px 40px",
            boxShadow: "0 12px 26px rgba(2, 35, 0, 0.14)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
              fontFamily: '"Times New Roman", serif',
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#a9ef86",
                color: "#022300",
                borderRadius: "6px",
                padding: "7px 12px",
                fontFamily: "Arial, sans-serif",
                fontSize: "10px",
                fontWeight: 700,
                marginBottom: "15px",
              }}
            >
              PENERIMAAN PESERTA DIDIK BARU (PPDB)
            </div>

            <h2
              className="gp-ppdb-h2"
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
                color: "#c7d8c4",
                fontFamily: "Arial, sans-serif",
                fontSize: "13px",
                lineHeight: 1.7,
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
              className="gp-ppdb-btn"
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
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.16)",
              }}
            >
              <Users size={17} />
              Daftar PPDB Sekarang
            </Link>
          ) : (
            <button
              type="button"
              className="gp-ppdb-btn"
              onClick={() => {
                if (bukaModalPpdb) {
                  bukaModalPpdb();
                } else {
                  window.dispatchEvent(new CustomEvent("buka_modal_ppdb"));
                }
              }}
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
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.16)",
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