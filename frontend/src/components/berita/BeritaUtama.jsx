import { Link } from "react-router-dom";
import {
  Trophy,
  CalendarDays,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { KATEGORI_PENGUMUMAN } from "@/config/beritaPublik";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

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
  const waktuBaca = (berita.baca || "1 mnt baca").replace("mnt", "menit");

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
        gridTemplateColumns: "56% 44%",
        overflow: "hidden",
        background: "#ffffff",
        border: "1px solid #dce5de",
        borderRadius: "9px",
        transition:
          "transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease",
        position: "relative",
        fontFamily: FONT_HALAMAN,
        fontWeight: 400,
      }}
    >
      <div
        style={{
          position: "relative",
          minHeight: "350px",
          overflow: "hidden",
          background: "#edf2ed",
        }}
      >
        <img
          className="headline-internasional-image"
          src={berita.gambar}
          alt={berita.judul}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "350px",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.4s ease",
          }}
        />

        <div
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
        style={{
          padding: "26px",
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          boxSizing: "border-box",
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
            fontSize: "11px",
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

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              fontFamily: FONT_HALAMAN,
              fontWeight: 400,
            }}
          >
            <Clock3 size={13} aria-hidden="true" />
            {waktuBaca}
          </span>
        </div>

        <h2
          style={{
            margin: "14px 0",
            color: "#143d17",
            fontFamily: FONT_HALAMAN,
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {berita.judul}
        </h2>

        <p
          style={{
            margin: 0,
            color: "#68766d",
            fontSize: "13px",
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
            paddingTop: "18px",
            borderTop: "1px solid #edf0ed",
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
                background: "#eef5eb",
                color: "#428045",
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
                  fontSize: "12px",
                  color: "#304037",
                  fontWeight: 400,
                  fontFamily: FONT_HALAMAN,
                }}
              >
                {penulis}
              </strong>

              <small
                style={{
                  color: "#89958d",
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
              background: "#063e0a",
              color: "#ffffff",
              borderRadius: "6px",
              padding: "10px 13px",
              cursor: "pointer",
              fontFamily: FONT_HALAMAN,
              fontSize: "11px",
              fontWeight: 400,
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