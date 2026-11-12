const FONT_HALAMAN = '"Times New Roman", Times, serif';

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
        padding: "20px 25px 28px",
        borderBottom: "1px solid #e5ebe6",
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
              height: "44px",
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              border: "1px solid #dce5de",
              borderRadius: "7px",
              boxSizing: "border-box",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                marginRight: "10px",
                color: "#829188",
                fontSize: "20px",
                fontFamily: FONT_HALAMAN,
                fontWeight: 400,
              }}
            >
              ⌕
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul berita, prestasi siswa, atau nomor pengumuman..."
              style={{
                width: "100%",
                minWidth: 0,
                border: "none",
                outline: "none",
                fontSize: "13px",
                color: "#344039",
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
              color: "#68766d",
              fontSize: "12px",
              flexShrink: 0,
              fontFamily: FONT_HALAMAN,
              fontWeight: 400,
            }}
          >
            <span aria-hidden="true">☷</span>
            <span>Urutkan:</span>

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              style={{
                height: "42px",
                padding: "0 12px",
                border: "1px solid #dce5de",
                borderRadius: "7px",
                background: "#ffffff",
                color: "#344039",
                cursor: "pointer",
                fontSize: "12px",
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
            marginTop: "17px",
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
                  padding: "9px 14px",
                  borderRadius: "20px",
                  border: aktif
                    ? "1px solid #063e0a"
                    : "1px solid #dfe7e0",
                  background: aktif ? "#063e0a" : "#f9fbf9",
                  color: aktif ? "#ffffff" : "#354139",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontFamily: FONT_HALAMAN,
                  fontWeight: 400,
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