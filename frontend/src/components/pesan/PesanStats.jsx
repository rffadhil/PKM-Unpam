import Icon from '@/components/ui/Icon'

// 4 kartu ringkasan. Garis warna di bawah kartu menandai tingkat urgensi.
export default function PesanStats({ stats }) {
  const kartu = [
    { label: 'Total Pesan Masuk', nilai: stats.total, satuan: 'Pesan', ikon: 'inbox', box: 'bg-surface-container text-primary-container', aksen: 'border-border-muted', cap: <><strong>+{stats.mingguIni} pesan</strong> masuk minggu ini</>, capIkon: 'trending_up', capClass: 'text-secondary' },
    { label: 'Belum Dibalas', nilai: stats.belum, satuan: 'Pesan', ikon: 'hourglass_top', box: 'bg-amber-100 text-amber-700', aksen: 'border-amber-400', kartuClass: 'bg-amber-50/50 ring-1 ring-amber-300', judulClass: 'text-amber-800', cap: <strong>Perlu Tindakan Cepat (SLA &lt; 24 Jam)</strong>, capIkon: 'priority_high', capClass: 'text-amber-800' },
    { label: 'Selesai / Terverifikasi', nilai: stats.selesai, satuan: 'Pesan', ikon: 'task_alt', box: 'bg-secondary-container/60 text-secondary', aksen: 'border-secondary', cap: <>Rata-rata respon &lt; <strong>2 Jam</strong> kerja</>, capIkon: 'timer', capClass: 'text-secondary' },
    { label: 'Layanan WBS & Aspirasi', nilai: stats.wbs, satuan: 'Laporan', ikon: 'shield', box: 'bg-indigo-50 text-indigo-700', aksen: 'border-indigo-500', cap: 'Tersandikan & Privasi Terjaga', capIkon: 'lock', capClass: 'text-indigo-700' },
  ]
  return (
    <section aria-label="Ringkasan pesan masuk" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kartu.map((k) => (
        <div key={k.label} className={`flex items-start justify-between gap-3 rounded-2xl border border-b-4 border-border-muted bg-surface-white p-5 shadow-sm ${k.aksen} ${k.kartuClass ?? ''}`}>
          <div className="min-w-0">
            <p className={`text-xs font-bold uppercase tracking-wider ${k.judulClass ?? 'text-text-muted'}`}>{k.label}</p>
            <p className="mt-2 font-headline-lg text-headline-lg-mobile text-primary">
              {k.nilai} <span className="font-body-md text-body-md font-normal text-text-muted">{k.satuan}</span>
            </p>
            <p className={`mt-2 flex items-start gap-1.5 text-sm ${k.capClass}`}>
              <Icon name={k.capIkon} className="mt-0.5 text-[18px]" /> <span>{k.cap}</span>
            </p>
          </div>
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${k.box}`}>
            <Icon name={k.ikon} className="text-[22px]" />
          </span>
        </div>
      ))}
    </section>
  )
}
