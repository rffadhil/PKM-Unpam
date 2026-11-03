/** @format */

import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, ShieldCheck } from "lucide-react";
import { mockPengaturan } from "@/mocks/adminPengaturan";

const footerLinkStyle = {
  display: "block",
  marginBottom: "12px",
  color: "#d0dfcb",
  fontSize: "13px",
  textDecoration: "none",
};

const footerTextStyle = {
  margin: 0,
  color: "#d0dfcb",
  fontSize: "13px",
  lineHeight: 1.8,
};

const footerHeadingStyle = {
  margin: "0 0 18px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: 700,
};

export default function Footer({ portal = mockPengaturan }) {
  const namaSekolah = portal?.namaInstitusi || "SMA Harapan Jaya";
  const slogan =
    portal?.slogan ||
    "Membentuk generasi pembelajar berkarakter Pancasila, unggul dalam sains dan teknologi, serta berwawasan lingkungan hidup lestari.";
  const akreditasi = portal?.akreditasi || "Terakreditasi Unggul (A)";
  const alamat =
    portal?.alamat ||
    "Jl. Harapan Bangsa No. 88, Jagakarsa, Jakarta Selatan, DKI Jakarta 12620";
  const telepon = portal?.telepon || "(021) 781-9920";
  const email = portal?.email || "sekretariat@smaharapanjaya.sch.id";

  return (
    <footer
      style={{
        padding: "45px 4% 20px",
        background: "#063f08",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "32px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div>
          <h3 style={footerHeadingStyle}>{namaSekolah}</h3>

          <p style={footerTextStyle}>{slogan}</p>

          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              marginTop: "16px",
              color: "#e2eb24",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={16} />
            {akreditasi}
          </p>
        </div>

        <div>
          <h3 style={footerHeadingStyle}>Navigasi Utama</h3>

          <Link to="/" style={footerLinkStyle}>
            Beranda
          </Link>

          <Link to="/profil" style={footerLinkStyle}>
            Profil Sekolah
          </Link>

          <Link to="/berita" style={footerLinkStyle}>
            Berita
          </Link>

          <Link to="/agenda" style={footerLinkStyle}>
            Kalender Akademik
          </Link>

          <Link to="/galeri" style={footerLinkStyle}>
            Galeri
          </Link>

          <Link to="/kontak" style={footerLinkStyle}>
            Kontak
          </Link>
        </div>

        <div>
          <h3 style={footerHeadingStyle}>Alamat Kampus</h3>

          <p style={footerTextStyle}>{alamat}</p>

          <p
            style={{
              ...footerTextStyle,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "14px",
            }}
          >
            <Phone size={14} />
            {telepon}
          </p>

          <p
            style={{
              ...footerTextStyle,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <Mail size={14} />
            {email}
          </p>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(alamat)}`}
            target="_blank"
            rel="noreferrer"
            style={{
              ...footerLinkStyle,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "12px",
              color: "#e2eb24",
            }}
          >
            <MapPin size={14} />
            Buka di Google Maps
          </a>
        </div>

        <div>
          <h3 style={footerHeadingStyle}>Layanan Pengaduan</h3>

          <p style={footerTextStyle}>
            Hubungi pihak sekolah untuk informasi agenda, jadwal kegiatan, dan
            layanan pendidikan.
          </p>

          <Link
            to="/kontak"
            style={{
              display: "inline-block",
              marginTop: "18px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "#e2eb24",
              color: "#153e19",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Hubungi Sekolah
          </Link>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "32px auto 0",
          paddingTop: "18px",
          borderTop: "1px solid rgba(255,255,255,0.18)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "12px",
          color: "#c4d3bf",
          fontSize: "12px",
        }}
      >
        <span>© 2026 {namaSekolah}. Hak Cipta Dilindungi.</span>

        <Link
          to="/kontak"
          style={{
            color: "#e2eb24",
            textDecoration: "none",
          }}
        >
          Kontak & Pengaduan
        </Link>
      </div>
    </footer>
  );
}
