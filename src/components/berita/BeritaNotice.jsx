import Icon from '@/components/ui/Icon'

// Pemberitahuan sukses (setelah hapus / simpan dari halaman form).
export default function BeritaNotice({ teks, onTutup }) {
  return (
    <div
      role="status"
      className="flex items-start justify-between gap-3 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-body-sm"
    >
      <span className="flex items-start gap-2">
        <Icon name="check_circle" className="text-[18px] mt-px" />
        {teks}
      </span>
      <button type="button" aria-label="Tutup pemberitahuan" onClick={onTutup}>
        <Icon name="close" className="text-[18px]" />
      </button>
    </div>
  )
}
