import { useState } from "react";

const monthNames = [
  "Januari", "Februari", "Maret", "April",
  "Mei", "Juni", "Juli", "Agustus",
  "September", "Oktober", "November", "Desember",
];

export default function AgendaCalendar({ agenda = [], onSelectDate }) {
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 6, 1)
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const agendaDates = new Set(
    agenda
      .filter((item) => {
        const date = new Date(`${item.date}T00:00:00`);
        return (
          date.getFullYear() === year &&
          date.getMonth() === month
        );
      })
      .map((item) => new Date(`${item.date}T00:00:00`).getDate())
  );

  function changeMonth(offset) {
    setCurrentDate(new Date(year, month + offset, 1));
  }

  return (
    <section
      style={{
        padding: "22px",
        border: "1px solid #e3e9df",
        borderRadius: "16px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          marginBottom: "22px",
        }}
      >
        <h3 style={{ margin: 0, color: "#153e19", fontSize: "18px" }}>
          {monthNames[month]} {year}
        </h3>

        <div style={{ display: "flex", gap: "8px" }}>
          {[-1, 1].map((offset) => (
            <button
              key={offset}
              type="button"
              onClick={() => changeMonth(offset)}
              aria-label={offset < 0 ? "Bulan sebelumnya" : "Bulan berikutnya"}
              style={{
                width: "36px",
                height: "36px",
                border: "1px solid #dce4d9",
                borderRadius: "8px",
                background: "#ffffff",
                color: "#17451c",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              {offset < 0 ? "‹" : "›"}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: "5px",
          textAlign: "center",
        }}
      >
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div
            key={day}
            style={{
              padding: "8px 0",
              color: "#77817b",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {day}
          </div>
        ))}

        {calendarCells.map((day, index) => (
          <button
            key={`${year}-${month}-${index}`}
            type="button"
            disabled={!day}
            onClick={() => {
              if (day && onSelectDate) {
                onSelectDate(
                  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                );
              }
            }}
            style={{
              minWidth: 0,
              minHeight: "40px",
              padding: "4px",
              border: "none",
              borderRadius: "8px",
              background: agendaDates.has(day)
                ? "#e4f8df"
                : "transparent",
              color: agendaDates.has(day) ? "#14531a" : "#364239",
              fontWeight: agendaDates.has(day) ? 800 : 400,
              cursor: day ? "pointer" : "default",
              outline: agendaDates.has(day)
                ? "1px solid #a8d39b"
                : "none",
            }}
          >
            {day || ""}
          </button>
        ))}
      </div>

      <p
        style={{
          margin: "18px 0 0",
          color: "#77817b",
          fontSize: "12px",
          lineHeight: 1.6,
        }}
      >
        Tanggal berwarna hijau menandakan adanya agenda terjadwal.
      </p>
    </section>
  );
}