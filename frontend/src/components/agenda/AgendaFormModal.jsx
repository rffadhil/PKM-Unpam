import { useEffect, useState } from 'react'
import Icon from '@/components/ui/Icon'
import { KATEGORI_AGENDA, PERIODE_AKADEMIK } from '@/config/agenda'

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

// Form tambah / edit agenda. `item` = null untuk agenda baru.
// Isian mengikuti kolom tabel: tanggal & waktu, nama + deskripsi, kategori + catatan, penyelenggara / PIC.
export default function AgendaFormModal({ item, onSimpan, onTutup }) {
  const [errors, setErrors] = useState({})
  const v = (k, d = '') => item?.[k] ?? d

  useEffect(() => {
    const tutupDenganEsc = (e) => e.key === 'Escape' && onTutup()
    window.addEventListener('keydown', tutupDenganEsc)
    return () => window.removeEventListener('keydown', tutupDenganEsc)
  }, [onTutup])

  function handleSubmit(e) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.target))
    const next = {}
    if (!f.judul.trim()) next.judul = 'Nama agenda wajib diisi.'
    if (!f.tanggalMulai) next.tanggalMulai = 'Tanggal mulai wajib diisi.'
    if (f.tanggalSelesai && f.tanggalMulai && f.tanggalSelesai < f.tanggalMulai)
      next.tanggalSelesai = 'Tanggal selesai tidak boleh sebelum tanggal mulai.'
    setErrors(next)
    if (Object.keys(next).length) return

    onSimpan({
      ...item,
      ...f,
      judul: f.judul.trim(),
      tanggalSelesai: f.tanggalSelesai || null,
      // Kolom yang tidak ada lagi di form: pertahankan nilai lama (saat edit),
      // atau isi nilai bawaan (agenda baru) agar halaman publik & ekspor .ics tidak menemui undefined.
      lokasi: item?.lokasi ?? '',
      lokasiDetail: item?.lokasiDetail ?? '',
      ikonLokasi: item?.ikonLokasi ?? 'location_on',
      status: item?.status ?? 'mendatang',
      periode: item?.periode ?? PERIODE_AKADEMIK[0],
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onTutup()}>
      <div role="dialog" aria-modal="true" aria-labelledby="judul-modal-agenda" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-muted bg-surface-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border-muted bg-surface-light/60 p-6">
          <h2 id="judul-modal-agenda" className="text-xl font-bold text-primary">
            {item ? 'Edit Agenda' : 'Tambah Agenda Baru'}
          </h2>
          <button type="button" onClick={onTutup} aria-label="Tutup" className="rounded-md p-1 text-text-muted hover:bg-error/10 hover:text-error">
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-5 p-6 sm:grid-cols-2">
          <Kolom id="judul" label="Nama Agenda" wajib error={errors.judul} className="sm:col-span-2">
            <input id="judul" name="judul" defaultValue={v('judul')} autoFocus className={fieldCls} placeholder="Contoh: Rapat Pleno Komite" />
          </Kolom>

          <Kolom id="tanggalMulai" label="Tanggal Mulai" wajib error={errors.tanggalMulai}>
            <input id="tanggalMulai" name="tanggalMulai" type="date" defaultValue={v('tanggalMulai')} className={fieldCls} />
          </Kolom>
          <Kolom id="tanggalSelesai" label="Tanggal Selesai (opsional)" error={errors.tanggalSelesai}>
            <input id="tanggalSelesai" name="tanggalSelesai" type="date" defaultValue={v('tanggalSelesai')} className={fieldCls} />
          </Kolom>

          <Kolom id="waktu" label="Waktu">
            <input id="waktu" name="waktu" defaultValue={v('waktu')} className={fieldCls} placeholder="08.00 - 11.30 WIB" />
          </Kolom>
          <Kolom id="kategori" label="Kategori">
            <select id="kategori" name="kategori" defaultValue={v('kategori', KATEGORI_AGENDA[0])} className={fieldCls}>
              {KATEGORI_AGENDA.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </Kolom>

          <Kolom id="penyelenggara" label="Penyelenggara">
            <input id="penyelenggara" name="penyelenggara" defaultValue={v('penyelenggara')} className={fieldCls} placeholder="Contoh: Wakasek Kurikulum" />
          </Kolom>
          <Kolom id="pic" label="Penanggung Jawab (PIC)">
            <input id="pic" name="pic" defaultValue={v('pic')} className={fieldCls} placeholder="Contoh: Dra. Hj. Nurjanah, M.Pd." />
          </Kolom>

          <Kolom id="deskripsi" label="Deskripsi Singkat" className="sm:col-span-2">
            <textarea id="deskripsi" name="deskripsi" rows={3} defaultValue={v('deskripsi')} className={`${fieldCls} resize-none`} />
          </Kolom>
          <Kolom id="catatan" label="Catatan Publikasi" className="sm:col-span-2">
            <input id="catatan" name="catatan" defaultValue={v('catatan')} className={fieldCls} placeholder="Diumumkan di Web & WA Gateway" />
          </Kolom>

          <div className="flex justify-end gap-3 border-t border-border-muted pt-5 sm:col-span-2">
            <button type="button" onClick={onTutup} className="rounded-xl border border-border-muted px-5 py-2.5 font-bold text-primary hover:bg-surface-light">
              Batal
            </button>
            <button type="submit" className="rounded-xl bg-cta-gold px-5 py-2.5 font-bold text-primary shadow-sm hover:brightness-95">
              Simpan Agenda
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}