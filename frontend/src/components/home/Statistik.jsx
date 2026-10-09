import SectionHeading from '@/components/ui/SectionHeading'

// Data: belum ada tabelnya di ERD (statistik beranda, editable via CMS di PRD).
export default function Statistik({ items }) {
  return (
    <section className="py-16 bg-primary-container text-surface-container-lowest relative overflow-hidden">
      <div className="absolute inset-0 custom-pattern opacity-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-2xl mx-auto mb-12">
          <SectionHeading
            tone="dark"
            align="center"
            eyebrow="Capaian & Kapasitas"
            title="Data Statistik SMA Harapan Jaya"
          />
          <p className="text-center font-body-md text-surface-container-low mt-2">
            Mewujudkan transparansi mutu pendidikan yang terukur dan bereputasi nasional.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {items.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="text-4xl lg:text-5xl font-extrabold text-cta-gold font-headline-lg tracking-tight">
                {s.nilai}
              </div>
              <div className="mt-2 text-base font-bold text-surface-white">{s.label}</div>
              <p className="text-body-sm text-surface-container-low/80 mt-1">{s.keterangan}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
