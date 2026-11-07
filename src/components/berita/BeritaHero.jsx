import { Newspaper } from "lucide-react";

function BeritaHero() {
  return (
    <section
      style={{
        background: "#ffffff",
        padding: "52px 25px 30px",
        fontFamily: '"Times New Roman", Times, serif',
        fontWeight: 400,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          fontFamily: '"Times New Roman", Times, serif',
          fontWeight: 400,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "7px 13px",
            background: "#edf7ed",
            color: "#438049",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 400,
            fontFamily: '"Times New Roman", Times, serif',
          }}
        >
          <Newspaper size={15} strokeWidth={1.8} aria-hidden="true" />
          Kanal Resmi Warta Sekolah
        </span>

        <h1
          style={{
            margin: "16px 0 11px",
            fontFamily: '"Times New Roman", Times, serif',
            color: "#123d15",
            fontSize: "30px",
            lineHeight: 1.3,
            fontWeight: 700,
          }}
        >
          Warta & Informasi Sekolah Harapan Jaya
        </h1>

        <p
          style={{
            maxWidth: "760px",
            margin: 0,
            color: "#718078",
            fontSize: "15px",
            lineHeight: 1.7,
            fontWeight: 400,
            fontFamily: '"Times New Roman", Times, serif',
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