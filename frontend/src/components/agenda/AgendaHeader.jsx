import Icon from '@/components/ui/Icon'

// Judul kartu daftar + tombol Tambah Agenda Baru. Modal form dibuka oleh halaman (onTambah).
export default function AgendaHeader({ onTambah }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-xl">
        <h2 className="text-headline-sm font-bold text-primary">Daftar Agenda Akademik & Aktivitas Civitas</h2>
        <p className="mt-1 text-text-muted">
          Kelola kalender ujian, rapat dinas, ekstrakurikuler, dan peringatan hari besar sekolah.
        </p>
      </div>
      <button
        type="button"
        onClick={onTambah}
        className="inline-flex items-center gap-2 rounded-xl bg-cta-gold px-4 py-2.5 font-bold text-primary shadow-sm hover:brightness-95"
      >
        <Icon name="add_circle" /> Tambah Agenda Baru
      </button>
    </div>
  )
}
