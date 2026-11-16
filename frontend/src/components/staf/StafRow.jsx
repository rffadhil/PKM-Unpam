/** @format */

import Icon from "@/components/ui/Icon";
import StafFoto from "@/components/staf/StafFoto";
import JabatanBadge from "@/components/staf/JabatanBadge";
import StatusPegawaiBadge from "@/components/staf/StatusPegawaiBadge";
import SwitchPublik from "@/components/staf/SwitchPublik";
import { labelNomor } from "@/utils/ptk";

// Satu baris PTK pada tabel.
export default function StafRow({
  staf,
  dipilih,
  onPilih,
  onTampil,
  onLihat,
  onEdit,
  onHapus,
}) {
  const infoRumpunMapel = [staf.rumpun, staf.bidang]
    .filter(Boolean)
    .join(" • ");

  return (
    <tr
      className={`align-middle transition-colors ${dipilih ? "bg-secondary-container/20" : "hover:bg-surface-light/60"}`}
    >
      <td className="w-12 p-4">
        <input
          type="checkbox"
          checked={dipilih}
          onChange={() => onPilih(staf.id)}
          aria-label={`Pilih ${staf.nama}`}
          className="h-4 w-4 rounded border-border-muted text-secondary focus:ring-secondary"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <StafFoto key={staf.foto} nama={staf.nama} src={staf.foto} />
          <div className="min-w-0">
            <p className="font-bold leading-snug text-primary">{staf.nama}</p>
            <p className="mt-0.5 font-mono text-[11px] text-text-muted">
              {labelNomor(staf)}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <JabatanBadge jabatan={staf.jabatan} tone={staf.tone} />
        <p className="mt-1.5 text-body-sm text-text-muted">
          {infoRumpunMapel || "-"}
        </p>
      </td>
      <td className="p-4 text-body-sm">
        <p className="font-semibold text-on-surface">
          {staf.pendidikan || "-"}
        </p>
        {staf.kampus && <p className="text-text-muted">{staf.kampus}</p>}
      </td>
      <td className="p-4">
        <StatusPegawaiBadge label={staf.statusKepegawaian || "-"} />
      </td>
      <td className="p-4">
        <div className="flex flex-col items-center gap-1">
          <SwitchPublik
            aktif={staf.tampil}
            onUbah={(nilai) => onTampil(staf.id, nilai)}
            label={`Tampilkan ${staf.nama} di situs publik`}
          />
          <span
            className={`text-[11px] font-semibold ${staf.tampil ? "text-secondary" : "text-text-muted"}`}
          >
            {staf.tampil ? "Aktif Publik" : "Disembunyikan"}
          </span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(staf)}
            title="Edit"
            aria-label={`Edit ${staf.nama}`}
            className="rounded-md p-1.5 text-secondary hover:bg-secondary/10 transition-colors"
          >
            <Icon name="edit" className="text-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => onHapus(staf)}
            title="Hapus"
            aria-label={`Hapus ${staf.nama}`}
            className="rounded-md p-1.5 text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Icon name="delete" className="text-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => onLihat(staf)}
            title="Lihat Detail"
            aria-label={`Lihat detail ${staf.nama}`}
            className="rounded-md p-1.5 text-text-muted hover:bg-surface-light hover:text-primary transition-colors"
          >
            <Icon name="visibility" className="text-[18px]" />
          </button>
        </div>
      </td>
    </tr>
  );
}
