import { useEffect } from "react";
import ModalDialog from "@/components/ui/ModalDialog";
import Icon from "@/components/ui/Icon";

function BarisInfo({ ikon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon
        name={ikon}
        className="mt-0.5 shrink-0 text-[20px] text-secondary"
      />
      <div>
        <p className="font-bold text-primary">{label}</p>
        <p>{children}</p>
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
    <ModalDialog
      judul="Rincian Agenda"
      onTutup={onTutup}
      lebar="max-w-2xl"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-[76px] w-[76px] shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-white">
          <span className="text-3xl font-bold leading-none">
            {agenda.tanggal}
          </span>
          <span className="mt-1 text-[10px] font-semibold tracking-wide">
            {agenda.bulan}
          </span>
        </div>

        <div className="min-w-0">
          <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-secondary">
            {agenda.kategori}
          </span>
          <p className="mt-2 text-sm font-bold text-secondary">
            {agenda.hari}
          </p>
          <h3 className="mt-1 text-xl font-bold leading-tight text-primary">
            {agenda.judul}
          </h3>
        </div>
      </div>

      {agenda.deskripsi && (
        <p className="mt-5 text-sm leading-6 text-text-muted">
          {agenda.deskripsi}
        </p>
      )}

      <div className="mt-6 space-y-4 border-t border-border-muted pt-5 text-sm text-text-muted">
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
    </ModalDialog>
  );
}