
import { Link, useParams } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import { agendaSekolah } from "@/data/agenda";

export default function AgendaDetailPage() {
  const { id } = useParams();

  const agenda = agendaSekolah.find(
    (item) => item.id === Number(id)
  );

  if (!agenda) {
    return (
      <main
        className="min-h-screen bg-white"
        style={{
          fontFamily: '"Times New Roman", Times, serif',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <h1 className="text-3xl font-bold text-primary">
            Agenda Tidak Ditemukan
          </h1>

          <p className="mt-3 text-sm text-text-muted">
            Data agenda yang dipilih tidak ditemukan.
          </p>

          <Link
            to="/agenda"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white hover:bg-secondary"
          >
            <Icon name="arrow_back" className="text-[17px]" />
            Kembali ke Agenda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      {/* HEADER RINCIAN */}
      <section className="border-b border-border-muted bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-xs text-text-muted"
          >
            <Link to="/" className="hover:text-secondary">
              Beranda
            </Link>

            <Icon name="chevron_right" className="text-[15px]" />

            <Link to="/agenda" className="hover:text-secondary">
              Agenda Sekolah
            </Link>

            <Icon name="chevron_right" className="text-[15px]" />

            <span>Rincian Agenda</span>
          </nav>

          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-secondary">
              <Icon name="calendar_month" className="text-[15px]" />
              {agenda.kategori}
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-primary sm:text-4xl">
              {agenda.judul}
            </h1>

            <p className="mt-4 text-sm leading-6 text-text-muted sm:text-base">
              Rincian kegiatan sekolah SMA Harapan Jaya.
            </p>
          </div>
        </div>
      </section>

      {/* ISI RINCIAN */}
      <section className="bg-surface-light">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-8">
          <div className="max-w-4xl rounded-xl border border-border-muted bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex h-[90px] w-[90px] shrink-0 flex-col items-center justify-center rounded-xl bg-primary text-white">
                <span className="text-3xl font-bold leading-none">
                  {agenda.tanggal}
                </span>

                <span className="mt-1 text-[10px] font-semibold tracking-wide">
                  {agenda.bulan}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-secondary">
                  {agenda.hari}
                </p>

                <h2 className="mt-2 text-2xl font-bold leading-tight text-primary">
                  {agenda.judul}
                </h2>
              </div>
            </div>

            <div className="mt-8 border-t border-border-muted pt-6">
              <h3 className="text-xl font-bold text-primary">
                Rincian Kegiatan
              </h3>

              <div className="mt-5 space-y-4 text-sm text-text-muted">
                <div className="flex items-start gap-3">
                  <Icon
                    name="calendar_month"
                    className="mt-0.5 shrink-0 text-[20px] text-secondary"
                  />

                  <div>
                    <p className="font-bold text-primary">
                      Tanggal
                    </p>

                    <p>
                      {agenda.tanggal} {agenda.bulan}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon
                    name="schedule"
                    className="mt-0.5 shrink-0 text-[20px] text-secondary"
                  />

                  <div>
                    <p className="font-bold text-primary">
                      Waktu
                    </p>

                    <p>{agenda.waktu}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon
                    name="location_on"
                    className="mt-0.5 shrink-0 text-[20px] text-secondary"
                  />

                  <div>
                    <p className="font-bold text-primary">
                      Lokasi
                    </p>

                    <p>{agenda.lokasi}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Icon
                    name="category"
                    className="mt-0.5 shrink-0 text-[20px] text-secondary"
                  />

                  <div>
                    <p className="font-bold text-primary">
                      Kategori
                    </p>

                    <p>{agenda.kategori}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-border-muted pt-6">
              <Link
                to="/agenda"
                className="inline-flex items-center gap-2 rounded-lg border border-secondary px-4 py-3 text-sm font-bold text-secondary hover:bg-secondary/10"
              >
                <Icon name="arrow_back" className="text-[17px]" />
                Kembali ke Agenda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
