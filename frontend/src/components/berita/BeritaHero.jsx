import { Newspaper } from "lucide-react";

function BeritaHero() {
  return (
    <section
      style={{
        background: "#ffffff",
        padding: "62px 25px 30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 12px",
            background: "#edf7ed",
            color: "#438049",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          <Newspaper size={14} strokeWidth={1.8} aria-hidden="true" />
          Kanal Resmi Warta Sekolah
        </span>

        <h1
          style={{
            margin: "15px 0 10px",
            fontFamily: "Georgia, serif",
            color: "#123d15",
            fontSize: "35px",
            lineHeight: 1.2,
          }}
        >
          Warta & Informasi Sekolah Harapan Jaya
        </h1>

        <p
          style={{
            maxWidth: "760px",
            margin: 0,
            color: "#819087",
            fontSize: "15px",
            lineHeight: 1.7,
          }}
        >
          Pusat publikasi berita terkini, capaian prestasi
          civitas, serta pengumuman resmi institusi SMA
          Harapan Jaya.
        </p>
      </div>
    </section>
  );
}

export default BeritaHero;