import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import { KATEGORI_PESAN } from '@/config/pesan'
import { validasiTiketBaru } from '@/utils/pesan'

const fieldCls = 'w-full rounded-xl border border-border-muted bg-surface-light px-4 py-2.5 text-primary focus:border-secondary focus:ring-secondary disabled:opacity-50'

function Kolom({ id, label, error, wajib, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-primary">{label} {wajib && <span className="text-error" aria-hidden>*</span>}</label>
      {children}
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  )
}

// Catat pesan yang masuk lewat telepon / tatap muka sebagai tiket baru.
export default function TiketFormModal({ onSimpan, onTutup }) {
  const [errors, setErrors] = useState({})
  const [anonim, setAnonim] = useState(false)

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onTutup()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onTutup])

  function handleSubmit(e) {
    e.preventDefault()
    const fd = Object.fromEntries(new FormData(e.target))
    const f = { pengirim: '', email: '', whatsapp: '', satuan: '', ...fd, anonim }
    const next = validasiTiketBaru(f)
    setErrors(next)
    if (Object.keys(next).length) return
    onSimpan({
      kategori: f.kategori,
      anonim,
      pengirim: anonim ? 'Anonim Terproteksi' : f.pengirim.trim(),
      satuan: anonim ? 'Kanal Enkripsi SHA-256' : f.satuan.trim(),
      email: anonim ? '' : f.email.trim(),
      whatsapp: anonim ? '' : f.whatsapp.trim(),
      subjek: f.subjek.trim(),
      isi: f.isi.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onTutup()}>
      <div role="dialog" aria-modal="true" aria-labelledby="judul-modal-tiket" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-muted bg-surface-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border-muted bg-surface-light/60 p-6">
          <h2 id="judul-modal-tiket" className="text-xl font-bold text-primary">Buat Tiket / Catat Pesan Baru</h2>
          <button onClick={onTutup} aria-label="Tutup" className="rounded-md p-1 text-text-muted hover:bg-error/10 hover:text-error"><Icon name="close" className="text-[24px]" /></button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-5 p-6 sm:grid-cols-2">
          <Kolom id="kategori" label="Kategori Layanan">
            <select id="kategori" name="kategori" defaultValue="legalisir" className={fieldCls}>
              {KATEGORI_PESAN.map((k) => <option key={k.kunci} value={k.kunci}>{k.label}</option>)}
            </select>
          </Kolom>
          <label className="flex cursor-pointer items-center gap-2.5 self-end pb-2 text-sm">
            <input type="checkbox" checked={anonim} onChange={(e) => setAnonim(e.target.checked)} className="h-5 w-5 rounded border-border-muted text-primary focus:ring-secondary" />
            Pelapor anonim (WBS)
          </label>

          <Kolom id="pengirim" label="Nama Pengirim" wajib={!anonim} error={errors.pengirim}>
            <input id="pengirim" name="pengirim" disabled={anonim} autoFocus className={fieldCls} />
          </Kolom>
          <Kolom id="satuan" label="Satuan / Keterangan">
            <input id="satuan" name="satuan" disabled={anonim} className={fieldCls} placeholder="Wali Murid Kelas X-3" />
          </Kolom>
          <Kolom id="email" label="Email" error={errors.email}>
            <input id="email" name="email" type="email" disabled={anonim} className={fieldCls} />
          </Kolom>
          <Kolom id="whatsapp" label="No. WhatsApp">
            <input id="whatsapp" name="whatsapp" inputMode="tel" disabled={anonim} className={fieldCls} />
          </Kolom>
          {errors.kontak && <p className="text-sm text-error sm:col-span-2">{errors.kontak}</p>}

          <Kolom id="subjek" label="Subjek" wajib error={errors.subjek} className="sm:col-span-2">
            <input id="subjek" name="subjek" className={fieldCls} />
          </Kolom>
          <Kolom id="isi" label="Isi Pesan / Kebutuhan" wajib error={errors.isi} className="sm:col-span-2">
            <textarea id="isi" name="isi" rows={4} className={`${fieldCls} resize-none`} />
          </Kolom>

          <div className="flex justify-end gap-3 border-t border-border-muted pt-5 sm:col-span-2">
            <button type="button" onClick={onTutup} className="rounded-xl border border-border-muted px-5 py-2.5 font-bold text-primary hover:bg-surface-light">Batal</button>
            <button type="submit" className="rounded-xl bg-cta-gold px-5 py-2.5 font-bold text-primary shadow-sm hover:brightness-95">Simpan Tiket</button>
          </div>
        </form>
      </div>
    </div>
  )
}
