import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  Download,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

const pengumumanData = [
  {
    nomor: "421.3/089/SMA-HJ/2026",
    tanggal: "25 Feb 2026",
    judul:
      "Verifikasi Berkas Calon Peserta Didik Baru (PPDB) Jalur Prestasi 2026/2027",
    isi:
      "Batas akhir unggah portofolio sertifikat kejuaraan tingkat kota & provinsi diperpanjang hingga 2 Maret 2026 pukul 15.00 WIB.",
    aksi: "Unduh Petunjuk Teknis (PDF)",
  },
  {
    nomor: "421.3/082/SMA-HJ/2026",
    tanggal: "21 Feb 2026",
    judul:
      "Jadwal Gladi Bersih Asesmen Nasional Berbasis Komputer (ANBK) 2026",
    isi:
      "Wajib diikuti oleh seluruh siswa kelas XI. Pembagian sesi dan ruang server telah dirilis melalui portal SIS.",
    aksi: "Lihat Pembagian Sesi",
  },
  {
    nomor: "421.3/077/SMA-HJ/2026",
    tanggal: "14 Feb 2026",
    judul:
      "Surat Edaran Libur Awal Ramadhan 1447 H & Penyesuaian Jam Belajar",
    isi:
      "Informasi penyesuaian jam kepulangan siswa selama bulan puasa dan jadwal pengantaran selama Ramadhan.",
    aksi: "Unduh Surat Edaran (PDF)",
  },
];

function PengumumanResmi() {
  const navigate = useNavigate();

  return (
    <section
      style={{
        background: "#063e0a",
        border: "1px solid #527c28",
        borderRadius: "9px",
        padding: "18px",
        color: "#ffffff",
        fontFamily: FONT_HALAMAN,
        fontWeight: 400,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          marginBottom: "16px",
          fontFamily: FONT_HALAMAN,
          fontWeight: 400,
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: 0,
            fontSize: "15px",
            fontWeight: 700,
            fontFamily: FONT_HALAMAN,
          }}
        >
          <Megaphone size={17} aria-hidden="true" />
          Pengumuman Resmi
        </h2>

        <span
          style={{
            padding: "5px 8px",
            background: "#dce800",
            color: "#284b00",
            fontSize: "9px",
            fontWeight: 400,
            borderRadius: "3px",
            whiteSpace: "nowrap",
            fontFamily: FONT_HALAMAN,
          }}
        >
          PENTING
        </span>
      </div>

      {pengumumanData.map((item, index) => (
        <article
          key={item.nomor}
          style={{
            padding: "13px",
            marginBottom:
              index === pengumumanData.length - 1 ? "0" : "11px",
            border: "1px solid rgba(160, 210, 40, 0.3)",
            borderRadius: "7px",
            background: "rgba(0, 35, 0, 0.3)",
            fontFamily: FONT_HALAMAN,
            fontWeight: 400,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "6px",
              color: "#c1d47a",
              fontSize: "10px",
              lineHeight: 1.5,
              fontFamily: FONT_HALAMAN,
              fontWeight: 400,
            }}
          >
            <span>No: {item.nomor}</span>
            <span>{item.tanggal}</span>
          </div>

          <h3
            style={{
              margin: "9px 0",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 700,
              lineHeight: 1.5,
              fontFamily: FONT_HALAMAN,
            }}
          >
            {item.judul}
          </h3>

          <p
            style={{
              margin: "0 0 12px",
              color: "#d0dccb",
              fontSize: "11px",
              lineHeight: 1.65,
              fontFamily: FONT_HALAMAN,
              fontWeight: 400,
            }}
          >
            {item.isi}
          </p>

          <button
            type="button"
            onClick={() => navigate("/pengumuman")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: 0,
              border: "none",
              background: "transparent",
              color: "#e0ed00",
              cursor: "pointer",
              fontFamily: FONT_HALAMAN,
              fontSize: "11px",
              fontWeight: 400,
              textAlign: "left",
            }}
          >
            {item.aksi}

            {item.aksi.toLowerCase().includes("unduh") ? (
              <Download size={12} aria-hidden="true" />
            ) : (
              <ExternalLink size={12} aria-hidden="true" />
            )}
          </button>
        </article>
      ))}

      <button
        type="button"
        onClick={() => navigate("/pengumuman")}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
          width: "100%",
          padding: "15px 0 0",
          border: "none",
          background: "transparent",
          color: "#e0ed00",
          cursor: "pointer",
          fontFamily: FONT_HALAMAN,
          fontSize: "11px",
          fontWeight: 400,
        }}
      >
        Lihat Seluruh Pengumuman (34)
        <ArrowRight size={13} aria-hidden="true" />
      </button>
    </section>
  );
}

export default PengumumanResmi;