// Pengalih tampilan Super Admin / Admin, HANYA muncul saat `npm run dev`.
// Dipakai untuk melihat dua versi halaman. Hapus komponen ini (dan pemakaiannya di
// KelolaPengaturanPage) setelah peran diambil dari login sungguhan.
export default function PratinjauPeran({ nilai, onUbah }) {
  if (!import.meta.env.DEV) return null
  const pilihan = [
    { kunci: 'superadmin', label: 'Super Admin' },
    { kunci: 'admin', label: 'Admin (sub admin)' },
  ]
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-amber-400 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
      <span className="font-bold">Pratinjau (dev saja): tampilan sebagai</span>
      <div role="group" aria-label="Pilih peran pratinjau" className="inline-flex overflow-hidden rounded-lg border border-amber-300">
        {pilihan.map((p) => (
          <button
            key={p.kunci}
            type="button"
            aria-pressed={nilai === p.kunci}
            onClick={() => onUbah(p.kunci)}
            className={`px-3 py-1.5 font-semibold ${nilai === p.kunci ? 'bg-amber-500 text-white' : 'bg-white text-amber-900 hover:bg-amber-100'}`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
