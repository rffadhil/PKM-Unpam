/** @format */

import { useEffect } from "react";
import ModalDialog from "@/components/ui/ModalDialog";
import Icon from "@/components/ui/Icon";

const gayaVisualModalAgenda = `
  [role="dialog"],
  [aria-modal="true"] {
    position: relative !important;
    overflow: hidden !important;
    background: #ffffff !important;
    border: 1px solid rgba(47, 107, 25, 0.24) !important;
    border-radius: 18px !important;
    box-shadow: 0 22px 48px rgba(2, 35, 0, 0.22) !important;
  }

  [role="dialog"]::before,
  [aria-modal="true"]::before {
    content: "" !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    height: 4px !important;
    background: linear-gradient(90deg, #2f6b19 0%, #063b00 65%, #E1E100 100%) !important;
    z-index: 5 !important;
  }

  .adm-info-tile {
    background: #f5faf4;
    border: 1px solid rgba(47, 107, 25, 0.18);
    border-radius: 12px;
    padding: 12px 14px;
    transition: border-color 0.2s ease, transform 0.2s ease;
  }

  .adm-info-tile:hover {
    border-color: rgba(47, 107, 25, 0.42);
    transform: translateY(-2px);
  }
`;

function BarisInfo({ ikon, label, children }) {
  return (
    <div className="adm-info-tile flex items-start gap-3">
      <Icon
        name={ikon}
        className="mt-0.5 shrink-0 text-[20px] text-[#2f6b19]"
      />
      <div className="min-w-0">
        <p
          style={{ color: "#063b00" }}
          className="text-[11px] font-bold uppercase tracking-wider"
        >
          {label}
        </p>
        <p
          style={{ color: "#263b2c" }}
          className="mt-0.5 text-sm font-medium leading-snug"
        >
          {children}
        </p>
      </div>
    </div>
  );
}

export default function AgendaDetailModal({ agenda, onTutup }) {
  // Kunci scroll halaman saat modal terbuka
  useEffect(() => {
    const awal = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = awal;
    };
  }, []);

  if (!agenda) return null;

  return (
    <>
      <style>{gayaVisualModalAgenda}</style>

      <ModalDialog
        judul="Rincian Agenda"
        onTutup={onTutup}
        lebar="max-w-2xl"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            style={{
              background:
                "linear-gradient(155deg, #022300 0%, #063b00 60%, #2f6b19 100%)",
              border: "1.5px solid rgba(226, 235, 36, 0.58)",
              boxShadow: "0 8px 18px rgba(2, 35, 0, 0.16)",
            }}
            className="flex h-[82px] w-[82px] shrink-0 flex-col items-center justify-center rounded-2xl text-white"
          >
            <span className="text-3xl font-bold leading-none text-white">
              {agenda.tanggal}
            </span>
            <span
              style={{ color: "#e2eb24" }}
              className="mt-1.5 text-[10px] font-bold tracking-wider"
            >
              {agenda.bulan}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                style={{
                  background: "#e9f6e5",
                  color: "#063b00",
                  border: "1px solid rgba(47, 107, 25, 0.25)",
                }}
                className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide"
              >
                {agenda.kategori}
              </span>

              <span
                style={{ color: "#2f6b19" }}
                className="inline-flex items-center gap-1 text-xs font-bold"
              >
                <Icon name="event" className="text-[15px]" />
                <span>{agenda.hari}</span>
              </span>
            </div>

            <h3
              style={{ color: "#022300" }}
              className="mt-2 text-xl font-bold leading-snug sm:text-2xl"
            >
              {agenda.judul}
            </h3>
          </div>
        </div>

        {agenda.deskripsi && (
          <div
            style={{
              background: "#fafcfa",
              border: "1px solid rgba(47, 107, 25, 0.14)",
            }}
            className="mt-5 rounded-xl p-4"
          >
            <p
              style={{ color: "#4b5e50" }}
              className="text-sm leading-6"
            >
              {agenda.deskripsi}
            </p>
          </div>
        )}

        <div
          style={{ borderColor: "rgba(47, 107, 25, 0.16)" }}
          className="mt-6 border-t pt-5"
        >
          <div className="mb-3.5 flex items-center gap-2">
            <span
              style={{
                background: "#2f6b19",
                width: "4px",
                height: "18px",
                borderRadius: "999px",
              }}
            />
            <span
              style={{ color: "#063b00" }}
              className="text-xs font-bold uppercase tracking-wider"
            >
              Informasi Kegiatan
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <BarisInfo ikon="calendar_month" label="Tanggal">
              {agenda.tanggal} {agenda.bulan}
            </BarisInfo>
            <BarisInfo ikon="schedule" label="Waktu">
              {agenda.waktu}
            </BarisInfo>
            <BarisInfo ikon="location_on" label="Lokasi">
              {agenda.lokasi}
            </BarisInfo>
            <BarisInfo ikon="category" label="Kategori">
              {agenda.kategori}
            </BarisInfo>
          </div>
        </div>
      </ModalDialog>
    </>
  );
}