function BeritaHero() {
  return (
    <section
      style={{
        background: "#ffffff",
        padding: "28px 24px 20px",
        fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
        fontWeight: 400,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
          fontWeight: 400,
        }}
      >
        <h1
          className="berita-page-title"
          style={{
            margin: "0 0 8px",
            fontFamily: "'Source Serif 4', Georgia, serif",
            color: "#022300",
            fontSize: "26px",
            lineHeight: 1.25,
            fontWeight: 600,
          }}
        >
          Warta & Informasi Sekolah Harapan Jaya
        </h1>

        <p
          style={{
            maxWidth: "760px",
            margin: 0,
            color: "#64748b",
            fontSize: "13px",
            lineHeight: 1.6,
            fontWeight: 400,
            fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
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