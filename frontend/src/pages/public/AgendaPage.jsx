/** @format */

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Icon from "@/components/ui/Icon";
import PageHero from "@/components/ui/PageHero";
import AgendaDetailModal from "@/components/agenda/AgendaDetailModal";
import { agendaSekolah } from "@/data/agenda";
import { useDaftarAgenda } from "@/hooks/useAgenda";

const latarPutihBertekstur = {
  backgroundColor: "#ffffff",
  backgroundImage:
    "radial-gradient(rgba(47, 107, 25, 0.08) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

const gayaVisualAgenda = `
  .ap-hero-block {
    position: relative;
    background: #063b00 !important;
    border-bottom: 4px solid #e2eb24 !important;
    color: #ffffff !important;
    box-shadow: 0 10px 24px rgba(2, 35, 0, 0.14);
  }

  .ap-hero-block *,
  .ap-hero-block *::before,
  .ap-hero-block *::after {
    background-color: transparent !important;
  }

  .ap-hero-block h1,
  .ap-hero-block h2 {
    color: #ffffff !important;
    opacity: 1 !important;
  }

  .ap-hero-block p,
  .ap-hero-block span {
    color: #dbe8d8 !important;
    opacity: 1 !important;
  }

  .ap-card-agenda {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(47, 107, 25, 0.22);
    border-radius: 16px;
    box-shadow: 0 4px 14px rgba(2, 35, 0, 0.05);
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .ap-card-agenda::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #2f6b19 0%, #063b00 65%, #E1E100 100%);
    transform: scaleX(0.35);
    transform-origin: left;
    transition: transform 0.28s ease;
    z-index: 2;
  }

  .ap-card-agenda:hover {
    transform: translateY(-6px);
    border-color: rgba(47, 107, 25, 0.45);
    box-shadow: 0 14px 28px rgba(2, 35, 0, 0.13), 0 5px 10px rgba(2, 35, 0, 0.07);
  }

  .ap-card-agenda:hover::before {
    transform: scaleX(1);
  }
`;

function JudulBagian({ judul, deskripsi }) {
  return (
    <div>
      <h2
        style={{
          margin: 0,
          color: "#022300",
          fontSize: "28px",
          fontWeight: 700,
          lineHeight: 1.25,
        }}
      >
        {judul}
      </h2>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            height: "4px",
            width: "52px",
            borderRadius: "999px",
            background: "#2f6b19",
          }}
        />
        <span
          style={{
            display: "inline-block",
            height: "4px",
            width: "16px",
            borderRadius: "999px",
            background: "#E1E100",
          }}
        />
      </div>

      {deskripsi && (
        <p
          style={{
            marginTop: "12px",
            maxWidth: "680px",
            fontSize: "14px",
            lineHeight: 1.65,
            color: "#55687a",
          }}
        >
          {deskripsi}
        </p>
      )}
    </div>
  );
}

