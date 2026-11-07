import { useRef, useState } from 'react'
import Icon from '@/components/ui/Icon'
import IkonBerkas from '@/components/dokumen/IkonBerkas'
import { BATAS_BERKAS_MB } from '@/config/dokumenAdmin'
import { ekstensiBerkas, formatUkuran } from '@/utils/dokumen'

// Area tarik-lepas berkas. Validasi dilakukan pemanggil (lewat onPilih).
export default function ZonaUnggah({ berkas, error, onPilih, onHapus }) {
  const [diseret, setDiseret] = useState(false)
  const input = useRef(null)

  function lepas(e) {
    e.preventDefault()
    setDiseret(false)
    const file = e.dataTransfer.files?.[0]
    if (file) onPilih(file)
  }

  function pilih(e) {
    const file = e.target.files?.[0]
    if (file) onPilih(file)
    e.target.value = ''
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDiseret(true) }}
        onDragLeave={() => setDiseret(false)}
        onDrop={lepas}
        className={`flex min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
          diseret ? 'border-secondary bg-secondary-container/40' : error ? 'border-error/60 bg-error-container/20' : 'border-secondary/40 bg-secondary-container/10'
        }`}
      >
        <input
          ref={input}
          id="dokumen-berkas"
          type="file"
          accept=".pdf,.docx,.xlsx"
          onChange={pilih}
          aria-describedby={error ? 'dokumen-berkas-error' : undefined}
          className="sr-only"
        />

        {berkas ? (
          <>
            <IkonBerkas tipe={ekstensiBerkas(berkas)} className="h-16 w-16" />
            <p className="max-w-full break-words font-bold text-primary">{berkas.name}</p>
            <p className="text-sm text-text-muted">{formatUkuran(berkas.size)}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => input.current?.click()} className="rounded-lg border border-border-muted bg-surface-white px-3 py-1.5 text-sm font-semibold text-primary hover:bg-surface-light">
                Ganti berkas
              </button>
              <button type="button" onClick={onHapus} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-error hover:bg-error-container">
                Hapus
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-secondary">
              <Icon name="cloud_upload" className="text-[34px]" />
            </span>
            <p className="font-semibold text-primary">
              Tarik &amp; lepas file template ke sini, atau{' '}
              <button type="button" onClick={() => input.current?.click()} className="font-bold text-secondary underline underline-offset-2 hover:text-secondary-dark">
                klik Telusuri Berkas
              </button>
            </p>
            <p className="text-body-sm text-text-muted">
              Format yang didukung: <strong className="text-on-surface">PDF, DOCX, XLSX</strong> (Maksimal ukuran file {BATAS_BERKAS_MB} MB)
            </p>
          </>
        )}

        <span className="mt-1 inline-flex items-center gap-2 rounded-lg border border-border-muted bg-surface-white px-3 py-2 text-xs font-medium text-secondary">
          <Icon name="verified_user" className="text-[16px]" />
          Pindai Otomatis Anti-Malware Terverifikasi
        </span>
      </div>
      {error && <p id="dokumen-berkas-error" role="alert" className="mt-1.5 text-xs text-error">{error}</p>}
    </div>
  )
}
