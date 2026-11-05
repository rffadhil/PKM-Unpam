import Icon from '@/components/ui/Icon'

// Kartu angka ringkas di atas tabel.
export default function StatCard({ label, nilai, nilaiClass = 'text-primary', info, infoIkon, infoClass = 'text-text-muted', ikon, ikonClass }) {
  return (
    <div className="bg-surface-white p-4 rounded-xl border border-border-muted shadow-sm flex items-center justify-between">
      <div>
        <p className="font-label-sm text-text-muted uppercase tracking-wider text-[11px]">{label}</p>
        <p className={`font-headline-lg text-headline-lg font-bold mt-1 ${nilaiClass}`}>{nilai}</p>
        <span className={`text-[12px] font-medium flex items-center gap-1 mt-0.5 ${infoClass}`}>
          {infoIkon && <Icon name={infoIkon} className="text-[14px]" />}
          {info}
        </span>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ikonClass}`}>
        <Icon name={ikon} className="text-[26px]" />
      </div>
    </div>
  )
}
