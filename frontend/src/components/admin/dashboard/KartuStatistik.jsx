import Icon from '@/components/ui/Icon'

// Kartu ringkasan Overview: label + ikon di atas, angka besar, lalu keterangan (children).
export default function KartuStatistik({ label, ikon, ikonClass, nilai, satuan, nilaiClass = 'text-primary', children }) {
  return (
    <div className="bg-surface-white border border-border-muted rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="text-xs font-label-lg text-text-muted">{label}</span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${ikonClass}`}>
          <Icon name={ikon} className="text-xl" />
        </div>
      </div>
      <div>
        <div className={`font-headline-lg text-3xl font-bold tracking-tight ${nilaiClass}`}>
          {nilai}
          {satuan && <span className="text-sm font-normal text-text-muted"> {satuan}</span>}
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}
