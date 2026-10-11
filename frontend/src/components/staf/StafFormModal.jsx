import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import { RUMPUN_STAF, STATUS_KEPEGAWAIAN } from '@/config/staf'
import { validasiNomorInduk } from '@/utils/staf'

const fieldCls = 'w-full rounded-xl border border-border-muted bg-surface-light px-4 py-2.5 text-primary focus:border-secondary focus:ring-secondary'

function Kolom({ id, label, error, wajib, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-primary">
        {label} {wajib && <span className="text-error" aria-hidden>*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  )
}

// Form tambah / edit staf. `staf` = null untuk staf baru.
// TODO backend: kirim sebagai multipart (FormData) ke POST/PUT /api/staf.
export default function StafFormModal({ staf, onSimpan, onTutup }) {
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(staf?.statusKepegawaian ?? 'PNS')
  const v = (k, d = '') => staf?.[k] ?? d

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onTutup()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onTutup])

  function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const f = Object.fromEntries([...fd].filter(([, val]) => typeof val === 'string'))
    const foto = fd.get('foto')
    const nomorInduk = f.nomorInduk.replace(/\s/g, '')
    const next = {}
    if (!f.nama.trim()) next.nama = 'Nama lengkap wajib diisi.'
    if (!f.jabatan.trim()) next.jabatan = 'Jabatan wajib diisi.'
    const errNomor = validasiNomorInduk(nomorInduk, f.statusKepegawaian)
    if (errNomor) next.nomorInduk = errNomor
    if (foto?.size > 0 && !foto.type.startsWith('image/')) next.foto = 'Berkas harus berupa gambar.'
    else if (foto?.size > 2 * 1024 * 1024) next.foto = 'Ukuran foto maksimal 2 MB.'
    setErrors(next)
    if (Object.keys(next).length) return

    onSimpan({
      ...staf,
      nama: f.nama.trim(),
      nomorInduk,
      rumpun: f.rumpun,
      jabatan: f.jabatan.trim(),
      bidang: f.bidang.trim(),
      pendidikan: f.pendidikan.trim(),
      institusi: f.institusi.trim(),
      statusKepegawaian: f.statusKepegawaian,
      golongan: f.golongan.trim(),
      sertifikasiPpg: fd.has('sertifikasiPpg'),
      tampilPublik: fd.has('tampilPublik'),
      foto: foto?.size > 0 ? URL.createObjectURL(foto) : (staf?.foto ?? null),
      lencana: staf?.lencana ?? (f.rumpun === 'Tenaga Kependidikan' ? 'tu' : f.rumpun === 'Pembina Ekstrakurikuler' ? 'ekskul' : 'guru'),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onTutup()}>
      <div role="dialog" aria-modal="true" aria-labelledby="judul-modal-staf" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-muted bg-surface-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border-muted bg-surface-light/60 p-6">
          <h2 id="judul-modal-staf" className="text-xl font-bold text-primary">{staf ? 'Edit Data Pendidik / Staf' : 'Tambah Pendidik / Staf Baru'}</h2>
          <button onClick={onTutup} aria-label="Tutup" className="rounded-md p-1 text-text-muted hover:bg-error/10 hover:text-error">
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-5 p-6 sm:grid-cols-2">
          <Kolom id="nama" label="Nama Lengkap & Gelar" wajib error={errors.nama} className="sm:col-span-2">
            <input id="nama" name="nama" defaultValue={v('nama')} autoFocus className={fieldCls} placeholder="Contoh: Drs. H. Bambang Sudirman, M.Pd" />
          </Kolom>

          <Kolom id="statusKepegawaian" label="Status Kepegawaian">
            <select id="statusKepegawaian" name="statusKepegawaian" value={status} onChange={(e) => setStatus(e.target.value)} className={fieldCls}>
              {Object.entries(STATUS_KEPEGAWAIAN).map(([k, label]) => (
                <option key={k} value={k}>{label}</option>
              ))}
            </select>
          </Kolom>
          <Kolom id="nomorInduk" label={status === 'PNS' ? 'NIP (18 digit)' : 'NUPTK (16 digit)'} wajib error={errors.nomorInduk}>
            <input id="nomorInduk" name="nomorInduk" inputMode="numeric" defaultValue={v('nomorInduk')} className={`${fieldCls} font-mono`} />
          </Kolom>

          <Kolom id="rumpun" label="Rumpun">
            <select id="rumpun" name="rumpun" defaultValue={v('rumpun', RUMPUN_STAF[1])} className={fieldCls}>
              {RUMPUN_STAF.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Kolom>
          <Kolom id="jabatan" label="Jabatan" wajib error={errors.jabatan}>
            <input id="jabatan" name="jabatan" defaultValue={v('jabatan')} className={fieldCls} placeholder="Wakasek Kurikulum" />
          </Kolom>

          <Kolom id="bidang" label="Bidang / Mata Pelajaran" className="sm:col-span-2">
            <input id="bidang" name="bidang" defaultValue={v('bidang')} className={fieldCls} placeholder="MIPA - Kimia Organik" />
          </Kolom>

          <Kolom id="pendidikan" label="Pendidikan Terakhir">
            <input id="pendidikan" name="pendidikan" defaultValue={v('pendidikan')} className={fieldCls} placeholder="S2 Kimia Sains" />
          </Kolom>
          <Kolom id="institusi" label="Institusi">
            <input id="institusi" name="institusi" defaultValue={v('institusi')} className={fieldCls} placeholder="Institut Teknologi Bandung (ITB)" />
          </Kolom>

          <Kolom id="golongan" label="Golongan / Jenjang (opsional)" className="sm:col-span-2">
            <input id="golongan" name="golongan" defaultValue={v('golongan')} className={fieldCls} placeholder="Pembina, Penata Tk. I, Fungsional…" />
          </Kolom>

          <Kolom id="foto" label="Foto (opsional, maks. 2 MB)" error={errors.foto} className="sm:col-span-2">
            <input id="foto" name="foto" type="file" accept="image/*" className="block w-full rounded-xl border border-dashed border-border-muted bg-surface-light p-3 text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary-container file:px-4 file:py-2 file:font-semibold file:text-white" />
          </Kolom>

          <div className="flex flex-wrap gap-6 sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" name="sertifikasiPpg" defaultChecked={staf?.sertifikasiPpg ?? false} className="h-5 w-5 rounded border-border-muted text-primary focus:ring-secondary" />
              Tersertifikasi PPG
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" name="tampilPublik" defaultChecked={staf?.tampilPublik ?? true} className="h-5 w-5 rounded border-border-muted text-primary focus:ring-secondary" />
              Tampilkan di halaman publik
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-border-muted pt-5 sm:col-span-2">
            <button type="button" onClick={onTutup} className="rounded-xl border border-border-muted px-5 py-2.5 font-bold text-primary hover:bg-surface-light">Batal</button>
            <button type="submit" className="rounded-xl bg-cta-gold px-5 py-2.5 font-bold text-primary shadow-sm hover:brightness-95">Simpan Data</button>
          </div>
        </form>
      </div>
    </div>
  )
}
