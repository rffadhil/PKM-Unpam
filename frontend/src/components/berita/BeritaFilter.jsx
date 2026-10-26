
const kategoriData = [
  ["Semua Berita", 48],
  ["Prestasi Siswa", 18],
  ["Kegiatan Akademik", 14],
  ["Adiwiyata & Lingkungan", 9],
  ["Pengumuman Resmi", 7],
];

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 7h9" />
      <path d="M17 7h3" />
      <path d="M4 17h3" />
      <path d="M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function BeritaFilter({
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
        padding: "18px 25px 32px",
        borderBottom: "1px solid #e5ebe6",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1 1 300px",
              minWidth: 0,
              height: "44px",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              boxSizing: "border-box",
              border: "1px solid #dce5de",
              borderRadius: "7px",
              background: "#ffffff",
              color: "#829188",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
                marginRight: "10px",
              }}
            >
              <SearchIcon />
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul berita, prestasi siswa, atau nomor pengumuman..."
              aria-label="Cari berita"
              style={{
                width: "100%",
                minWidth: 0,
                padding: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "12px",
                color: "#344039",
                fontFamily: "inherit",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#87938b",
              fontSize: "11px",
              flexShrink: 0,
            }}
          >
            <FilterIcon />

            <label htmlFor="berita-sort">Urutkan:</label>

            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <select
                id="berita-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                style={{
                  height: "42px",
                  padding: "0 32px 0 12px",
                  appearance: "none",
                  border: "1px solid #dce5de",
                  borderRadius: "7px",
                  background: "#ffffff",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: "#354139",
                  fontFamily: "inherit",
                }}
              >
                <option value="terbaru">Paling Baru (Terbaru)</option>
                <option value="terlama">Paling Lama</option>
              </select>

              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  display: "flex",
                  alignItems: "center",
                  color: "#718075",
                  pointerEvents: "none",
                }}
              >
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "17px",
          }}
        >
          {kategoriData.map(([nama, jumlah]) => {
            const aktif = kategoriAktif === nama;

            return (
              <button
                key={nama}
                type="button"
                onClick={() => setKategoriAktif(nama)}
                aria-pressed={aktif}
                style={{
                  padding: "9px 15px",
                  borderRadius: "20px",
                  border: aktif ? "1px solid #063e0a" : "1px solid #dfe7e0",
                  background: aktif ? "#063e0a" : "#f9fbf9",
                  color: aktif ? "#ffffff" : "#354139",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontFamily: "inherit",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {nama} ({jumlah})
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

