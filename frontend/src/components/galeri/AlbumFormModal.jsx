import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import { BATAS_UKURAN_FOTO_MB, KATEGORI_GALERI, LENCANA_DEFAULT, STATUS_ALBUM } from '@/config/galeri'

const fieldCls =
  'w-full rounded-xl border border-border-muted bg-surface-light px-4 py-2.5 text-primary focus:border-secondary focus:ring-secondary'

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

// Form buat / edit album. `album` = null untuk album baru.
// Upload masih sisi browser saja: sampul dipreview lewat object URL, foto hanya dihitung.
// TODO backend: kirim `new FormData(e.target)` (multipart) ke POST/PUT /api/album.
export default function AlbumFormModal({ album, onSimpan, onTutup }) {
  const [errors, setErrors] = useState({})
  const [berkas, setBerkas] = useState([])
  const v = (k, d = '') => album?.[k] ?? d

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onTutup()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onTutup])

  function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.target)
    const judul = String(fd.get('judul')).trim()
    const files = fd.getAll('foto').filter((f) => f.size > 0)
    const next = {}

    if (!judul) next.judul = 'Nama album wajib diisi.'
    if (!fd.get('tanggal')) next.tanggal = 'Tanggal kegiatan wajib diisi.'
    if (!album && files.length === 0) next.foto = 'Pilih minimal satu foto untuk album baru.'
    if (files.some((f) => !f.type.startsWith('image/'))) next.foto = 'Hanya berkas gambar (JPG, PNG, WebP) yang diperbolehkan.'
    else if (files.some((f) => f.size > BATAS_UKURAN_FOTO_MB * 1024 * 1024))
      next.foto = `Ukuran tiap foto maksimal ${BATAS_UKURAN_FOTO_MB} MB.`
    setErrors(next)
    if (Object.keys(next).length) return

    const kategori = String(fd.get('kategori'))
    onSimpan({
      ...album,
      judul,
      kategori,
      lencana: album && album.kategori === kategori ? album.lencana : LENCANA_DEFAULT[kategori],
      tanggal: String(fd.get('tanggal')),
      penyelenggara: String(fd.get('penyelenggara')).trim() || 'Humas Sekolah',
      status: String(fd.get('status')),
      deskripsi: String(fd.get('deskripsi')).trim(),
      cover: files[0] ? URL.createObjectURL(files[0]) : (album?.cover ?? null),
      jumlahFoto: (album?.jumlahFoto ?? 0) + files.length,
    })
  }

  const totalMB = berkas.reduce((s, f) => s + f.size, 0) / 1024 / 1024

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onTutup()}>
      <div role="dialog" aria-modal="true" aria-labelledby="judul-modal-album" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-muted bg-surface-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border-muted bg-surface-light/60 p-6">
          <h2 id="judul-modal-album" className="text-xl font-bold text-primary">
            {album ? 'Edit Album' : 'Buat Album Baru & Upload Foto'}
          </h2>
          <button onClick={onTutup} aria-label="Tutup" className="rounded-md p-1 text-text-muted hover:bg-error/10 hover:text-error">
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-5 p-6 sm:grid-cols-2">
          <Kolom id="judul" label="Nama Album" wajib error={errors.judul} className="sm:col-span-2">
            <input id="judul" name="judul" defaultValue={v('judul')} autoFocus className={fieldCls} placeholder="Contoh: Panen Raya Hidroponik" />
          </Kolom>

          <Kolom id="kategori" label="Kategori">
            <select id="kategori" name="kategori" defaultValue={v('kategori', KATEGORI_GALERI[0])} className={fieldCls}>
              {KATEGORI_GALERI.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </Kolom>
          <Kolom id="status" label="Status">
            <select id="status" name="status" defaultValue={v('status', 'draft')} className={fieldCls}>
              {Object.entries(STATUS_ALBUM).map(([k, s]) => (
                <option key={k} value={k}>
                  {s.label}
                </option>
              ))}
            </select>
          </Kolom>

          <Kolom id="tanggal" label="Tanggal Kegiatan" wajib error={errors.tanggal}>
            <input id="tanggal" name="tanggal" type="date" defaultValue={v('tanggal', new Date().toISOString().slice(0, 10))} className={fieldCls} />
          </Kolom>
          <Kolom id="penyelenggara" label="Penyelenggara / Pengunggah">
            <input id="penyelenggara" name="penyelenggara" defaultValue={v('penyelenggara')} className={fieldCls} placeholder="Humas Sekolah" />
          </Kolom>

          <Kolom id="deskripsi" label="Deskripsi Singkat" className="sm:col-span-2">
            <textarea id="deskripsi" name="deskripsi" rows={3} defaultValue={v('deskripsi')} className={`${fieldCls} resize-none`} />
          </Kolom>

          <Kolom id="foto" label={album ? 'Tambah Foto (opsional)' : 'Foto Album'} wajib={!album} error={errors.foto} className="sm:col-span-2">
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setBerkas([...e.target.files])}
              className="block w-full rounded-xl border border-dashed border-border-muted bg-surface-light p-3 text-sm text-text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-primary-container file:px-4 file:py-2 file:font-semibold file:text-white"
            />
            <p className="mt-1.5 text-xs text-text-muted">
              {berkas.length > 0
                ? `${berkas.length} foto dipilih (${totalMB.toFixed(1)} MB). Foto pertama dipakai sebagai sampul.`
                : `JPG, PNG, atau WebP. Maksimal ${BATAS_UKURAN_FOTO_MB} MB per foto.`}
            </p>
          </Kolom>

          <div className="flex justify-end gap-3 border-t border-border-muted pt-5 sm:col-span-2">
            <button type="button" onClick={onTutup} className="rounded-xl border border-border-muted px-5 py-2.5 font-bold text-primary hover:bg-surface-light">
              Batal
            </button>
            <button type="submit" className="rounded-xl bg-cta-gold px-5 py-2.5 font-bold text-primary shadow-sm hover:brightness-95">
              Simpan Album
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
