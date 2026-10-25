import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  ArrowRight,
} from "lucide-react";

function BeritaCard({ berita }) {
  const navigate = useNavigate();

  // Normalisasi nama kategori agar tidak terpengaruh spasi
  // tambahan atau perbedaan huruf besar dan kecil.
  const normalisasiKategori = (kategori = "") =>
    kategori.trim().toLowerCase().replace(/\s+/g, " ");

  const kategoriBerita = {
    "adiwiyata": "Adiwiyata & Lingkungan",
    "adiwiyata & lingkungan": "Adiwiyata & Lingkungan",
    "kegiatan akademik": "Akademik",
    "akademik": "Akademik",
    "prestasi siswa": "Prestasi Siswa",
    "sains": "Sains & Riset",
    "sains & riset": "Sains & Riset",
    "kegiatan sekolah": "Kegiatan Sekolah",
    "sosial": "Sosial & Kemanusiaan",
    "sosial & kemanusiaan": "Sosial & Kemanusiaan",
  };

  const kategoriAsli = normalisasiKategori(berita.kategori);
  const namaKategori =
    kategoriBerita[kategoriAsli] ||
    (berita.kategori || "Berita").trim();

  const warnaKategori = {
    "Adiwiyata & Lingkungan": "#708238",
    "Akademik": "#043927",
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
      onMouseEnter={(event) => {
        event.currentTarget.style.transform =
          "translateY(-5px) scale(1.02)";
        event.currentTarget.style.boxShadow =
          "0 12px 26px rgba(28, 67, 39, 0.13)";
        event.currentTarget.style.borderColor = "#c8d9ca";
        event.currentTarget.style.zIndex = "2";

        const image = event.currentTarget.querySelector(
          ".berita-card-image"
        );

        if (image) image.style.transform = "scale(1.045)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0) scale(1)";
        event.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
        event.currentTarget.style.borderColor = "#e1e8e2";
        event.currentTarget.style.zIndex = "auto";

        const image = event.currentTarget.querySelector(
          ".berita-card-image"
        );

        if (image) image.style.transform = "scale(1)";
      }}
      style={{
        background: "#ffffff",
        border: "1px solid #e1e8e2",
        borderRadius: "7px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        position: "relative",
        transition:
          "transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease",
        willChange: "transform",
      }}
    >
      {/* GAMBAR DAN LABEL KATEGORI */}
      <div
        style={{
          height: "145px",
          position: "relative",
          overflow: "hidden",
          background: "#edf2ed",
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
            willChange: "transform",
          }}
        />

        <span
          style={{
            position: "absolute",
            top: "9px",
            left: "9px",
            padding: "5px 9px",
            borderRadius: "12px",
            backgroundColor: warnaLabel,
            color: warnaTeksLabel,
            fontSize: "8px",
            fontWeight: 600,
            lineHeight: 1.4,
            maxWidth: "calc(100% - 36px)",
            overflowWrap: "break-word",
            boxSizing: "border-box",
          }}
        >
          {namaKategori}
        </span>
      </div>

      {/* ISI BERITA */}
      <div
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxSizing: "border-box",
        }}
      >
        {/* TANGGAL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            color: "#7c8980",
            fontSize: "9px",
          }}
        >
          <CalendarDays
            size={11}
            strokeWidth={1.7}
            aria-hidden="true"
          />
          <span>{berita.tanggal}</span>
        </div>

        {/* JUDUL */}
        <h3
          style={{
            margin: "8px 0",
            color: "#304037",
            fontFamily: "Georgia, serif",
            fontSize: "13px",
            fontWeight: 500,
            lineHeight: 1.45,
          }}
        >
          {berita.judul}
        </h3>

        {/* DESKRIPSI */}
        <p
          style={{
            margin: 0,
            color: "#7e8981",
            fontSize: "9px",
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {berita.deskripsi}
        </p>

        {/* WAKTU BACA DAN TOMBOL */}
        <div
          style={{
            marginTop: "12px",
            paddingTop: "9px",
            borderTop: "1px solid #edf1ed",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              color: "#7c8980",
              fontSize: "8px",
              whiteSpace: "nowrap",
            }}
          >
            <Clock3
              size={10}
              strokeWidth={1.7}
              aria-hidden="true"
            />
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
              color: "#287344",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "9px",
              fontWeight: 600,
              padding: 0,
              transition: "color 0.2s ease",
            }}
          >
            Baca Selengkapnya
            <ArrowRight
              size={12}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

export default BeritaCard;