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
export default function AgendaFormModal({ item, sedangMenyimpan = false, galatServer = '', onSimpan, onTutup }) {
  const [errors, setErrors] = useState({})
  const v = (k, d = '') => {
    if (!item) return d
    if (k === 'tanggalMulai') return item.tanggalMulai || item.tanggal_mulai || d
    if (k === 'tanggalSelesai') return item.tanggalSelesai || item.tanggal_selesai || d
    if (k === 'kapasitasTarget') return item.kapasitasTarget || item.kapasitas_target || d
    return item[k] ?? d
  }

  useEffect(() => {
    const tutupDenganEsc = (e) => !sedangMenyimpan && e.key === 'Escape' && onTutup()
    window.addEventListener('keydown', tutupDenganEsc)
    return () => window.removeEventListener('keydown', tutupDenganEsc)
  }, [onTutup, sedangMenyimpan])

  function handleSubmit(e) {
    e.preventDefault()
    if (sedangMenyimpan) return

    const f = Object.fromEntries(new FormData(e.target))
    const next = {}
    if (!f.judul?.trim()) next.judul = 'Nama agenda wajib diisi.'
    if (!f.tanggalMulai) next.tanggalMulai = 'Tanggal mulai wajib diisi.'
    if (f.tanggalSelesai && f.tanggalMulai && f.tanggalSelesai < f.tanggalMulai) {
      next.tanggalSelesai = 'Tanggal selesai tidak boleh sebelum tanggal mulai.'
    }

    setErrors(next)
    if (Object.keys(next).length > 0) return

    const tMulai = f.tanggalMulai || null
    const tSelesai = f.tanggalSelesai || null

    onSimpan({
      ...item,
      ...f,
      id: item?.id,
      judul: f.judul.trim(),
      tanggalMulai: tMulai,
      tanggalSelesai: tSelesai,
      kategori: f.kategori || item?.kategori || KATEGORI_AGENDA[0],
      periode: f.periode?.trim() || item?.periode || PERIODE_AKADEMIK[0],
      lokasi: f.lokasi ? f.lokasi.trim() : (item?.lokasi ?? ''),
      lokasiDetail: item?.lokasiDetail ?? '',
      ikonLokasi: item?.ikonLokasi ?? 'location_on',
      status: item?.status ?? 'mendatang',
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => !sedangMenyimpan && e.target === e.currentTarget && onTutup()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="judul-modal-agenda"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border-muted bg-surface-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border-muted bg-surface-light/60 p-6">
          <h2 id="judul-modal-agenda" className="text-xl font-bold text-primary">
            {item ? 'Edit Agenda' : 'Tambah Agenda Baru'}
          </h2>
          <button
            type="button"
            disabled={sedangMenyimpan}
            onClick={onTutup}
            aria-label="Tutup"
            className="rounded-md p-1 text-text-muted hover:bg-error/10 hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="close" className="text-[24px]" />
          </button>
        </div>

        {galatServer && (
          <div className="mx-6 mt-6 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">
            {galatServer}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="grid gap-5 p-6 sm:grid-cols-2">
          <Kolom id="judul" label="Nama Agenda" wajib error={errors.judul} className="sm:col-span-2">
            <input
              id="judul"
              name="judul"
              defaultValue={v('judul')}
              autoFocus
              className={fieldCls}
              placeholder="Contoh: Rapat Pleno Komite"
            />
          </Kolom>

          <Kolom id="tanggalMulai" label="Tanggal Mulai" wajib error={errors.tanggalMulai}>
            <input
              id="tanggalMulai"
              name="tanggalMulai"
              type="date"
              defaultValue={v('tanggalMulai')}
              className={fieldCls}
            />
          </Kolom>
          <Kolom id="tanggalSelesai" label="Tanggal Selesai (opsional)" error={errors.tanggalSelesai}>
            <input
              id="tanggalSelesai"
              name="tanggalSelesai"
              type="date"
              defaultValue={v('tanggalSelesai')}
              className={fieldCls}
            />
          </Kolom>

          <Kolom id="waktu" label="Waktu Pelaksanaan">
            <input
              id="waktu"
              name="waktu"
              defaultValue={v('waktu')}
              className={fieldCls}
              placeholder="08.00 - 11.30 WIB"
            />
          </Kolom>
          <Kolom id="kategori" label="Kategori">
            <select
              id="kategori"
              name="kategori"
              defaultValue={v('kategori', KATEGORI_AGENDA[0])}
              className={fieldCls}
            >
              {KATEGORI_AGENDA.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </Kolom>

          <Kolom id="periode" label="Periode Akademik" className="sm:col-span-2">
            <select
              id="periode"
              name="periode"
              defaultValue={v('periode', PERIODE_AKADEMIK[0])}
              className={fieldCls}
            >
              {PERIODE_AKADEMIK.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Kolom>

          <Kolom id="lokasi" label="Lokasi / Tempat" className="sm:col-span-2">
            <input
              id="lokasi"
              name="lokasi"
              defaultValue={v('lokasi')}
              className={fieldCls}
              placeholder="Contoh: Aula Utama Ki Hajar Dewantara"
            />
          </Kolom>

          <Kolom id="penyelenggara" label="Penyelenggara">
            <input
              id="penyelenggara"
              name="penyelenggara"
              defaultValue={v('penyelenggara')}
              className={fieldCls}
              placeholder="Contoh: Wakasek Kurikulum"
            />
          </Kolom>
          <Kolom id="pic" label="Penanggung Jawab (PIC)">
            <input
              id="pic"
              name="pic"
              defaultValue={v('pic')}
              className={fieldCls}
              placeholder="Contoh: Dra. Hj. Nurjanah, M.Pd."
            />
          </Kolom>

          <Kolom id="deskripsi" label="Deskripsi Singkat" className="sm:col-span-2">
            <textarea
              id="deskripsi"
              name="deskripsi"
              rows={3}
              defaultValue={v('deskripsi')}
              className={`${fieldCls} resize-none`}
              placeholder="Deskripsi singkat agenda kegiatan sekolah..."
            />
          </Kolom>
          <Kolom id="catatan" label="Catatan Publikasi" className="sm:col-span-2">
            <input
              id="catatan"
              name="catatan"
              defaultValue={v('catatan')}
              className={fieldCls}
              placeholder="Contoh: Diumumkan di Web & WA Gateway"
            />
          </Kolom>

          <div className="flex justify-end gap-3 border-t border-border-muted pt-5 sm:col-span-2">
            <button
              type="button"
              disabled={sedangMenyimpan}
              onClick={onTutup}
              className="rounded-xl border border-border-muted px-5 py-2.5 font-bold text-primary hover:bg-surface-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={sedangMenyimpan}
              className="inline-flex items-center gap-2 rounded-xl bg-cta-gold px-5 py-2.5 font-bold text-primary shadow-sm hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {sedangMenyimpan ? (
                <>
                  <Icon name="progress_activity" className="animate-spin text-[18px]" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                'Simpan Agenda'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
