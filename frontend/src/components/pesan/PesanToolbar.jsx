
import Icon from '@/components/ui/Icon'
import {
  FILTER_TIKET_AWAL,
  KATEGORI_TIKET,
  STATUS_TIKET,
} from '@/config/pesanAdmin'

const kolom =
  'w-full rounded-xl border border-border-muted bg-surface-white py-2.5 pl-3 pr-9 text-sm text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20'

const tanggal =
  'min-w-0 border-0 bg-transparent p-0 text-sm text-on-surface focus:ring-0'

export default function PesanToolbar({ nilai, onUbah }) {
  const adaFilter = Boolean(
    nilai.kategori ||
    nilai.status ||
    nilai.dari ||
    nilai.sampai
  )

  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white px-6 py-5 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">

        {/* Filter kategori */}
        <div className="flex min-w-[210px] flex-col gap-1.5">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
            <Icon
              name="filter_alt"
              className="text-[18px] text-text-muted"
            />
            Filter:
          </span>

          <select
            value={nilai.kategori}
            onChange={(e) =>
              onUbah({
                ...nilai,
                kategori: e.target.value,
              })
            }
            aria-label="Filter kategori layanan"
            className={kolom}
          >
            <option value="">Semua Kategori Layanan</option>

            {KATEGORI_TIKET.map((k) => (
              <option key={k.kunci} value={k.kunci}>
                {k.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter status */}
        <div className="flex min-w-[190px] flex-col gap-1.5">
          <label
            htmlFor="filter-status"
            className="text-xs font-semibold text-text-muted"
          >
            Status Tiket
          </label>

          <select
            id="filter-status"
            value={nilai.status ?? ''}
            onChange={(e) =>
              onUbah({
                ...nilai,
                status: e.target.value,
              })
            }
            className={kolom}
          >
            <option value="">Semua Status</option>

            {Object.entries(STATUS_TIKET).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rentang tanggal */}
        <div className="flex min-w-[320px] flex-col gap-1.5">
          <span className="text-xs font-semibold text-text-muted">
            Rentang tanggal pesan masuk
          </span>

          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border-muted bg-surface-white px-3 py-2.5 text-sm">
            <Icon
              name="calendar_today"
              className="text-[18px] text-text-muted"
            />

            <label
              htmlFor="tanggal-dari"
              className="text-xs font-medium text-text-muted"
            >
              Dari
            </label>

            <input
              id="tanggal-dari"
              type="date"
              value={nilai.dari}
              max={nilai.sampai || undefined}
              onChange={(e) =>
                onUbah({
                  ...nilai,
                  dari: e.target.value,
                })
              }
              aria-label="Tanggal mulai pesan masuk"
              className={tanggal}
            />

            <span aria-hidden="true" className="text-text-muted">
              -
            </span>

            <label
              htmlFor="tanggal-sampai"
              className="text-xs font-medium text-text-muted"
            >
              Sampai
            </label>

            <input
              id="tanggal-sampai"
              type="date"
              value={nilai.sampai}
              min={nilai.dari || undefined}
              onChange={(e) =>
                onUbah({
                  ...nilai,
                  sampai: e.target.value,
                })
              }
              aria-label="Tanggal akhir pesan masuk"
              className={tanggal}
            />
          </div>
        </div>

        {/* Reset filter */}
        <button
          type="button"
          onClick={() => onUbah({ ...FILTER_TIKET_AWAL })}
          disabled={!adaFilter}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-surface-light hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon
            name="restart_alt"
            className="text-[18px]"
          />
          Reset Filter
        </button>
      </div>
    </section>
  )
}
