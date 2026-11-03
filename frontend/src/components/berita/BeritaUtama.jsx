import { useNavigate } from "react-router-dom";
import {
  Trophy,
  CalendarDays,
  Clock3,
  ArrowRight,
} from "lucide-react";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

function BeritaUtama() {
  const navigate = useNavigate();

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
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
          alt="Tim Robotik SMA Harapan Jaya"
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
            <Trophy size={12} strokeWidth={1.8} aria-hidden="true" />
            Prestasi Internasional
          </span>

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
            24 Februari 2026
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
            4 menit baca
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
          Tim Robotik SMA Harapan Jaya Sabet Medali Emas WRO 2026 di Tokyo
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
          Karya inovasi robot pemilah sampah otomatis berbasis sensor
          kecerdasan buatan (AI) yang dirancang siswa kelas XI IPA 1
          berhasil menyingkirkan 45 tim mancanegara pada putaran final
          World Robot Olympiad 2026 di Odaiba, Tokyo.
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
              HK
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
                Humas & Kesiswaan
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

          <button
            type="button"
            onClick={() => navigate("/berita/headline-wro-2026")}
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
          </button>
        </div>
      </div>
    </article>
  );
}

export default BeritaUtama;