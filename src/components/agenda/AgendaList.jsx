import { useMemo, useState } from "react";
import AgendaFilter from "./AgendaFilters";
import AgendaCard from "./AgendaCard";
import AgendaCalendar from "./AgendaCalendar";

const agendaData = [
  {
    id: 1,
    title: "Hari Pertama Tahun Ajaran Baru",
    date: "2026-07-13",
    time: "07.00 WIB",
    location: "Lapangan Utama",
    category: "Akademik",
    description:
      "Kegiatan pembukaan tahun ajaran baru dan pengarahan bagi seluruh siswa.",
  },
  {
    id: 2,
    title: "Masa Pengenalan Lingkungan Sekolah",
    date: "2026-07-14",
    time: "07.00 WIB",
    location: "Aula Sekolah",
    category: "Kesiswaan",
    description:
      "Pengenalan lingkungan, tata tertib, fasilitas, dan budaya sekolah bagi siswa baru.",
  },
  {
    id: 3,
    title: "Rapat Orang Tua dan Wali Siswa",
    date: "2026-07-18",
    time: "09.00 WIB",
    location: "Aula Sekolah",
    category: "Sekolah",
    description:
      "Pertemuan orang tua dengan pihak sekolah untuk membahas program pembelajaran.",
  },
  {
    id: 4,
    title: "Penilaian Tengah Semester",
    date: "2026-09-14",
    time: "07.30 WIB",
    location: "Ruang Kelas",
    category: "Ujian",
    description:
      "Pelaksanaan penilaian tengah semester sesuai jadwal masing-masing kelas.",
  },
  {
    id: 5,
    title: "Peringatan Hari Sumpah Pemuda",
    date: "2026-10-28",
    time: "07.00 WIB",
    location: "Lapangan Utama",
    category: "Kesiswaan",
    description:
      "Upacara dan kegiatan siswa untuk memperingati Hari Sumpah Pemuda.",
  },
];

export default function AgendaList() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [selectedDate, setSelectedDate] = useState("");

  const filteredAgenda = useMemo(() => {
    return agendaData.filter((item) => {
      const matchesCategory =
        activeCategory === "Semua" ||
        item.category === activeCategory;

      const matchesDate =
        !selectedDate || item.date === selectedDate;

      return matchesCategory && matchesDate;
    });
  }, [activeCategory, selectedDate]);

  return (
    <section
      id="daftar-agenda"
      style={{
        padding: "50px 4% 65px",
        background: "#ffffff",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "28px" }}>
          <p
            style={{
              margin: "0 0 8px",
              color: "#387536",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            JADWAL KEGIATAN
          </p>

          <h2
            style={{
              margin: 0,
              color: "#103b16",
              fontFamily: "Georgia, serif",
              fontSize: "clamp(26px, 3vw, 36px)",
            }}
          >
            Agenda Mendatang
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              color: "#737d78",
              fontSize: "14px",
              lineHeight: 1.8,
            }}
          >
            Lihat agenda berdasarkan kategori atau pilih tanggal pada kalender.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <AgendaCalendar
              agenda={agendaData}
              onSelectDate={(date) => setSelectedDate(date)}
            />

            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate("")}
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  border: "1px solid #dce4d9",
                  borderRadius: "8px",
                  background: "#ffffff",
                  color: "#205d20",
                  cursor: "pointer",
                }}
              >
                Tampilkan semua tanggal
              </button>
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            <AgendaFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {selectedDate && (
              <p style={{ color: "#526453", fontSize: "13px" }}>
                Filter tanggal: {selectedDate}
              </p>
            )}

            <div style={{ display: "grid", gap: "16px" }}>
              {filteredAgenda.length > 0 ? (
                filteredAgenda.map((item) => (
                  <AgendaCard key={item.id} item={item} />
                ))
              ) : (
                <div
                  style={{
                    padding: "28px",
                    border: "1px dashed #cbd8c7",
                    borderRadius: "14px",
                    color: "#6b766d",
                    textAlign: "center",
                    lineHeight: 1.7,
                  }}
                >
                  Tidak ada agenda untuk pilihan tersebut.
                  <br />
                  Coba pilih kategori atau tanggal lainnya.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}