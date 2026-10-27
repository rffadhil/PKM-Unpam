import { useState } from 'react'
import ModalDialog from '@/components/ui/ModalDialog'
import KolomForm from '@/components/ui/KolomForm'
import Saklar from '@/components/ui/Saklar'
import IkonBerkas from '@/components/dokumen/IkonBerkas'
import Icon from '@/components/ui/Icon'
import { BATAS_BERKAS_MB, GAYA_INPUT, KATEGORI_DOKUMEN } from '@/config/dokumenAdmin'
import { ekstensiBerkas, naikkanVersi, validasiBerkas, validasiDokumen } from '@/utils/dokumen'

const ID_FORM = 'form-dokumen'

// Edit data dokumen. Boleh mengganti berkas (revisi baru): versi otomatis naik.
export default function DokumenFormModal({ dok, onSimpan, onTutup }) {
  const [isi, setIsi] = useState(dok)
  const [berkasBaru, setBerkasBaru] = useState(null)
  const [error, setError] = useState({})

  const ubah = (kunci, nilai) => setIsi((s) => ({ ...s, [kunci]: nilai }))

  function pilihBerkas(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const pesan = validasiBerkas(file)
    if (pesan) return setError((s) => ({ ...s, berkas: pesan }))
    setError((s) => ({ ...s, berkas: undefined }))
    setBerkasBaru(file)
    setIsi((s) => ({ ...s, tipe: ekstensiBerkas(file), ukuranBytes: file.size, versi: naikkanVersi(dok.versi) }))
  }

  function kirim(e) {
    e.preventDefault()
    const hasil = validasiDokumen(isi)
    setError(hasil)
    if (Object.keys(hasil).length) return
    const baru = { ...isi, nama: isi.nama.trim(), deskripsi: isi.deskripsi.trim(), versi: isi.versi.trim() }
    // TODO: kirim berkasBaru lewat upload.service.js, simpan url dari server.
    if (berkasBaru) Object.assign(baru, { url: URL.createObjectURL(berkasBaru), diunggah: new Date().toISOString() })
    onSimpan(baru)
  }

  return (
    <ModalDialog
      judul="Edit Dokumen"
      onTutup={onTutup}
      footer={
        <>
          <button type="button" onClick={onTutup} className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container">
            Batal
          </button>
          <button type="submit" form={ID_FORM} className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95">
            Simpan Perubahan
          </button>
        </>
      }
    >
      <form id={ID_FORM} onSubmit={kirim} noValidate className="space-y-4">
        <KolomForm id="edit-judul" label="Judul dokumen publik" error={error.judul}>
          <input
            id="edit-judul"
            type="text"
            value={isi.nama}
            onChange={(e) => ubah('nama', e.target.value)}
            aria-invalid={Boolean(error.judul)}
            aria-describedby={error.judul ? 'edit-judul-error' : undefined}
            className={GAYA_INPUT}
          />
        </KolomForm>

        <div className="grid gap-4 sm:grid-cols-2">
          <KolomForm id="edit-kategori" label="Kategori">
            <select id="edit-kategori" value={isi.kategori} onChange={(e) => ubah('kategori', e.target.value)} className={GAYA_INPUT}>
              {KATEGORI_DOKUMEN.map((k) => <option key={k}>{k}</option>)}
            </select>
          </KolomForm>
          <KolomForm id="edit-versi" label="Versi">
            <input id="edit-versi" type="text" value={isi.versi} onChange={(e) => ubah('versi', e.target.value)} className={GAYA_INPUT} />
          </KolomForm>
        </div>

        <KolomForm id="edit-deskripsi" label="Deskripsi singkat">
          <textarea id="edit-deskripsi" rows={3} maxLength={200} value={isi.deskripsi} onChange={(e) => ubah('deskripsi', e.target.value)} className={GAYA_INPUT} />
        </KolomForm>

        <KolomForm id="edit-berkas" label="Berkas" error={error.berkas} bantuan={`Pilih berkas baru untuk membuat revisi. PDF, DOCX, atau XLSX, maksimal ${BATAS_BERKAS_MB} MB.`}>
          <div className="flex items-center gap-4">
            <IkonBerkas tipe={isi.tipe} />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-semibold text-primary">{berkasBaru ? berkasBaru.name : `${dok.nama}.${dok.tipe}`}</p>
              {berkasBaru && <p className="text-xs text-secondary">Revisi baru, versi menjadi {isi.versi}</p>}
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border-muted bg-surface-white px-3 py-2 text-sm font-semibold text-primary hover:bg-surface-light focus-within:ring-2 focus-within:ring-secondary/30">
              <Icon name="upload" className="text-[18px]" />
              Ganti berkas
              <input id="edit-berkas" type="file" accept=".pdf,.docx,.xlsx" onChange={pilihBerkas} className="sr-only" />
            </label>
          </div>
        </KolomForm>

        <div className="flex items-center gap-3">
          <Saklar aktif={isi.aktif} onUbah={(v) => ubah('aktif', v)} label="Tampilkan di portal publik dan SIS" />
          <span className="text-sm font-medium text-on-surface">{isi.aktif ? 'Aktif di portal publik & SIS' : 'Nonaktif (disembunyikan)'}</span>
        </div>
      </form>
    </ModalDialog>
  )
}
