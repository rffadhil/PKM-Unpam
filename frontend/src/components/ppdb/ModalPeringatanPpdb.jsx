import ModalDialog from "@/components/ui/ModalDialog";
import { Info } from "lucide-react";

export default function ModalPeringatanPpdb({ onTutup }) {
  return (
    <ModalDialog
      judul="Informasi Pendaftaran PPDB"
      onTutup={onTutup}
      lebar="max-w-md"
    >
      <div className="space-y-4 py-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Info size={32} />
        </div>
        <h3 className="text-lg font-bold text-primary">
          Pendaftaran Online Belum Dibuka
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          Mohon maaf, saat ini pendaftaran peserta didik baru (PPDB) online belum dibuka oleh pihak sekolah.
        </p>
        <div className="pt-3 flex justify-center">
          <button
            type="button"
            onClick={onTutup}
            className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-white hover:bg-secondary/90 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </ModalDialog>
  );
}

