import {
  Newspaper,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

function LayananMedia() {
  return (
    <section
      style={{
        marginTop: "18px",
        padding: "18px",
        background: "#f0f4ff",
        border: "1px solid #dbe4f1",
        borderRadius: "9px",
        boxSizing: "border-box",
        fontFamily: FONT_HALAMAN,
        fontWeight: 400,
      }}
    >
      <h3
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: "0 0 10px",
          color: "#46704c",
          fontSize: "14px",
          fontWeight: 700,
          lineHeight: 1.4,
          fontFamily: FONT_HALAMAN,
        }}
      >
        <Newspaper size={17} aria-hidden="true" />
        Layanan Pers & Liputan Media
      </h3>

      <p
        style={{
          margin: "0 0 12px",
          color: "#718078",
          fontSize: "12px",
          lineHeight: 1.6,
          fontFamily: FONT_HALAMAN,
          fontWeight: 400,
        }}
      >
        Untuk kebutuhan verifikasi berita sekolah, izin peliputan,
        atau konfirmasi humas:
      </p>

      <a
        href="mailto:redaksi.warta@smaharapanjaya.sch.id"
        style={contactLink}
      >
        <Mail
          size={14}
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        />

        <span style={{ overflowWrap: "anywhere" }}>
          redaksi.warta@smaharapanjaya.sch.id
        </span>

        <ExternalLink
          size={12}
          aria-hidden="true"
          style={{ flexShrink: 0, marginLeft: "auto" }}
        />
      </a>

      <a
        href="tel:+6281288997766"
        style={contactLink}
      >
        <Phone
          size={14}
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        />

        <span>
          +62 812-8899-7766

          <span
            style={{
              display: "block",
              marginTop: "3px",
              color: "#849087",
              fontSize: "10px",
              fontWeight: 400,
              fontFamily: FONT_HALAMAN,
            }}
          >
            Bu Ratna — Humas
          </span>
        </span>
      </a>
    </section>
  );
}

const contactLink = {
  display: "flex",
  alignItems: "center",
  gap: "9px",
  width: "100%",
  padding: "8px 0",
  border: "none",
  background: "transparent",
  color: "#52645a",
  textDecoration: "none",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: '"Times New Roman", Times, serif',
  fontSize: "11px",
  fontWeight: 400,
  lineHeight: 1.5,
  boxSizing: "border-box",
};

export default LayananMedia;