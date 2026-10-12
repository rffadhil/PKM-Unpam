import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import { urlValid } from '@/utils/pesan'

const inputCls = 'w-full rounded-xl border border-border-muted bg-surface-light px-4 py-2.5 text-sm text-primary focus:border-secondary focus:ring-secondary'

function Isian({ id, label, nilai, onUbah, error, mono, aksi }) {
  return (
    <div className="mt-4">
      <label htmlFor={id} className="mb-1.5 block text-sm text-text-muted">{label}</label>
      <div className="flex gap-2">
        <input id={id} value={nilai} onChange={(e) => onUbah(e.target.value)} aria-invalid={Boolean(error)} className={`${inputCls} ${mono ? 'font-mono' : ''} ${error ? 'border-error' : ''}`} />
        {aksi}
      </div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  )
}

const Judul = ({ ikon, children }) => (
  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary"><Icon name={ikon} className="text-[20px] text-secondary" /> {children}</h3>
)

// Konfigurasi saluran kontak publik. TODO backend: simpan ke `pengaturan_sekolah` (key/value).
export default function KontakPublikForm({ awal, onSimpan }) {
  const [f, setF] = useState(awal)
  const [errors, setErrors] = useState({})
  const ubah = (k) => (v) => setF((x) => ({ ...x, [k]: v }))
  const berubah = JSON.stringify(f) !== JSON.stringify(awal)

  function simpan() {
    const next = {}
    for (const [k, v] of Object.entries(f)) if (!v.trim()) next[k] = 'Kolom ini tidak boleh kosong.'
    if (!next.petaUrl && !urlValid(f.petaUrl.trim())) next.petaUrl = 'Tautan harus berupa alamat https:// yang valid.'
    setErrors(next)
    if (Object.keys(next).length) return
    onSimpan(Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v.trim()])))
  }

  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-headline-sm font-bold text-primary">Konfigurasi Saluran Kontak Publik & Jadwal Pelayanan PTSP</h2>
          <p className="mt-1 text-sm text-text-muted">Data berikut disinkronkan secara langsung dengan Halaman Kontak Publik & Footer Portal Resmi SMA Harapan Jaya.</p>
        </div>
        <button onClick={simpan} disabled={!berubah} className="inline-flex items-center gap-2 rounded-xl bg-secondary-dark px-4 py-2.5 font-semibold text-white hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50">
          <Icon name="save" className="text-[18px]" /> Simpan Perubahan Kontak
        </button>
      </div>

      <div className="mt-6 grid gap-8 border-t border-border-muted pt-6 lg:grid-cols-3">
        <div>
          <Judul ikon="call">Nomor Kontak & WhatsApp Gateway</Judul>
          <Isian id="wa" label="Layanan WhatsApp Posko PPDB 2026/2027:" nilai={f.whatsappPosko} onUbah={ubah('whatsappPosko')} error={errors.whatsappPosko} mono />
          <Isian id="tel" label="Hotline Kantor Tata Usaha / Telepon:" nilai={f.teleponTu} onUbah={ubah('teleponTu')} error={errors.teleponTu} mono />
        </div>
        <div>
          <Judul ikon="schedule">Jam Operasional Layanan PTSP Kampus</Judul>
          <Isian id="jam1" label="Senin - Kamis (Layanan Tatap Muka):" nilai={f.jamSenKam} onUbah={ubah('jamSenKam')} error={errors.jamSenKam} />
          <Isian id="jam2" label="Jumat (Layanan Terbatas):" nilai={f.jamJumat} onUbah={ubah('jamJumat')} error={errors.jamJumat} />
        </div>
        <div>
          <Judul ikon="location_on">Lokasi Kampus & Tautan Peta Interaktif</Judul>
          <Isian id="alamat" label="Alamat Resmi Kampus Utama:" nilai={f.alamat} onUbah={ubah('alamat')} error={errors.alamat} />
          <Isian
            id="peta"
            label="Integrasi Tautan Google Maps Terverifikasi:"
            nilai={f.petaUrl}
            onUbah={ubah('petaUrl')}
            error={errors.petaUrl}
            mono
            aksi={
              urlValid(f.petaUrl.trim()) ? (
                <a href={f.petaUrl.trim()} target="_blank" rel="noopener noreferrer" aria-label="Buka peta di tab baru" className="grid w-11 shrink-0 place-items-center rounded-xl border border-border-muted text-text-muted hover:bg-surface-container"><Icon name="open_in_new" className="text-[20px]" /></a>
              ) : (
                <span aria-hidden className="grid w-11 shrink-0 place-items-center rounded-xl border border-border-muted text-text-muted/40"><Icon name="open_in_new" className="text-[20px]" /></span>
              )
            }
          />
        </div>
      </div>
    </section>
  )
}
