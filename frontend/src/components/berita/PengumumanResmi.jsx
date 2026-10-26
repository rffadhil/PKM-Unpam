import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  Download,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

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
      }}
    >
      {/* JUDUL PANEL */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            margin: 0,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          <Megaphone
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          Pengumuman Resmi
        </h2>

        <span
          style={{
            padding: "5px 7px",
            background: "#dce800",
            color: "#284b00",
            fontSize: "8px",
            fontWeight: "bold",
            borderRadius: "2px",
            whiteSpace: "nowrap",
          }}
        >
          PENTING
        </span>
      </div>

      {/* DAFTAR PENGUMUMAN */}
      {pengumumanData.map((item, index) => (
        <article
          key={item.nomor}
          style={{
            padding: "12px",
            marginBottom:
              index === pengumumanData.length - 1 ? "0" : "10px",
            border: "1px solid rgba(160, 210, 40, 0.3)",
            borderRadius: "7px",
            background: "rgba(0, 35, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "5px",
              color: "#b6cc5d",
              fontSize: "8px",
              lineHeight: 1.5,
            }}
          >
            <span>No: {item.nomor}</span>
            <span>{item.tanggal}</span>
          </div>

          <h3
            style={{
              margin: "8px 0",
              color: "#ffffff",
              fontSize: "11px",
              fontWeight: 500,
              lineHeight: "1.5",
            }}
          >
            {item.judul}
          </h3>

          <p
            style={{
              margin: "0 0 10px",
              color: "#c3d0bd",
              fontSize: "8px",
              lineHeight: "1.6",
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
              gap: "5px",
              padding: 0,
              border: "none",
              background: "transparent",
              color: "#dce900",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "8px",
              textAlign: "left",
            }}
          >
            {item.aksi}

            {item.aksi.toLowerCase().includes("unduh") ? (
              <Download size={11} strokeWidth={1.8} />
            ) : (
              <ExternalLink size={11} strokeWidth={1.8} />
            )}
          </button>
        </article>
      ))}

      {/* LIHAT SEMUA */}
      <button
        type="button"
        onClick={() => navigate("/pengumuman")}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
          width: "100%",
          padding: "14px 0 0",
          border: "none",
          background: "transparent",
          color: "#e0ed00",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "10px",
        }}
      >
        Lihat Seluruh Pengumuman (34)

        <ArrowRight size={13} strokeWidth={1.8} />
      </button>
    </section>
  );
}

export default PengumumanResmi;