import { useRef, useState } from 'react'
import clsx from 'clsx'
import Icon from '@/components/ui/Icon'
import { validasiGambar, MAKS_UKURAN_GAMBAR } from '@/utils/validasi'

// Unggah gambar cover: klik atau tarik-lepas, ada pratinjau, ganti, dan hapus.
// `onUnggah(file)` harus mengembalikan Promise<string> (URL gambar).
export default function UnggahCover({ id, nilai, onUbah, onUnggah, galat, className = "" }) {
  const inputRef = useRef(null)
  const [sedangMenarik, setSedangMenarik] = useState(false)
  const [memproses, setMemproses] = useState(false)
  const [galatBerkas, setGalatBerkas] = useState('')

  const proses = async (file) => {
    if (!file) return
    const pesan = validasiGambar(file)
    setGalatBerkas(pesan)
    if (pesan) return
    setMemproses(true)
    try {
      onUbah(await onUnggah(file))
    } catch (e) {
      setGalatBerkas(e.message)
    } finally {
      setMemproses(false)
    }
  }

  const pilihBerkas = (e) => {
    proses(e.target.files?.[0])
    e.target.value = '' // izinkan memilih file yang sama lagi
  }

  const lepas = (e) => {
    e.preventDefault()
    setSedangMenarik(false)
    proses(e.dataTransfer.files?.[0])
  }

  const pesanGalat = galatBerkas || galat

  return (
    <div className={clsx('flex-1 flex flex-col', className)}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Pilih gambar cover"
        aria-describedby={`${id}-info`}
        onChange={pilihBerkas}
      />

      {nilai ? (
        <div className="rounded-lg overflow-hidden border border-border-muted">
          <img src={nilai} alt="Pratinjau gambar cover" className="w-full aspect-[16/9] object-cover" />
          <div className="flex items-center justify-between gap-2 p-2.5 bg-surface-light border-t border-border-muted">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs font-semibold text-secondary hover:underline inline-flex items-center gap-1"
            >
              <Icon name="sync" className="text-[16px]" />
              Ganti gambar
            </button>
            <button
              type="button"
              onClick={() => {
                onUbah('')
                setGalatBerkas('')
              }}
              className="text-xs font-semibold text-rose-600 hover:underline inline-flex items-center gap-1"
            >
              <Icon name="delete" className="text-[16px]" />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setSedangMenarik(true)
          }}
          onDragLeave={() => setSedangMenarik(false)}
          onDrop={lepas}
          className={clsx(
            'w-full flex-1 min-h-[200px] flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors',
            sedangMenarik ? 'border-secondary bg-secondary/5' : 'border-border-muted hover:border-secondary bg-surface-light',
            pesanGalat && 'border-error',
          )}
        >
          <Icon name="add_photo_alternate" className="text-[32px] text-secondary" />
          <p className="mt-2 text-sm font-semibold text-on-surface">
            {memproses ? 'Memproses gambar…' : 'Klik atau tarik gambar ke sini'}
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            JPG, PNG, atau WebP • maks. {MAKS_UKURAN_GAMBAR / 1024 / 1024} MB • rasio 16:9 disarankan
          </p>
        </button>
      )}

      {pesanGalat && (
        <p role="alert" className="mt-1.5 text-xs text-error font-medium">
          {pesanGalat}
        </p>
      )}
    </div>
  )
}