function KartuAgenda({ agenda, onBuka }) {
  return (
    <article className="ap-card-agenda group flex h-full flex-col p-5 sm:p-6">
      {/* Bagian Atas: Kotak Tanggal & Kategori */}
      <div className="flex items-center gap-3.5">
        <div
          style={{
            background: "linear-gradient(155deg, #022300 0%, #063b00 60%, #2f6b19 100%)",
            border: "1.5px solid rgba(226, 235, 36, 0.55)",
            boxShadow: "0 6px 14px rgba(2, 35, 0, 0.16)",
          }}
          className="flex h-[68px] w-[68px] shrink-0 flex-col items-center justify-center rounded-2xl text-white"
        >
          <span className="text-[24px] font-bold leading-none text-white">
            {agenda.tanggal}
          </span>

          <span
            style={{ color: "#e2eb24" }}
            className="mt-1.5 text-[9.5px] font-bold tracking-wider"
          >
            {agenda.bulan}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <span
            style={{
              background: "#e9f6e5",
              color: "#063b00",
              border: "1px solid rgba(47, 107, 25, 0.25)",
            }}
            className="inline-block rounded-full px-3 py-1 text-[11px] font-bold leading-none"
          >
            {agenda.kategori}
          </span>

          <p
            style={{ color: "#4d6150" }}
            className="mt-2 flex items-center gap-1.5 text-[12px] font-medium leading-4"
          >
            <Icon
              name="event"
              className="shrink-0 text-[15px] text-[#2f6b19]"
            />
            <span>{agenda.hari}</span>
          </p>
        </div>
      </div>

      {/* Judul Agenda */}
      <h3
        style={{ color: "#022300" }}
        className="mt-5 min-h-[44px] line-clamp-2 text-[17px] font-bold leading-[1.35] transition-colors group-hover:text-[#2f6b19]"
      >
        {agenda.judul}
      </h3>

      {/* Deskripsi Singkat */}
      <p
        style={{ color: "#5c6d63" }}
        className="mt-2.5 min-h-[60px] line-clamp-3 font-sans text-[13px] leading-[1.65]"
      >
        {agenda.deskripsi}
      </p>

      {/* Kotak Info Lokasi & Waktu */}
      <div
        style={{
          background: "#f5faf4",
          border: "1px solid rgba(47, 107, 25, 0.16)",
        }}
        className="mt-4 space-y-2 rounded-xl p-3 font-sans text-[12px] leading-[18px] text-[#3c4f42]"
      >
        <p className="flex items-start gap-2">
          <Icon
            name="location_on"
            className="mt-0.5 shrink-0 text-[16px] text-[#2f6b19]"
          />
          <span className="line-clamp-1 font-medium">{agenda.lokasi}</span>
        </p>

        <p className="flex items-center gap-2">
          <Icon
            name="schedule"
            className="shrink-0 text-[16px] text-[#2f6b19]"
          />
          <span className="font-medium">{agenda.waktu}</span>
        </p>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() => onBuka(agenda)}
          aria-haspopup="dialog"
          style={{ color: "#063b00" }}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-[#2f6b19]"
        >
          <span>Baca selengkapnya</span>
          <Icon
            name="arrow_forward"
            className="text-[16px] transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>
    </article>
  );
}

function paginationButton(disabled, active = false) {
  return {
    minWidth: "34px",
    minHeight: "34px",
    padding: "0 11px",
    border: active
      ? "1px solid #063b00"
      : "1px solid rgba(47, 107, 25, 0.25)",
    borderRadius: "8px",
    background: active ? "#063b00" : "#ffffff",
    color: active ? "#e2eb24" : "#123b16",
    fontWeight: active ? 700 : 500,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    fontSize: "12px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    fontFamily: "Arial, sans-serif",
  };
}

