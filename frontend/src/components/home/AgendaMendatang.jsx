import { useMemo } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import Icon from "@/components/ui/Icon";
import SectionHeading from "@/components/ui/SectionHeading";
import { useDaftarAgenda } from "@/hooks/useAgenda";
import { pilihAgendaMendatang } from "@/utils/agenda";

// Warna label kategori.
const TONE_LABEL = {
  mint: "bg-secondary-container text-on-secondary-container",
  surface: "bg-primary-container/10 text-primary",
  gold: "bg-cta-gold/35 text-primary",
};

function formatTanggal(value) {
  if (!value) return null;

  const tanggal = String(value).slice(0, 10);
  const [tahun, bulan, hari] = tanggal.split("-").map(Number);

  if (!tahun || !bulan || !hari) return null;

  return {
    tanggal,
    hari: String(hari).padStart(2, "0"),
    bulan: new Date(tahun, bulan - 1, hari).toLocaleDateString("id-ID", {
      month: "short",
    }),
  };
}

function tentukanTone(kategori = "") {
  const teks = (kategori || "").toLowerCase();

  if (teks.includes("ujian") || teks.includes("akademik")) return "gold";
  if (teks.includes("kesiswaan") || teks.includes("ekskul")) return "surface";
  return "mint";
}

// Kartu agenda sesuai desain: kotak tanggal, label kategori, judul, waktu, lokasi.
export default function AgendaMendatang({ items }) {
  const { data = [], isLoading, isError, error } = useDaftarAgenda();

  const agendaMendatang = useMemo(() => {
    if (Array.isArray(items) && items.length > 0) {
      return items.slice(0, 3);
    }
    return pilihAgendaMendatang(data, 3);
  }, [items, data]);

  const memuat = !items && isLoading;
  const galat = !items && isError;

  return (
    <section
      id="agenda"
      className="py-14 md:py-20 bg-surface-white scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Pembatas bagian berbingkai lembut + aksen garis hijau-emas */}
        <div className="rounded-2xl border border-secondary/25 bg-surface-light/80 p-6 md:p-10 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b-2 border-secondary/20 gap-4">
            <div>
              <SectionHeading
                eyebrow="Jadwal Sekolah"
                title="Agenda & Kalender Akademik"
              />
              <div className="mt-3 flex items-center gap-1.5">
                <span className="h-1 w-14 rounded-full bg-secondary" />
                <span className="h-1 w-4 rounded-full bg-cta-gold" />
              </div>
            </div>

            <Link
              to="/agenda"
              className="px-4 py-2.5 rounded-lg bg-primary-container text-surface-white font-semibold text-label-lg hover:bg-secondary transition-colors inline-flex items-center gap-2 self-start sm:self-auto shadow-sm"
            >
              <span>Buka Kalender Lengkap</span>
              <Icon name="calendar_add_on" className="text-[18px] text-cta-gold" />
            </Link>
          </div>

          {memuat && (
            <p className="rounded-xl border border-border-muted bg-surface-white p-6 text-text-muted">
              Memuat agenda sekolah...
            </p>
          )}

          {galat && (
            <p
              role="alert"
              className="rounded-xl border border-error/30 bg-error/5 p-6 text-error"
            >
              Gagal memuat agenda: {error?.message}
            </p>
          )}

          {!memuat && !galat && agendaMendatang.length === 0 && (
            <p className="rounded-xl border border-dashed border-secondary/30 bg-surface-white p-8 text-center text-text-muted">
              Belum ada agenda mendatang yang dipublikasikan.
            </p>
          )}

          {!memuat && !galat && agendaMendatang.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agendaMendatang.map((agenda) => {
                const tMulai = agenda.tanggalMulai || agenda.tanggal_mulai;
                const tanggal = formatTanggal(tMulai);
                const labelBulan = tanggal?.bulan || agenda.bulan || "-";
                const labelHari = tanggal?.hari || agenda.tanggal || "-";
                const tone = agenda.tone || tentukanTone(agenda.kategori);

                return (
                  <div
                    key={agenda.id}
                    className="bg-surface-white rounded-xl border border-secondary/20 p-6 shadow-sm hover:shadow-md hover:border-secondary transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 text-center bg-primary-container rounded-lg overflow-hidden w-16 border border-primary/20 shadow-xs">
                        <div className="bg-secondary text-surface-white text-[11px] font-bold py-1 uppercase tracking-wider">
                          {labelBulan}
                        </div>
                        <div className="font-headline-md font-bold text-cta-gold py-2 text-2xl">
                          {labelHari}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <span
                          className={clsx(
                            "inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2",
                            TONE_LABEL[tone] || TONE_LABEL.mint,
                          )}
                        >
                          {agenda.kategori || "Agenda Sekolah"}
                        </span>
                        <h4 className="font-headline-sm text-title-md font-bold text-primary">
                          {agenda.judul}
                        </h4>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border-muted space-y-2 text-body-sm font-body-sm text-text-muted">
                      <div className="flex items-center gap-2">
                        <Icon
                          name="schedule"
                          className="text-[18px] text-secondary"
                        />
                        <span>{agenda.waktu || "Waktu belum ditentukan"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          name="location_on"
                          className="text-[18px] text-secondary"
                        />
                        <span>{agenda.lokasi || "Lokasi belum ditentukan"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}