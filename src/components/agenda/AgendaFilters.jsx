import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import { KATEGORI_AGENDA } from '@/config/agenda'

const fieldCls =
  'w-full rounded-xl border border-border-muted bg-surface-white px-4 py-2.5 text-body-md text-primary placeholder:text-text-muted/70 focus:border-secondary focus:ring-2 focus:ring-secondary/20'

function Kolom({ id, label, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      {children}
    </div>
  )
}

// Filter disimpan sebagai draf dulu; baru dipakai saat "Terapkan Filter" ditekan (atau Enter).
export default function AgendaFilters({
  nilai,
  onTerapkan,
  opsiKategori = KATEGORI_AGENDA,
}) {
  const [draft, setDraft] = useState({
    kategori: nilai?.kategori ?? '',
    kata: nilai?.kata ?? '',
  })

  // Sinkronkan draft jika nilai filter dari luar berubah
  useEffect(() => {
    setDraft({
      kategori: nilai?.kategori ?? '',
      kata: nilai?.kata ?? '',
    })
  }, [nilai?.kategori, nilai?.kata])

  const ubah = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }))

  const adaFilterAktif = Boolean(
    (draft.kategori && draft.kategori !== '') ||
    (draft.kata && draft.kata.trim() !== '') ||
    (nilai?.kategori && nilai.kategori !== '') ||
    (nilai?.kata && nilai.kata.trim() !== ''),
  )

  function handleReset() {
    const nilaiBersih = { ...nilai, kategori: '', kata: '' }
    setDraft({ kategori: '', kata: '' })
    onTerapkan(nilaiBersih)
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onTerapkan({ ...nilai, ...draft })
      }}
      className="flex flex-wrap items-end gap-4"
    >
      <Kolom id="f-kategori" label="Kategori Agenda" className="w-full sm:w-64">
        <select id="f-kategori" value={draft.kategori} onChange={ubah('kategori')} className={fieldCls}>
          <option value="">Semua Kategori</option>
          {opsiKategori.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </Kolom>

      <Kolom id="f-kata" label="Cari Nama Kegiatan" className="w-full sm:w-80">
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

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-bold text-white transition-colors hover:bg-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Icon name="filter_list" /> Terapkan Filter
        </button>

        {adaFilterAktif && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border-muted bg-surface-light px-4 py-2.5 font-bold text-text-muted transition-colors hover:bg-surface-white hover:text-primary"
          >
            <Icon name="restart_alt" /> Reset
          </button>
        )}
      </div>
    </form>
  )
}
