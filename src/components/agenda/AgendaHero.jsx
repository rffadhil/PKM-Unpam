const statistics = [
  { label: "Total Agenda", value: "12+" },
  { label: "Kategori", value: "4" },
  { label: "Tahun Akademik", value: "2026/2027" },
];

export default function AgendaHero() {
  return (
    <section
      style={{
        padding: "45px 4%",
        background:
          "radial-gradient(circle at 85% 15%, #e2f8d8, transparent 35%), #f8f9fc",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <span
          style={{
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "30px",
            background: "#e4f8df",
            border: "1px solid #a8d39b",
            color: "#205d20",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          ● AGENDA RESMI SMA HARAPAN JAYA
        </span>

        <h2
          style={{
            maxWidth: "760px",
            margin: "22px 0 14px",
            color: "#103b16",
            fontFamily: "Georgia, serif",
            fontSize: "clamp(30px, 4vw, 46px)",
            lineHeight: 1.2,
          }}
        >
          Rencanakan Kegiatanmu, Raih Prestasi Terbaik
        </h2>

        <p
          style={{
            maxWidth: "720px",
            margin: 0,
            color: "#737d78",
            fontSize: "15px",
            lineHeight: 1.8,
          }}
        >
          Dapatkan informasi jadwal dan kegiatan sekolah agar kamu
          tidak melewatkan momen penting selama tahun ajaran berlangsung.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "14px",
            maxWidth: "850px",
            marginTop: "28px",
          }}
        >
          {statistics.map((item) => (
            <div
              key={item.label}
              style={{
                padding: "20px",
                background: "#ffffff",
                border: "1px solid #e2e8df",
                borderRadius: "14px",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  color: "#77817b",
                  fontSize: "12px",
                }}
              >
                {item.label}
              </p>

              <strong
                style={{
                  color: "#17451c",
                  fontSize: "22px",
                }}
              >
                {item.value}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}