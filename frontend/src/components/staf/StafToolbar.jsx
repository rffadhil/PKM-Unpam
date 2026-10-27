import Icon from '@/components/ui/Icon'
import StafFilter from '@/components/staf/StafFilter'

// Kartu atas: tombol tambah + filter.
export default function StafToolbar({ filter, onFilter, onReset, adaFilter, onTambah }) {
  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
      <button
        type="button"
        onClick={onTambah}
        className="inline-flex items-center gap-2 rounded-xl bg-cta-gold px-6 py-3 text-sm font-bold text-primary shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Icon name="person_add" className="text-[22px]" />
        Tambah Pendidik / Staf Baru
      </button>
      <div className="mt-5 border-t border-border-muted pt-5">
        <StafFilter nilai={filter} onUbah={onFilter} onReset={onReset} adaFilter={adaFilter} />
      </div>
    </section>
  )
}
