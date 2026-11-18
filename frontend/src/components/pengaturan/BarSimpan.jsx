import Icon from '@/components/ui/Icon'

// Bilah simpan di bawah halaman (menempel saat menggulir).
export default function BarSimpan({
  berubah,
  onBatal,
  onSimpan,
  sedangSimpan = false,
}) {
  const nonaktif = !berubah || sedangSimpan

  return (
    <div className="sticky bottom-2 z-10 flex flex-col gap-4 rounded-2xl border border-border-muted bg-surface-white p-5 shadow-lg sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${berubah ? 'bg-amber-100 text-amber-700' : 'bg-secondary-container text-secondary'}`}>
          <Icon name={berubah ? 'pending' : 'check_circle'} className="text-[22px]" />
        </span>
        <div>
          <p className="text-sm font-bold text-primary">
            {sedangSimpan
              ? 'Menyimpan Perubahan…'
              : berubah
                ? 'Perubahan Belum Diterapkan ke Server'
                : 'Semua Perubahan Sudah Tersimpan'}
          </p>
          <p className="text-xs text-text-muted">
            Pastikan konfigurasi telah diverifikasi sebelum disimpan.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onBatal}
          disabled={nonaktif}
          className="rounded-lg border border-border-muted bg-surface-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onSimpan}
          disabled={nonaktif}
          className="inline-flex items-center gap-2 rounded-xl bg-cta-gold px-5 py-2.5 text-sm font-bold text-primary shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="save" className="text-[20px]" />
          Simpan Perubahan Pengaturan
        </button>
      </div>
    </div>
  )
}
