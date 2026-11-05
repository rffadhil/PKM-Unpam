/** @format */

import Icon from "@/components/ui/Icon";
import { inisialAdmin } from "@/utils/pengaturan";
import PerananBadge from "./PerananBadge";
import StatusAdminBadge from "./StatusAdminBadge";

const tombol =
  "rounded-lg p-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary";

// Satu baris admin. `alasanTerkunci` (teks) menonaktifkan tombol hapus.
export default function AdminRow({
  admin,
  saya,
  alasanTerkunci,
  onEdit,
  onHapus,
}) {
  return (
    <tr className="align-middle hover:bg-surface-light/60">
      <td className="p-4">
        <div className="flex items-center gap-3">
          {admin.foto ? (
            <img
              src={admin.foto}
              alt={`Foto ${admin.nama}`}
              className="h-10 w-10 shrink-0 rounded-full border border-border-muted object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                admin.role === "superadmin"
                  ? "bg-primary-container text-cta-gold"
                  : "bg-surface-container-high text-primary"
              }`}
            >
              {inisialAdmin(admin.nama)}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-bold leading-snug text-primary">
              {admin.nama}
              {saya && (
                <span className="ml-2 rounded bg-surface-container px-1.5 py-0.5 text-[10px] font-bold uppercase text-text-muted">
                  Anda
                </span>
              )}
            </p>
            <p className="font-mono text-[11px] text-text-muted">
              {admin.tipeNomor}. {admin.nomor}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4 text-body-sm text-on-surface">{admin.email}</td>
      <td className="p-4">
        <PerananBadge role={admin.role} />
      </td>
      <td className="p-4">
        <StatusAdminBadge aktif={Boolean(admin.aktif)} />
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-0.5">
          <button
            type="button"
            onClick={() => onEdit(admin)}
            aria-label={`Edit ${admin.nama}`}
            className={`${tombol} text-text-muted hover:bg-secondary-container/50 hover:text-secondary`}
          >
            <Icon name="edit" className="text-[20px]" />
          </button>
          <button
            type="button"
            onClick={() => onHapus(admin)}
            disabled={Boolean(alasanTerkunci)}
            title={alasanTerkunci || undefined}
            aria-label={
              alasanTerkunci
                ? `Hapus ${admin.nama} (tidak tersedia: ${alasanTerkunci})`
                : `Hapus ${admin.nama}`
            }
            className={`${tombol} text-text-muted hover:bg-error-container hover:text-error disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text-muted`}
          >
            <Icon name="delete" className="text-[20px]" />
          </button>
        </div>
      </td>
    </tr>
  );
}
