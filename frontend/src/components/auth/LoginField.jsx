import { useId } from 'react'
import Icon from '@/components/ui/Icon'

// Kolom input login: label + ikon kiri + slot aksi kanan (ikon validasi / tombol tampilkan).
export default function LoginField({ label, ikon, aksi, ...input }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-title-md font-semibold text-primary-container">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-xl border border-border-muted bg-surface-white px-4 shadow-sm focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20">
        <Icon name={ikon} className="text-[22px] text-text-muted" />
        <input
          id={id}
          {...input}
          className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-body-lg text-on-surface placeholder:text-text-muted/60 focus:ring-0"
        />
        {aksi}
      </div>
    </div>
  )
}
