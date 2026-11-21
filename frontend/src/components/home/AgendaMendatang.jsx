/** @format */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin } from "lucide-react";
import AgendaDetailModal from "@/components/agenda/AgendaDetailModal";
import { agendaSekolah } from "@/data/agenda";
import { useDaftarAgenda } from "@/hooks/useAgenda";

const FONT_HALAMAN = '"Times New Roman", Times, serif';

const gayaAgendaMendatang = `
  .am-agenda-card {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border: 1px solid rgba(47, 107, 25, 0.24);
    border-radius: 16px;
    box-shadow: 0 4px 14px rgba(2, 35, 0, 0.06);
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }

  .am-agenda-card::before {
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

  .am-agenda-card:hover {
    transform: translateY(-6px);
    border-color: rgba(47, 107, 25, 0.48);
    box-shadow: 0 14px 28px rgba(2, 35, 0, 0.14), 0 5px 10px rgba(2, 35, 0, 0.08);
  }

  .am-agenda-card:hover::before {
    transform: scaleX(1);
  }
`;

function normalisasiAgenda(item, index) {
  const tMulai = item.tanggalMulai || item.tanggal_mulai || "";
  let hariTeks = item.hari || "-";
  let bulanTeks = item.bulan || "-";
  let tglTeks = item.tanggal || "-";

  if (tMulai) {
    const potongan = String(tMulai).slice(0, 10);
    const [thn, bln, tgl] = potongan.split("-").map(Number);
    if (thn && bln && tgl) {
      tglTeks = String(tgl).padStart(2, "0");
      const tanggalObj = new Date(thn, bln - 1, tgl);
      bulanTeks = tanggalObj
        .toLocaleDateString("id-ID", { month: "short" })
        .toUpperCase();
      hariTeks = tanggalObj.toLocaleDateString("id-ID", { weekday: "long" });
    }
  }

  return {
    ...item,
    id: item.id ?? index,
    tanggal: tglTeks !== "-" ? tglTeks : item.tanggal || "-",
    bulan: bulanTeks !== "-" ? bulanTeks : item.bulan || "-",
    hari: hariTeks !== "-" ? hariTeks : item.hari || "-",
    kategori: item.kategori || "Agenda Sekolah",
    judul: item.judul || item.title || "",
    deskripsi: item.deskripsi || item.description || "",
    lokasi: item.lokasi || "SMA Harapan Jaya",
    waktu: item.waktu || "Waktu belum ditentukan",
  };
}

export default function AgendaMendatang() {
  const [agendaTerpilih, setAgendaTerpilih] = useState(null);
  const { data: daftarAgendaApi = [] } = useDaftarAgenda();

  const daftarAgenda = useMemo(() => {
    const sumber =
      Array.isArray(daftarAgendaApi) && daftarAgendaApi.length > 0
        ? daftarAgendaApi
        : Array.isArray(agendaSekolah)
          ? agendaSekolah
          : [];

    return sumber.slice(0, 3).map((item, idx) => normalisasiAgenda(item, idx));
  }, [daftarAgendaApi]);

  return (
    <section
      style={{ fontFamily: FONT_HALAMAN }}
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <style>{gayaAgendaMendatang}</style>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(47, 107, 25, 0.22)",
          borderRadius: "18px",
          padding: "24px 28px",
          boxShadow: "0 6px 20px rgba(2, 35, 0, 0.05)",
        }}
      >
        <div className="flex flex-col justify-between gap-4 border-b border-[#2f6b19]/15 pb-5 sm:flex-row sm:items-center">
          <div>
            <p
              style={{ color: "#2f6b19" }}
              className="font-sans text-[11px] font-bold uppercase tracking-[0.16em]"
            >
              JADWAL SEKOLAH
            </p>
            <h2
              style={{ color: "#022300" }}
              className="mt-1 text-2xl font-bold sm:text-3xl"
            >
              Agenda & Kalender Akademik
            </h2>
            <div className="mt-2.5 flex items-center gap-1.5">
              <span
                style={{ background: "#2f6b19" }}
                className="inline-block h-1 w-12 rounded-full"
              />
              <span
                style={{ background: "#E1E100" }}
                className="inline-block h-1 w-4 rounded-full"
              />
            </div>
          </div>

          <Link
            to="/agenda"
            style={{
              background: "#063b00",
              color: "#e2eb24",
              border: "1px solid rgba(226, 235, 36, 0.5)",
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-sans text-xs font-bold shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-[#2f6b19]"
          >
            <span>Buka Kalender Lengkap</span>
            <Calendar size={15} />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {daftarAgenda.map((agenda) => (
            <div
              key={agenda.id}
              role="button"
              tabIndex={0}
              onClick={() => setAgendaTerpilih(agenda)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setAgendaTerpilih(agenda);
                }
              }}
              className="am-agenda-card flex h-full flex-col justify-between p-5"
            >
              <div className="flex items-start gap-3.5">
                <div
                  style={{
                    background:
                      "linear-gradient(155deg, #022300 0%, #063b00 60%, #2f6b19 100%)",
                    border: "1.5px solid rgba(226, 235, 36, 0.55)",
                    boxShadow: "0 6px 14px rgba(2, 35, 0, 0.16)",
                  }}
                  className="flex h-[58px] w-[54px] shrink-0 flex-col items-center justify-center rounded-xl text-white"
                >
                  <span
                    style={{ color: "#e2eb24" }}
                    className="text-[10px] font-bold uppercase tracking-wider leading-none"
                  >
                    {agenda.bulan}
                  </span>
                  <span className="mt-1 text-xl font-bold leading-none text-white">
                    {agenda.tanggal}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <span
                    style={{
                      background: "#dcf5d4",
                      color: "#063b00",
                      border: "1px solid rgba(47, 107, 25, 0.24)",
                    }}
                    className="inline-block rounded-full px-2.5 py-0.5 font-sans text-[11px] font-bold"
                  >
                    {agenda.kategori}
                  </span>

                  <h3
                    style={{ color: "#022300" }}
                    className="mt-2 text-base font-bold leading-snug"
                  >
                    {agenda.judul}
                  </h3>
                </div>
              </div>

              <div
                style={{ borderColor: "rgba(47, 107, 25, 0.14)" }}
                className="mt-4 space-y-1.5 border-t pt-3.5 font-sans text-xs text-[#4b5e50]"
              >
                <p className="flex items-center gap-2">
                  <Clock size={14} className="shrink-0 text-[#2f6b19]" />
                  <span>{agenda.waktu}</span>
                </p>

                <p className="flex items-center gap-2">
                  <MapPin size={14} className="shrink-0 text-[#2f6b19]" />
                  <span className="truncate">{agenda.lokasi}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {agendaTerpilih && (
        <AgendaDetailModal
          agenda={agendaTerpilih}
          onTutup={() => setAgendaTerpilih(null)}
        />
      )}
    </section>
  );
}