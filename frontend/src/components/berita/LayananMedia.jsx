import {
  Newspaper,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";

function LayananMedia() {
  return (
    <section
      style={{
        marginTop: "18px",
        padding: "18px",
        background: "#f0f4ff",
        border: "1px solid #dbe4f1",
        borderRadius: "9px",
      }}
    >
      {/* JUDUL */}
      <h3
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: "0 0 9px",
          color: "#46704c",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        <Newspaper
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
        />

        Layanan Pers & Liputan Media
      </h3>

      {/* DESKRIPSI */}
      <p
        style={{
          margin: "0 0 12px",
          color: "#7d8c82",
          fontSize: "9px",
          lineHeight: "1.6",
        }}
      >
        Untuk kebutuhan verifikasi berita sekolah,
        izin peliputan, atau konfirmasi humas:
      </p>

      {/* EMAIL */}
      <a
        href="mailto:redaksi.warta@smaharapanjaya.sch.id"
        style={contactLink}
      >
        <Mail
          size={13}
          strokeWidth={1.8}
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        />

        <span style={{ overflowWrap: "anywhere" }}>
          redaksi.warta@smaharapanjaya.sch.id
        </span>

        <ExternalLink
          size={11}
          strokeWidth={1.7}
          aria-hidden="true"
          style={{ flexShrink: 0, marginLeft: "auto" }}
        />
      </a>

      {/* TELEPON */}
      <a
        href="tel:+6281288997766"
        style={contactLink}
      >
        <Phone
          size={13}
          strokeWidth={1.8}
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
              fontSize: "8px",
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
  gap: "8px",
  width: "100%",
  padding: "7px 0",
  border: "none",
  background: "transparent",
  color: "#52645a",
  textDecoration: "none",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "inherit",
  fontSize: "9px",
  lineHeight: 1.5,
};

export default LayananMedia;