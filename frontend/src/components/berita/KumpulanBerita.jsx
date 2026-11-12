import { useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BeritaCard from "./BeritaCard";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

function KumpulanBerita({
  berita,
  halaman,
  setHalaman,
}) {
  const jumlahPerHalaman = 10;

  const totalHalaman = Math.max(
    5,
    Math.ceil(berita.length / jumlahPerHalaman)
  );

  const halamanAktif = Math.min(
    Math.max(1, halaman),
    totalHalaman
  );

  useEffect(() => {
    if (halaman !== halamanAktif) {
      setHalaman(halamanAktif);
    }
  }, [halaman, halamanAktif, setHalaman]);

  const beritaHalaman = useMemo(() => {
    const awal = (halamanAktif - 1) * jumlahPerHalaman;

    return berita.slice(awal, awal + jumlahPerHalaman);
  }, [berita, halamanAktif]);

  const awalArtikel =
    berita.length === 0
      ? 0
      : (halamanAktif - 1) * jumlahPerHalaman + 1;

  const akhirArtikel = Math.min(
    halamanAktif * jumlahPerHalaman,
    berita.length
  );

  const ubahHalaman = (nomor) => {
    setHalaman(Math.max(1, Math.min(totalHalaman, nomor)));
  };

  return (
    <section
      style={{
        fontFamily: FONT_HALAMAN,
        fontWeight: 400,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "18px",
          fontFamily: FONT_HALAMAN,
          fontWeight: 400,
        }}
      >
        <h2
          style={{
            margin: 0,
            paddingLeft: "12px",
            borderLeft: "4px solid #708238",
            color: "#043927",
            fontSize: "19px",
            fontWeight: 700,
            lineHeight: 1.4,
            fontFamily: FONT_HALAMAN,
          }}
        >
          Kumpulan Warta Terkini
        </h2>

        <span
          style={{
            color: "#667568",
            fontSize: "11px",
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          Menampilkan {awalArtikel}–{akhirArtikel} dari{" "}
          {berita.length} artikel
        </span>
      </div>

      {berita.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px",
          }}
        >
          {beritaHalaman.map((item) => (
            <div
              key={item.id}
              style={{
                minWidth: 0,
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
                borderRadius: "8px",
              }}
            >
              <BeritaCard berita={item} />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "35px 20px",
            border: "1px solid #e0e8e1",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#7d8981",
            textAlign: "center",
            fontSize: "13px",
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          Tidak ada berita yang sesuai dengan pencarian atau kategori ini.
        </div>
      )}

      <div
        style={{
          marginTop: "25px",
          padding: "13px",
          background: "#ffffff",
          border: "1px solid #e0e8e1",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          fontFamily: FONT_HALAMAN,
          fontWeight: 400,
        }}
      >
        <span
          style={{
            color: "#667568",
            fontSize: "11px",
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          Halaman {halamanAktif} dari {totalHalaman} ({berita.length} berita)
        </span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "5px",
          }}
        >
          <button
            type="button"
            disabled={halamanAktif === 1}
            onClick={() => ubahHalaman(halamanAktif - 1)}
            style={paginationButton(halamanAktif === 1)}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={14} />
            <span>Sebelumnya</span>
          </button>

          {Array.from(
            { length: totalHalaman },
            (_, index) => index + 1
          ).map((nomor) => (
            <button
              key={nomor}
              type="button"
              onClick={() => ubahHalaman(nomor)}
              style={paginationButton(
                false,
                halamanAktif === nomor
              )}
              aria-label={`Halaman ${nomor}`}
              aria-current={
                halamanAktif === nomor ? "page" : undefined
              }
            >
              {nomor}
            </button>
          ))}

          <button
            type="button"
            disabled={halamanAktif === totalHalaman}
            onClick={() => ubahHalaman(halamanAktif + 1)}
            style={paginationButton(halamanAktif === totalHalaman)}
            aria-label="Halaman selanjutnya"
          >
            <span>Selanjutnya</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}

function paginationButton(disabled, active = false) {
  return {
    minWidth: "32px",
    minHeight: "32px",
    padding: "0 9px",
    border: active
      ? "1px solid #043927"
      : "1px solid #dfe6e0",
    borderRadius: "5px",
    background: active ? "#043927" : "#ffffff",
    color: active ? "#ffffff" : "#444C38",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    fontSize: "11px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "3px",
    fontFamily: FONT_HALAMAN,
    fontWeight: 400,
  };
}

export default KumpulanBerita;