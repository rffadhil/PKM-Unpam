import { ListFilter, Search } from "lucide-react";

const FONT_HALAMAN = "'Plus Jakarta Sans', Arial, sans-serif";

const kategoriData = [
  "Semua Berita",
  "Prestasi Siswa",
  "Kegiatan Akademik",
  "Adiwiyata & Lingkungan",
  "Pengumuman Resmi",
];

function BeritaFilter({
  search,
  setSearch,
  kategoriAktif,
  setKategoriAktif,
  sort,
  setSort,
}) {
  return (
    <section
      style={{
        background: "#ffffff",
        padding: "16px 24px 24px",
        borderBottom: "1px solid #e2e8f0",
        fontFamily: FONT_HALAMAN,
        fontWeight: 400,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          fontFamily: FONT_HALAMAN,
          fontWeight: 400,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1 1 320px",
              minWidth: 0,
              height: "42px",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              background: "#f8fafc",
              boxSizing: "border-box",
            }}
          >
            <Search size={16} aria-hidden="true" color="#64748b" style={{ marginRight: 10, flexShrink: 0 }} />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Cari berita"
              placeholder="Cari judul berita, prestasi siswa, atau nomor pengumuman..."
              style={{
                width: "100%",
                minWidth: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "12px",
                color: "#111c2d",
                fontFamily: FONT_HALAMAN,
                fontWeight: 400,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              color: "#64748b",
              fontSize: "11px",
              flexShrink: 0,
              fontFamily: FONT_HALAMAN,
              fontWeight: 400,
            }}
          >
            <ListFilter size={15} aria-hidden="true" />
            <span>Urutkan:</span>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              style={{
                height: "40px",
                padding: "0 12px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: "#f8fafc",
                color: "#111c2d",
                cursor: "pointer",
                fontSize: "11px",
                fontFamily: FONT_HALAMAN,
                fontWeight: 400,
              }}
            >
              <option value="terbaru">Paling Baru (Terbaru)</option>
              <option value="terlama">Paling Lama</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "14px",
          }}
        >
          {kategoriData.map((nama) => {
            const aktif = kategoriAktif === nama;

            return (
              <button
                key={nama}
                type="button"
                onClick={() => setKategoriAktif(nama)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "20px",
                  border: aktif
                    ? "1px solid #022300"
                    : "1px solid #e2e8f0",
                  background: aktif ? "#022300" : "#f8fafc",
                  color: aktif ? "#ffffff" : "#111c2d",
                  cursor: "pointer",
                  fontSize: "10px",
                  fontFamily: FONT_HALAMAN,
                  fontWeight: aktif ? 600 : 500,
                  transition: "background 0.2s ease, color 0.2s ease",
                }}
              >
                {nama}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BeritaFilter;