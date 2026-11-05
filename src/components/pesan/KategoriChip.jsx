import Icon from '@/components/ui/Icon'
import { cariKategori } from '@/utils/tiket'

// Kartu kecil kategori layanan (ikon + nama, warna sesuai kategori).
export default function KategoriChip({ kunci }) {
  const k = cariKategori(kunci)
  return (
    <span className={`inline-flex w-40 items-start gap-2 rounded-lg border px-3 py-2 text-xs font-semibold leading-snug ${k.tone}`}>
      <Icon name={k.ikon} className={`mt-px text-[16px] ${k.ikonTone}`} />
      {k.label}
    </span>
  )
}
