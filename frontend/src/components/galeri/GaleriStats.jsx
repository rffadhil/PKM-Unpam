import Icon from '@/components/ui/Icon'
import { formatAngka } from '@/utils/galeri'

// 4 kartu ringkasan atas halaman Galeri.
export default function GaleriStats({ totalAlbum, totalFoto, storage, jumlahKiriman }) {
  const persen = ((storage.terpakaiGB / storage.totalGB) * 100).toFixed(1)
  const kartu = [
    { label: 'Total Album Publik', nilai: totalAlbum, satuan: 'Album', ikon: 'photo_library', box: 'bg-secondary-container/50 text-secondary', cap: '100% Terverifikasi Akreditasi', capIkon: 'verified', capClass: 'text-secondary' },
    { label: 'Total Foto Tersimpan', nilai: formatAngka(totalFoto), satuan: 'Foto', ikon: 'image', box: 'bg-surface-container text-primary-container', cap: 'HD Optimized & WebP Format', capIkon: 'auto_awesome', capClass: 'text-secondary' },
    { label: 'Kapasitas CDN Cloud', nilai: `${storage.terpakaiGB} GB`, satuan: `/ ${storage.totalGB} GB`, ikon: 'cloud_done', box: 'bg-emerald-50 text-secondary', cap: `${persen}% Terpakai (Status Aman)`, capIkon: 'check_circle', capClass: 'text-secondary' },
    { label: 'Kiriman Siswa/Guru', nilai: jumlahKiriman, satuan: 'Draft', ikon: 'drive_folder_upload', box: 'bg-red-50 text-error', cap: 'Menunggu Kurasi Staf IT', capIkon: 'pending_actions', capClass: 'text-error', nilaiClass: 'text-error' },
  ]

  return (
    <section aria-label="Ringkasan galeri" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kartu.map((k) => (
        <div key={k.label} className="flex items-start justify-between gap-3 rounded-2xl border border-border-muted bg-surface-white p-5 shadow-sm">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{k.label}</p>
            <p className={`mt-2 font-headline-lg text-headline-lg-mobile ${k.nilaiClass ?? 'text-primary'}`}>
              {k.nilai} <span className="font-body-md text-body-md font-normal text-text-muted">{k.satuan}</span>
            </p>
            <p className={`mt-2 flex items-center gap-1.5 text-sm font-medium ${k.capClass}`}>
              <Icon name={k.capIkon} className="text-[18px]" /> {k.cap}
            </p>
          </div>
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${k.box}`}>
            <Icon name={k.ikon} className="text-[24px]" />
          </span>
        </div>
      ))}
    </section>
  )
}
