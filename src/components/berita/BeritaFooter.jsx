import { Link, useNavigate } from "react-router-dom";
import {
  Phone,
  MapPin,
  Globe,
  MessageSquareWarning,
  ExternalLink,
  ShieldCheck,
  AtSign,
  Users,
} from "lucide-react";

function BeritaFooter() {
  const navigate = useNavigate();

  const socialIcons = [
    { Icon: AtSign, label: "Media sosial" },
    { Icon: Users, label: "Komunitas sekolah" },
    { Icon: Globe, label: "Situs resmi" },
  ];

  return (
    <footer
      style={{
        background: "#064d00",
        color: "#ffffff",
        padding: "35px 25px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "32px",
        }}
      >
        {/* IDENTITAS SEKOLAH */}
        <div>
          <h3 style={footerTitle}>SMA Harapan Jaya</h3>

          <p style={footerText}>
            Membentuk generasi pembelajar berkarakter
            Pancasila, unggul dalam sains dan teknologi,
            berwawasan global, dan berbudaya lingkungan
            hidup lestari.
          </p>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginTop: "12px",
              padding: "7px 9px",
              borderRadius: "5px",
              background: "#0c5e0a",
              color: "#e4ee00",
              fontSize: "8px",
              fontWeight: 700,
            }}
          >
            <ShieldCheck size={13} aria-hidden="true" />
            TERAKREDITASI A (UNGGUL) BAN-S/M
          </span>
        </div>

        {/* NAVIGASI UTAMA */}
        <div>
          <h3 style={footerTitle}>Navigasi Utama</h3>

          <FooterLink to="/profil" text="Profil Sekolah" />
          <FooterLink to="/visi-misi" text="Visi & Misi" />
          <FooterLink to="/kurikulum" text="Kurikulum Merdeka" />
          <FooterLink to="/agenda" text="Kalender Akademik" />
          <FooterLink to="/ppdb" text="PPDB 2026/2027" />
          <FooterLink to="/portal-sis" text="Portal E-Learning SIS" />
        </div>

        {/* ALAMAT KAMPUS */}
        <div>
          <h3 style={footerTitle}>Alamat Kampus</h3>

          <p style={footerText}>
            Jl. Harapan Bangsa No. 88,
            Jagakarsa, Jakarta Selatan,
            DKI Jakarta 12620
          </p>

          <a
            href="tel:+62217819920"
            style={{
              ...footerText,
              display: "flex",
              alignItems: "flex-start",
              gap: "7px",
              marginTop: "12px",
              textDecoration: "none",
            }}
          >
            <Phone
              size={13}
              style={{ flexShrink: 0, marginTop: "2px" }}
              aria-hidden="true"
            />
            <span>Telp: (021) 781-9920 / 781-9921</span>
          </a>

          <a
            href="https://maps.google.com/?q=Jl.+Harapan+Bangsa+No.+88+Jakarta"
            target="_blank"
            rel="noreferrer"
            style={mapLink}
          >
            <MapPin size={13} aria-hidden="true" />
            <span>Buka di Google Maps</span>
            <ExternalLink size={11} aria-hidden="true" />
          </a>
        </div>

        {/* MEDIA SOSIAL */}
        <div>
          <h3 style={footerTitle}>Terhubung Bersama Kami</h3>

          <p style={footerText}>
            Ikuti media sosial resmi SMA Harapan Jaya
            untuk galeri dokumentasi kegiatan
            ekstrakurikuler dan info prestasi harian.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "15px",
            }}
          >
            {socialIcons.map(({ Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                title={label}
                onClick={() => navigate("/media-sosial")}
                style={socialButton}
              >
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => navigate("/aspirasi")}
            style={aspirationButton}
          >
            <MessageSquareWarning size={14} aria-hidden="true" />
            Saluran Aspirasi & WBS
          </button>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "30px auto 0",
          paddingTop: "18px",
          borderTop: "1px solid rgba(255,255,255,.15)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px 24px",
          color: "#bdd0ba",
          fontSize: "9px",
        }}
      >
        <span style={{ lineHeight: 1.7 }}>
          © 2026 SMA Harapan Jaya. Hak Cipta Dilindungi
          Undang-Undang. Terakreditasi Unggul (A) BAN-S/M.
        </span>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 20px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/kebijakan-privasi")}
            style={bottomButton}
          >
            Kebijakan Privasi
          </button>

          <button
            type="button"
            onClick={() => navigate("/syarat-ketentuan")}
            style={bottomButton}
          >
            Syarat & Ketentuan
          </button>

          <button
            type="button"
            onClick={() => navigate("/kontak")}
            style={bottomButton}
          >
            Kontak & Pengaduan
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, text }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        marginBottom: "10px",
        color: "#cbd9c8",
        textDecoration: "none",
        fontSize: "10px",
        lineHeight: 1.5,
      }}
    >
      {text}
    </Link>
  );
}

const footerTitle = {
  margin: "0 0 15px",
  color: "#e6ed00",
  fontSize: "14px",
  fontWeight: 600,
};

const footerText = {
  margin: 0,
  color: "#c2d2be",
  fontSize: "10px",
  lineHeight: 1.7,
};

const mapLink = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  marginTop: "12px",
  color: "#dce900",
  textDecoration: "none",
  fontSize: "10px",
};

const socialButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: "50%",
  background: "#31732d",
  color: "#ffffff",
  cursor: "pointer",
};

const aspirationButton = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "7px",
  marginTop: "15px",
  padding: "9px 13px",
  border: "none",
  borderRadius: "6px",
  background: "#ffffff",
  color: "#164616",
  cursor: "pointer",
  fontSize: "9px",
  fontWeight: 500,
};

const bottomButton = {
  padding: 0,
  border: "none",
  background: "transparent",
  color: "#bdd0ba",
  cursor: "pointer",
  fontSize: "9px",
  textAlign: "left",
};

export default BeritaFooter;