import { useRef } from 'react'
import Icon from '@/components/ui/Icon'

// Satu aset visual (logo / favicon): pratinjau, nama berkas, keterangan, tombol ganti.
export default function KartuAset({ pratinjau, nama, keterangan, labelTombol, ikonTombol, accept, onPilih }) {
  const input = useRef(null)

  function pilih(e) {
    const file = e.target.files?.[0]
    if (file) onPilih(file)
    e.target.value = ''
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border-muted bg-surface-white p-4">
      {pratinjau}
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-primary">{nama}</p>
        <p className="text-xs text-text-muted">{keterangan}</p>
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-secondary hover:underline"
        >
          <Icon name={ikonTombol} className="text-[14px]" />
          {labelTombol}
        </button>
        <input ref={input} type="file" accept={accept} onChange={pilih} tabIndex={-1} aria-hidden="true" className="sr-only" />
      </div>
    </div>
  )
}
