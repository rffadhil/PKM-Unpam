/** @format */

import BagianPengaturan from "./BagianPengaturan";
import { inisialAdmin } from "@/utils/pengaturan";

// Panel informasi sesi aktif untuk Admin biasa (tanpa keterangan IP & mendukung foto profil).
export default function SesiAdminPanel({ sesi }) {
  return (
    <BagianPengaturan
      ikon="shield"
      judul="Manajemen Admin & Sesi Aktif"
      deskripsi="Proteksi integritas sesi, timeout otomatis, dan kebijakan masa berlaku kata sandi"
    >
      <div className="rounded-xl border border-border-muted bg-surface-light/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Sesi Administrator
          </span>
          {sesi.aktif && (
            <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-[10px] font-bold uppercase text-on-secondary-fixed-variant">
              Aktif
            </span>
          )}
        </div>

        <div className="flex items-center gap-3.5">
          {sesi.foto ? (
            <img
              src={sesi.foto}
              alt={`Foto ${sesi.nama}`}
              className="h-12 w-12 shrink-0 rounded-full border border-border-muted object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-cta-gold"
            >
              {inisialAdmin(sesi.nama)}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-bold text-primary">{sesi.nama}</p>
            <p className="text-xs text-text-muted">Peran: {sesi.peran}</p>
          </div>
        </div>
      </div>
    </BagianPengaturan>
  );
}
