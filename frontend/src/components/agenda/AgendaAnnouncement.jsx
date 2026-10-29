import { Megaphone } from "lucide-react";

export default function AgendaAnnouncement() {
  return (
    <section
      style={{
        width: "100%",
        minHeight: "42px",
        background: "#e4e900",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 4%",
        boxSizing: "border-box",
        gap: "20px",
        color: "#18351f",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13px",
          fontWeight: 600,
          lineHeight: 1.4,
        }}
      >
        <Megaphone
          size={17}
          strokeWidth={2.2}
          color="#18351f"
        />

        <span>
          Pendaftaran PPDB 2026/2027 Gelombang I Resmi Dibuka!
          Pastikan NISN &amp; Data Terdaftar di Dapodik Aktif.
        </span>
      </div>

      <a
        href="#jadwal-ppdb"
        style={{
          color: "#18351f",
          fontSize: "13px",
          fontWeight: 700,
          textDecoration: "underline",
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
      >
        Lihat Jadwal →
      </a>
    </section>
  );
}