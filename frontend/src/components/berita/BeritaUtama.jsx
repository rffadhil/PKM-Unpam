import { Link } from "react-router-dom";
import {
  Trophy,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { KATEGORI_PENGUMUMAN } from "@/config/beritaPublik";

const FONT_HALAMAN = "'Plus Jakarta Sans', Arial, sans-serif";

const formatTanggalHeadline = (input) => {
  if (!input) return "";

  const tanggal = new Date(input);
  if (Number.isNaN(tanggal.getTime())) return "";

  return tanggal.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const buatInisial = (nama) => {
  const kata = nama.trim().split(/\s+/).filter(Boolean);
  if (kata.length === 0) return "?";
  return (kata.length === 1 ? kata[0].slice(0, 2) : kata[0][0] + kata[1][0])
    .toUpperCase();
};

function BeritaUtama({ berita }) {
  if (!berita) return null;

  const penulis = berita.penulis || "Redaksi Sekolah";
  const tanggal = formatTanggalHeadline(berita.tanggalSumber);
  const href = `/berita/${berita.slug || berita.id}`;
  const kategoriPrestasi = /prestasi/i.test(berita.kategori || "");

  return (
    <article
      onMouseEnter={(event) => {
        event.currentTarget.style.transform = "translateY(-5px)";
        event.currentTarget.style.boxShadow =
          "0 14px 30px rgba(28, 67, 39, 0.14)";
        event.currentTarget.style.borderColor = "#c8d9ca";

        const image = event.currentTarget.querySelector(
          ".headline-internasional-image"
        );

        if (image) image.style.transform = "scale(1.045)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform = "translateY(0)";
        event.currentTarget.style.boxShadow = "none";
        event.currentTarget.style.borderColor = "#dce5de";

        const image = event.currentTarget.querySelector(
          ".headline-internasional-image"
        );

        if (image) image.style.transform = "scale(1)";
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        overflow: "hidden",
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
        transition:
          "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
        position: "relative",
        fontFamily: FONT_HALAMAN,
        fontWeight: 400,
      }}
    >
      <div
        className="berita-featured-image"
        style={{
          position: "relative",
          aspectRatio: "1.85 / 1",
          overflow: "hidden",
          background: "#e2e8f0",
        }}
      >
        <img
          className="headline-internasional-image"
          src={berita.gambar}
          alt={berita.judul}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.4s ease",
          }}
        />

        <div
          className="berita-featured-footer"
          style={{
            position: "absolute",
            top: "14px",
            left: "14px",
            display: "flex",
            flexWrap: "wrap",
            gap: "7px",
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          {berita.kategori !== KATEGORI_PENGUMUMAN && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "#dce800",
                color: "#234900",
                padding: "6px 9px",
                borderRadius: "14px",
                fontSize: "10px",
                fontWeight: 400,
                fontFamily: FONT_HALAMAN,
              }}
            >
              {kategoriPrestasi && (
                <Trophy size={12} strokeWidth={1.8} aria-hidden="true" />
              )}
              {berita.kategori}
            </span>
          )}

          <span
            style={{
              background: "#075000",
              color: "#ffffff",
              padding: "6px 9px",
              borderRadius: "14px",
              fontSize: "10px",
              fontWeight: 400,
              fontFamily: FONT_HALAMAN,
            }}
          >
            Headline Utama
          </span>
        </div>
      </div>

      <div
        className="berita-featured-content"
        style={{
          padding: "24px 26px",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          boxSizing: "border-box",
          gap: "14px",
          fontFamily: FONT_HALAMAN,
          fontWeight: 400,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "13px",
            color: "#859189",
            fontSize: "10px",
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontFamily: FONT_HALAMAN,
              fontWeight: 400,
            }}
          >
            <CalendarDays size={13} aria-hidden="true" />
            {tanggal}
          </span>

        </div>

        <h2
          style={{
            margin: "12px 0",
            color: "#022300",
            fontFamily: "'Source Serif 4', Georgia, serif",
            fontSize: "20px",
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          {berita.judul}
        </h2>

        <p
          style={{
            margin: 0,
            color: "#64748b",
            fontSize: "11px",
            lineHeight: 1.7,
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          {berita.deskripsi}
        </p>

        <div
          style={{
            marginTop: "auto",
            paddingTop: "16px",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "9px",
              alignItems: "center",
              fontFamily: FONT_HALAMAN,
              fontWeight: 400,
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                flexShrink: 0,
                borderRadius: "50%",
                background: "#f0f3ff",
                color: "#2f6b19",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 400,
                fontFamily: FONT_HALAMAN,
              }}
            >
              {buatInisial(penulis)}
            </div>

            <div>
              <strong
                style={{
                  display: "block",
                  fontSize: "11px",
                  color: "#111c2d",
                  fontWeight: 600,
                  fontFamily: FONT_HALAMAN,
                }}
              >
                {penulis}
              </strong>

              <small
                style={{
                  color: "#64748b",
                  fontSize: "10px",
                  fontWeight: 400,
                  fontFamily: FONT_HALAMAN,
                }}
              >
                Editor Resmi
              </small>
            </div>
          </div>

          <Link
            to={href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              border: "none",
              background: "#022300",
              color: "#ffffff",
              borderRadius: "6px",
              padding: "9px 12px",
              cursor: "pointer",
              fontFamily: FONT_HALAMAN,
              fontSize: "10px",
              fontWeight: 600,
            }}
          >
            Baca Selengkapnya
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default BeritaUtama;