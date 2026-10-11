import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import { BATAS_SAMBUTAN } from '@/config/staf'

const areaCls = 'w-full resize-none rounded-xl border border-border-muted bg-surface-light p-4 text-primary focus:border-secondary focus:ring-secondary'

// Panel edit cepat sambutan kepala sekolah & visi. `onSimpan(mode, data)`: mode 'draft' | 'live'.
// TODO backend: simpan ke `pengaturan_sekolah` (key: sambutan_kepsek, visi_utama).
export default function ProfilSambutan({ awal, onSimpan }) {
  const [sambutan, setSambutan] = useState(awal.sambutan)
  const [visi, setVisi] = useState(awal.visi)
  const [status, setStatus] = useState(awal.status)
  const [error, setError] = useState('')

  function simpan(mode) {
    if (!sambutan.trim() || !visi.trim()) return setError('Teks sambutan dan visi tidak boleh kosong.')
    setError('')
    setStatus(mode)
    onSimpan(mode, { sambutan: sambutan.trim(), visi: visi.trim() })
  }

  const live = status === 'live'

  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary text-cta-gold">
            <Icon name="format_quote" className="text-[30px]" />
          </span>
          <div>
            <h2 className="text-headline-sm font-bold text-primary">Pembaruan Cepat Sambutan Kepala Sekolah & Visi Misi</h2>
            <p className="mt-1 text-sm text-text-muted">Teks ini langsung ditayangkan pada Beranda dan Halaman Profil Publik SMA Harapan Jaya.</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold ${live ? 'bg-secondary-container/70 text-secondary-dark' : 'bg-amber-100 text-amber-800'}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${live ? 'bg-secondary' : 'bg-amber-500'}`} />
          Status: {live ? 'Terbit Live' : 'Draft'}
        </span>
      </div>

      <div className="mt-6 grid gap-8 border-t border-border-muted pt-6 lg:grid-cols-2">
        <div>
          <label htmlFor="sambutan" className="mb-3 block text-lg font-bold text-primary">Teks Kutipan Sambutan Kepala Sekolah</label>
          <textarea id="sambutan" rows={6} maxLength={BATAS_SAMBUTAN} value={sambutan} onChange={(e) => setSambutan(e.target.value)} className={`${areaCls} font-headline-md italic`} />
          <p className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-text-muted">
            <span>Penulis Terpaut: {awal.penulis}</span>
            <span aria-live="polite">{sambutan.length} / {BATAS_SAMBUTAN} Karakter</span>
          </p>
        </div>
        <div>
          <label htmlFor="visi" className="mb-3 block text-lg font-bold text-primary">Visi Utama Institusi (Singkat Beranda)</label>
          <textarea id="visi" rows={6} value={visi} onChange={(e) => setVisi(e.target.value)} className={areaCls} />
          <p className="mt-3 flex flex-wrap justify-between gap-2 text-sm text-text-muted">
            <span>Kurikulum: {awal.kurikulum}</span>
            <span>Tersinkronisasi ke BAN-S/M</span>
          </p>
        </div>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">{error}</p>}

      <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-border-muted pt-6">
        <button onClick={() => simpan('draft')} className="rounded-xl border border-border-muted px-5 py-2.5 font-semibold text-on-surface-variant hover:bg-surface-light">Simpan Sebagai Draft</button>
        <button onClick={() => simpan('live')} className="inline-flex items-center gap-2 rounded-xl bg-cta-gold px-5 py-2.5 font-bold text-primary shadow-sm hover:brightness-95">
          <Icon name="cloud_upload" /> Simpan Perubahan Profil & Tayangkan
        </button>
      </div>
    </section>
  )
}
