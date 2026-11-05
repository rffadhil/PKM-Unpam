export default function AgendaCard({ item }) {
  const date = new Date(`${item.date}T00:00:00`);

  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        padding: "22px",
        background: "#ffffff",
        border: "1px solid #e3e9df",
        borderRadius: "15px",
        boxShadow: "0 3px 12px rgba(20, 60, 20, 0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            padding: "6px 10px",
            borderRadius: "20px",
            background: "#e7f6e3",
            color: "#28632a",
            fontSize: "11px",
            fontWeight: 700,
          }}
        >
          {item.category}
        </span>

        <span style={{ color: "#6f7b71", fontSize: "12px" }}>
          {formattedDate}
        </span>
      </div>

      <h3
        style={{
          margin: 0,
          color: "#153e19",
          fontSize: "19px",
          lineHeight: 1.45,
        }}
      >
        {item.title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#717c74",
          fontSize: "14px",
          lineHeight: 1.8,
        }}
      >
        {item.description}
      </p>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px solid #edf0eb",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          color: "#425247",
          fontSize: "12px",
        }}
      >
        <span>◷ {item.time}</span>
        <span>⌖ {item.location}</span>
      </div>
    </article>
  );
}