export default function AgendaPage() {
  const [halaman, setHalaman] = useState(1);
  const [agendaTerpilih, setAgendaTerpilih] = useState(null);
  const { data: daftarDariApi = [] } = useDaftarAgenda();

  const daftarAgendaSekolah = useMemo(() => {
    if (daftarDariApi && daftarDariApi.length > 0) {
      return daftarDariApi.map((a) => {
        const tMulai = a.tanggalMulai || a.tanggal_mulai || "";
        let hariTeks = "-";
        let bulanTeks = "-";
        let tglTeks = "-";
        if (tMulai) {
          const s = String(tMulai).slice(0, 10);
          const [thn, bln, tgl] = s.split("-").map(Number);
          if (thn && bln && tgl) {
            tglTeks = String(tgl).padStart(2, "0");
            const d = new Date(thn, bln - 1, tgl);
            bulanTeks = d
              .toLocaleDateString("id-ID", { month: "short", year: "numeric" })
              .toUpperCase();
            hariTeks = d.toLocaleDateString("id-ID", { weekday: "long" });
          }
        }
        return {
          id: a.id,
          tanggal: tglTeks !== "-" ? tglTeks : a.tanggal || "-",
          bulan: bulanTeks !== "-" ? bulanTeks : a.bulan || "-",
          hari: hariTeks !== "-" ? hariTeks : a.hari || "-",
          kategori: a.kategori || "Agenda Sekolah",
          judul: a.judul || "",
          deskripsi: a.deskripsi || "",
          lokasi: a.lokasi || "SMA Harapan Jaya",
          waktu: a.waktu || "Waktu belum ditentukan",
        };
      });
    }
    return agendaSekolah;
  }, [daftarDariApi]);

  const jumlahPerHalaman = 10;

  const totalHalaman = Math.max(
    1,
    Math.ceil(daftarAgendaSekolah.length / jumlahPerHalaman)
  );

  const halamanAktif = Math.min(Math.max(1, halaman), totalHalaman);

  useEffect(() => {
    if (halaman !== halamanAktif) {
      setHalaman(halamanAktif);
    }
  }, [halaman, halamanAktif]);

  const agendaHalaman = useMemo(() => {
    const awal = (halamanAktif - 1) * jumlahPerHalaman;

    return daftarAgendaSekolah.slice(awal, awal + jumlahPerHalaman);
  }, [halamanAktif, daftarAgendaSekolah]);

  const ubahHalaman = (nomor) => {
    setHalaman(Math.max(1, Math.min(totalHalaman, nomor)));
  };

  return (
    <main
      className="min-h-screen"
      style={{
        ...latarPutihBertekstur,
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      <style>{gayaVisualAgenda}</style>

      {/* HERO AGENDA DENGAN BLOK HIJAU TUA */}
      <div className="ap-hero-block [&_h1]:!font-['Times_New_Roman',Times,serif] [&_p]:!font-['Times_New_Roman',Times,serif]">
        <PageHero
          judul="Agenda Sekolah"
          deskripsi="Temukan berbagai jadwal kegiatan dan acara SMA Harapan Jaya, mulai dari kegiatan akademik, kegiatan siswa, peringatan hari besar, hingga aktivitas sekolah lainnya"
        />
      </div>

      {/* DAFTAR AGENDA SEKOLAH */}
      <section
        id="agenda-section"
        className="scroll-mt-24"
        style={{ background: "transparent" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:px-8">

          {/* JUDUL KUMPULAN AGENDA DENGAN BLOK HIJAU */}
          <div
            style={{
              background: "#063b00",
              borderBottom: "4px solid #e2eb24",
              borderRadius: "14px",
              padding: "18px 24px",
              marginTop: "28px",
              marginBottom: "24px",
              boxShadow: "0 8px 20px rgba(2, 35, 0, 0.12)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                margin: 0,
                paddingLeft: "14px",
                borderLeft: "4px solid #e2eb24",
                color: "#ffffff",
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "0.2px",
              }}
            >
              Kumpulan Agenda Sekolah
            </h2>
          </div>

          {/* KARTU AGENDA */}
          {daftarAgendaSekolah.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agendaHalaman.map((agenda) => (
                <KartuAgenda
                  key={agenda.id}
                  agenda={agenda}
                  onBuka={setAgendaTerpilih}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "44px 24px",
                border: "1px dashed rgba(47, 107, 25, 0.35)",
                borderRadius: "16px",
                background: "#ffffff",
                color: "#5c6d63",
                textAlign: "center",
                fontSize: "14px",
                boxShadow: "0 4px 12px rgba(2, 35, 0, 0.04)",
              }}
            >
              Belum ada agenda sekolah yang tersedia.
            </div>
          )}

          {/* PAGINATION */}
          <div
            style={{
              marginTop: "32px",
              padding: "14px 18px",
              background: "#ffffff",
              border: "1px solid rgba(47, 107, 25, 0.22)",
              borderRadius: "14px",
              boxShadow: "0 4px 12px rgba(2, 35, 0, 0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <span
              style={{
                color: "#3c4f42",
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Halaman {halamanAktif} dari {totalHalaman} (
              {daftarAgendaSekolah.length} agenda)
            </span>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "6px",
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

              {Array.from({ length: totalHalaman }, (_, index) => index + 1).map(
                (nomor) => (
                  <button
                    key={nomor}
                    type="button"
                    onClick={() => ubahHalaman(nomor)}
                    style={paginationButton(false, halamanAktif === nomor)}
                    aria-label={`Halaman ${nomor}`}
                    aria-current={halamanAktif === nomor ? "page" : undefined}
                  >
                    {nomor}
                  </button>
                )
              )}

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
        </div>
      </section>

      {/* MODAL RINCIAN AGENDA */}
      {agendaTerpilih && (
        <AgendaDetailModal
          agenda={agendaTerpilih}
          onTutup={() => setAgendaTerpilih(null)}
        />
      )}
    </main>
  );
}