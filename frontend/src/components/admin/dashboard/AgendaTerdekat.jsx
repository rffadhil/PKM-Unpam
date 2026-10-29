/** @format */

import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";

const bulan = (iso) => {
  if (!iso) return "-";
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d)
    ? "-"
    : new Intl.DateTimeFormat("id-ID", { month: "short" })
        .format(d)
        .toUpperCase();
};

const hari = (iso) => {
  if (!iso) return "-";
  const d = new Date(`${iso}T00:00:00`);
  return isNaN(d) ? "-" : d.getDate();
};

// Tiga agenda terdekat + tautan ke halaman Agenda. items: lihat mocks/dashboardOverview.js
export default function AgendaTerdekat({ items = [] }) {
  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border-muted pb-4">
        <h2 className="flex items-center gap-2.5 text-title-md font-bold text-primary-container">
          <Icon name="event" className="text-[24px] text-secondary" />
          Agenda Kampus Terdekat
        </h2>
        <span className="shrink-0 rounded-full bg-secondary-container/50 px-3 py-1 text-[12px] font-bold text-secondary-dark">
          {items.length} Acara
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {items?.map((a) => (
          <li
            key={a.id}
            className="flex gap-3 rounded-xl border border-border-muted bg-surface-light p-3"
          >
            <div className="flex h-[58px] w-12 shrink-0 flex-col overflow-hidden rounded-lg text-center">
              <span className="bg-secondary-container py-0.5 text-[10px] font-bold text-secondary-dark">
                {bulan(a.tanggal)}
              </span>
              <span className="flex flex-1 items-center justify-center bg-primary-container text-title-md font-bold text-surface-white">
                {String(hari(a.tanggal)).padStart(2, "0")}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-body-md font-bold leading-snug text-on-surface">
                {a.judul}
              </h3>
              <p className="mt-1 flex items-start gap-1.5 text-body-sm text-text-muted">
                <Icon name={a.ikon} className="mt-0.5 shrink-0 text-[18px]" />
                {a.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Link
        to="/admin/agenda"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border-muted py-2.5 font-semibold text-secondary hover:bg-surface-light"
      >
        Kelola Semua Agenda{" "}
        <Icon name="arrow_forward" className="text-[20px]" />
      </Link>
    </section>
  );
}
