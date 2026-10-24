import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import { KATEGORI_AGENDA, PERIODE_AKADEMIK } from '@/config/agenda'

const fieldCls =
  'w-full rounded-xl border border-border-muted bg-surface-white px-4 py-2.5 text-body-md text-primary focus:border-secondary focus:ring-secondary'

function Kolom({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      {children}
    </div>
  )
}

// Filter disimpan sebagai draf dulu; baru dipakai saat "Terapkan Filter" ditekan (atau Enter).
// `nilai` = { kategori, status, periode, kata } — status tidak punya kolom di UI, tetap dibawa apa adanya.
export default function AgendaFilters({ nilai, onTerapkan }) {
  const [draft, setDraft] = useState(nilai)
  const ubah = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onTerapkan(draft)
      }}
      className="space-y-5"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_2fr_1.3fr]">
        <Kolom id="f-kategori" label="Kategori Agenda">
          <select id="f-kategori" value={draft.kategori} onChange={ubah('kategori')} className={fieldCls}>
            <option value="">Semua Kategori</option>
            {KATEGORI_AGENDA.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </Kolom>

        <Kolom id="f-periode" label="Periode Akademik">
          <select id="f-periode" value={draft.periode} onChange={ubah('periode')} className={fieldCls}>
            {PERIODE_AKADEMIK.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Kolom>

        <Kolom id="f-kata" label="Cari Nama Kegiatan">
          <div className="relative">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              id="f-kata"
              type="search"
              value={draft.kata}
              onChange={ubah('kata')}
              placeholder="Ketik kata kunci agenda..."
              className={`${fieldCls} pl-10`}
            />
          </div>
        </Kolom>
      </div>

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-white transition-colors hover:bg-primary-container"
      >
        <Icon name="filter_list" /> Terapkan Filter
      </button>
    </form>
  )
}
