import Icon from '@/components/ui/Icon'

// Kolom pengirim: nama + email + telepon, atau penanda anonim, atau instansi.
export default function PengirimCell({ tiket }) {
  if (tiket.anonim) {
    return (
      <div>
        <p className="inline-flex items-center gap-1.5 font-bold text-indigo-800">
          <Icon name="lock" className="text-[16px]" />
          Anonim Terproteksi
        </p>
        <p className="mt-0.5 font-mono text-xs italic text-indigo-600">Kanal Enkripsi SHA-256</p>
      </div>
    )
  }
  return (
    <div className="min-w-0">
      <p className={`leading-snug text-primary ${tiket.dibaca ? 'font-semibold' : 'font-bold'}`}>{tiket.nama}</p>
      {tiket.email && (
        <p className="mt-0.5 flex items-center gap-1.5 text-body-sm text-text-muted">
          <Icon name="mail" className="text-[15px]" />
          <span className="truncate">{tiket.email}</span>
        </p>
      )}
      {tiket.telepon && (
        <p className="flex items-center gap-1.5 text-body-sm text-text-muted">
          <Icon name="call" className="text-[15px] text-secondary" />
          {tiket.telepon}
        </p>
      )}
      {!tiket.email && !tiket.telepon && tiket.instansi && (
        <p className="text-body-sm text-text-muted">{tiket.instansi}</p>
      )}
      {(tiket.email || tiket.telepon) && tiket.instansi && (
        <p className="mt-0.5 text-xs text-text-muted">{tiket.instansi}</p>
      )}
    </div>
  )
}
