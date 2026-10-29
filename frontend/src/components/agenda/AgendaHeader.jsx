export default function AgendaHeader() {
  return (
    <section
      style={{
        padding: "28px 4% 18px",
        background: "#ffffff",
        borderBottom: "1px solid #e5eadf",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          color: "#387536",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "1px",
          textTransform: "uppercase",
        }}
      >
        Informasi Sekolah
      </p>

      <h1
        style={{
          margin: 0,
          color: "#103b16",
          fontSize: "clamp(28px, 4vw, 40px)",
          fontFamily: "Georgia, serif",
        }}
      >
        Kalender Akademik & Agenda Sekolah
      </h1>

      <p
        style={{
          maxWidth: "760px",
          margin: "12px 0 0",
          color: "#737d78",
          fontSize: "15px",
          lineHeight: 1.8,
        }}
      >
        Temukan jadwal kegiatan akademik, acara sekolah, ujian,
        pertemuan orang tua, dan berbagai kegiatan siswa SMA Harapan Jaya.
      </p>
    </section>
  );
}
