
import { useEffect, useState } from "react";
import { FileText, Download, RefreshCw } from "lucide-react";
import ModalDialog from "@/components/ui/ModalDialog";
import {
  ambilDokumenPublik,
  urlUnduhDokumen,
} from "@/services/dokumenService";

function formatUkuran(bytes) {
  if (!bytes || bytes <= 0) return "Ukuran tidak diketahui";

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ModalDokumen({ onTutup }) {
  const [dokumen, setDokumen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function muatDokumen() {
    try {
      setLoading(true);
      setError("");

      const data = await ambilDokumenPublik();
      setDokumen(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Gagal mengambil daftar dokumen.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    muatDokumen();
  }, []);

  return (
    <ModalDialog
      judul="Pusat Unduhan Dokumen"
      onTutup={onTutup}
      lebar="max-w-3xl"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-text-muted">
            Silakan pilih dokumen sekolah yang ingin Anda unduh.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <RefreshCw className="mb-3 animate-spin" size={28} />
            <p className="text-sm">Memuat daftar dokumen...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="mb-3 text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={muatDokumen}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && dokumen.length === 0 && (
          <div className="rounded-xl border border-border-muted bg-surface-light px-5 py-10 text-center">
            <FileText
              size={36}
              className="mx-auto mb-3 text-text-muted"
            />
            <p className="font-semibold text-primary">
              Belum ada dokumen tersedia
            </p>
            <p className="mt-1 text-sm text-text-muted">
              Dokumen yang telah dipublikasikan sekolah akan muncul di sini.
            </p>
          </div>
        )}

        {!loading && !error && dokumen.length > 0 && (
          <div className="space-y-3">
            {dokumen.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-border-muted p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-700">
                    <FileText size={22} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-primary">
                      {item.nama_dokumen}
                    </h3>

                    {item.kategori && (
                      <p className="mt-1 text-xs font-medium text-green-700">
                        {item.kategori}
                      </p>
                    )}

                    {item.deskripsi && (
                      <p className="mt-1 whitespace-pre-line text-sm text-text-muted">
                        {item.deskripsi}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-text-muted">
                      {item.tipe_file || "File"}{" "}
                      <span className="mx-1">•</span>
                      {formatUkuran(item.ukuran_bytes)}
                    </p>
                  </div>
                </div>

                <a
                  href={urlUnduhDokumen(item.id)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white no-underline transition hover:bg-green-800"
                >
                  <Download size={16} />
                  Unduh
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
