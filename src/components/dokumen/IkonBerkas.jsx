import Icon from '@/components/ui/Icon'
import { FORMAT_DOKUMEN } from '@/config/dokumenAdmin'

// Kotak ikon sesuai format berkas (PDF merah, DOCX biru, XLSX hijau).
export default function IkonBerkas({ tipe, className = 'h-12 w-12' }) {
  const f = FORMAT_DOKUMEN[tipe] ?? FORMAT_DOKUMEN.pdf
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center rounded-xl border ${f.tone} ${className}`}>
      <Icon name={f.ikon} className="text-[26px]" />
    </span>
  )
}
