import Icon from '@/components/ui/Icon'

// Satu kolom pada konfigurasi kontak: judul beranotasi ikon + isian di bawahnya.
export default function KolomKontak({ ikon, judul, children }) {
  return (
    <div className="space-y-4">
      <h3 className="flex items-start gap-2 text-sm font-bold uppercase leading-snug tracking-wide text-primary">
        <Icon name={ikon} className="text-[20px] text-secondary" />
        {judul}
      </h3>
      {children}
    </div>
  )
}
