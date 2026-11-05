// Satu kolom teks di bagian pembaruan cepat: judul, textarea, dan baris keterangan.
export default function BlokTeksProfil({ id, judul, nilai, onUbah, batas, serif = false, kiri, kanan }) {
  return (
    <div>
      <label htmlFor={id} className="block font-bold text-primary">{judul}</label>
      <textarea
        id={id}
        value={nilai}
        maxLength={batas}
        rows={6}
        onChange={(e) => onUbah(e.target.value)}
        className={`mt-3 block w-full resize-y rounded-xl border border-border-muted bg-surface-light/60 p-4 leading-relaxed text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 ${
          serif ? 'font-headline-md text-[15px] italic' : 'text-body-md'
        }`}
      />
      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-text-muted">
        <span>{kiri}</span>
        <span>{kanan ?? `${nilai.length}/${batas} karakter`}</span>
      </div>
    </div>
  )
}
