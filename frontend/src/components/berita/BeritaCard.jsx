import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  ArrowRight,
} from "lucide-react";

const FONT_HALAMAN = "'Plus Jakarta Sans', Arial, sans-serif";

function BeritaCard({ berita }) {
  const navigate = useNavigate();

  const normalisasiKategori = (kategori = "") =>
    kategori.trim().toLowerCase().replace(/\s+/g, " ");

  const kategoriBerita = {
    adiwiyata: "Adiwiyata & Lingkungan",
    "adiwiyata & lingkungan": "Adiwiyata & Lingkungan",
    "kegiatan akademik": "Akademik",
    akademik: "Akademik",
    "prestasi siswa": "Prestasi Siswa",
    sains: "Sains & Riset",
    "sains & riset": "Sains & Riset",
    "kegiatan sekolah": "Kegiatan Sekolah",
    sosial: "Sosial & Kemanusiaan",
    "sosial & kemanusiaan": "Sosial & Kemanusiaan",
  };

  const kategoriAsli = normalisasiKategori(berita.kategori);

  const namaKategori =
    kategoriBerita[kategoriAsli] ||
    (berita.kategori || "Berita").trim();

  const warnaKategori = {
    "Adiwiyata & Lingkungan": "#708238",
    Akademik: "#043927",
    "Prestasi Siswa": "#4B5320",
    "Sains & Riset": "#708238",
    "Kegiatan Sekolah": "#444C38",
    "Sosial & Kemanusiaan": "#D0F0C0",
  };

  const warnaLabel = warnaKategori[namaKategori] || "#043927";

  const warnaTeksLabel =
    namaKategori === "Sosial & Kemanusiaan"
      ? "#043927"
      : "#FFFFFF";

  return (
    <article
      className="berita-card"
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-4px)";
        event.currentTarget.style.boxShadow =
          "0 12px 26px rgba(15, 23, 42, 0.10)";
        event.currentTarget.style.borderColor = "#2f6b19";
        event.currentTarget.style.zIndex = "2";

        const image = event.currentTarget.querySelector(
          ".berita-card-image"
        );

        if (image) image.style.transform = "scale(1.045)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
        event.currentTarget.style.boxShadow = "none";
        event.currentTarget.style.borderColor = "#e2e8f0";
        event.currentTarget.style.zIndex = "auto";

        const image = event.currentTarget.querySelector(
          ".berita-card-image"
        );

        if (image) image.style.transform = "scale(1)";
      }}
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        position: "relative",
        transition:
          "transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease",
        fontFamily: FONT_HALAMAN,
        fontWeight: 400,
      }}
    >
      <div
        className="berita-card-image-wrap"
        style={{
          height: "136px",
          position: "relative",
          overflow: "hidden",
          background: "#f0f3ff",
          flexShrink: 0,
        }}
      >
        <img
          className="berita-card-image"
          src={berita.gambar}
          alt={berita.judul || "Gambar berita"}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.35s ease",
          }}
        />

        <span
          style={{
            position: "absolute",
            top: "9px",
            left: "9px",
            padding: "4px 8px",
            borderRadius: "12px",
            backgroundColor: warnaLabel,
            color: warnaTeksLabel,
            fontSize: "9px",
            fontWeight: 600,
            lineHeight: 1.4,
            maxWidth: "calc(100% - 20px)",
            overflowWrap: "break-word",
            boxSizing: "border-box",
            fontFamily: FONT_HALAMAN,
          }}
        >
          {namaKategori}
        </span>
      </div>

      <div
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxSizing: "border-box",
          fontFamily: FONT_HALAMAN,
          fontWeight: 400,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#7c8980",
            fontSize: "9px",
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          <CalendarDays size={12} aria-hidden="true" />
          <span>{berita.tanggal}</span>
        </div>

        <h3
          style={{
            margin: "8px 0",
            color: "#111c2d",
            fontFamily: FONT_HALAMAN,
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: 1.4,
            minHeight: "50px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {berita.judul}
        </h3>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "10px",
            lineHeight: 1.6,
            minHeight: "64px",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          {berita.deskripsi}
        </p>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "10px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              color: "#7c8980",
              fontSize: "9px",
              whiteSpace: "nowrap",
              fontFamily: FONT_HALAMAN,
              fontWeight: 400,
            }}
          >
            <Clock3 size={11} aria-hidden="true" />
            {berita.baca}
          </span>

          <button
            type="button"
            onClick={() => navigate(`/berita/${berita.id}`)}
            onMouseEnter={(event) => {
              event.currentTarget.style.color = "#14532d";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.color = "#287344";
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              border: "none",
              background: "transparent",
              color: "#2f6b19",
              cursor: "pointer",
              fontFamily: FONT_HALAMAN,
              fontSize: "9px",
              fontWeight: 600,
              padding: 0,
              transition: "color 0.2s ease",
            }}
          >
            Baca Selengkapnya
            <ArrowRight size={12} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default BeritaCard;