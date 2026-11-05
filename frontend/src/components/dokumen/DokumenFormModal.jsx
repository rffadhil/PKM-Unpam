import { useState } from 'react'
import ModalDialog from '@/components/ui/ModalDialog'
import KolomForm from '@/components/ui/KolomForm'
import Saklar from '@/components/ui/Saklar'
import IkonBerkas from '@/components/dokumen/IkonBerkas'
import Icon from '@/components/ui/Icon'
import { BATAS_BERKAS_MB, GAYA_INPUT, KATEGORI_DOKUMEN } from '@/config/dokumenAdmin'
import {ekstensiBerkas, validasiBerkas, validasiDokumenEdit,} from '@/utils/dokumen';

const ID_FORM = 'form-dokumen'

export default function DokumenFormModal({ dok, onSimpan, onTutup }) {
  const [isi, setIsi] = useState({
    ...dok,
    nama: dok.nama || '',
    kategori: dok.kategori || 'Umum & Siswa',
    deskripsi: dok.deskripsi || '',
    aktif: Boolean(dok.aktif),
  })

  const [berkasBaru, setBerkasBaru] = useState(null)
  const [error, setError] = useState({})
  const [pesanError, setPesanError] = useState('')
  const [menyimpan, setMenyimpan] = useState(false)

  const ubah = (kunci, nilai) => {
    setIsi((s) => ({ ...s, [kunci]: nilai }))
  }

  function pilihBerkas(e) {
    const file = e.target.files?.[0]
    e.target.value = ''

    if (!file) return

    const pesan = validasiBerkas(file)

    if (pesan) {
      setError((s) => ({ ...s, berkas: pesan }))
      return
    }

    setError((s) => ({ ...s, berkas: '' }))
    setBerkasBaru(file)
  }

  async function kirim(e) {
    e.preventDefault()

    if (menyimpan) return

    const hasil = validasiDokumenEdit(isi);
    setError(hasil)
    setPesanError('')

    if (Object.keys(hasil).length > 0) return

    try {
      setMenyimpan(true)

      await onSimpan({
        ...isi,
        nama: isi.nama.trim(),
        deskripsi: isi.deskripsi.trim(),
        berkas: berkasBaru,
      })
    } catch (err) {
      setPesanError(err.message || 'Dokumen gagal diperbarui.')
    } finally {
      setMenyimpan(false)
    }
  }

  const namaBerkas = berkasBaru
    ? berkasBaru.name
    : `${dok.nama}.${dok.tipe}`

  return (
    <ModalDialog
      judul="Edit Dokumen"
      onTutup={menyimpan ? undefined : onTutup}
      footer={
        <>
          <button
            type="button"
            onClick={onTutup}
            disabled={menyimpan}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="submit"
            form={ID_FORM}
            disabled={menyimpan}
            className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {menyimpan ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </>
      }
    >
      <form
        id={ID_FORM}
        onSubmit={kirim}
        noValidate
        className="space-y-4"
      >
        {pesanError && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {pesanError}
          </p>
        )}

        <KolomForm
          id="edit-judul"
          label="Judul dokumen publik"
          error={error.nama}
        >
          <input
            id="edit-judul"
            type="text"
            value={isi.nama}
            onChange={(e) => ubah('nama', e.target.value)}
            aria-invalid={Boolean(error.nama)}
            className={GAYA_INPUT}
          />
        </KolomForm>

        <KolomForm id="edit-kategori" label="Kategori">
          <select
            id="edit-kategori"
            value={isi.kategori}
            onChange={(e) => ubah('kategori', e.target.value)}
            className={GAYA_INPUT}
          >
            {KATEGORI_DOKUMEN.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </KolomForm>

        <KolomForm id="edit-deskripsi" label="Deskripsi singkat">
          <textarea
            id="edit-deskripsi"
            rows={3}
            maxLength={200}
            value={isi.deskripsi}
            onChange={(e) => ubah('deskripsi', e.target.value)}
            className={GAYA_INPUT}
          />
        </KolomForm>

        <KolomForm
          id="edit-berkas"
          label="Berkas"
          error={error.berkas}
          bantuan={`Pilih berkas baru jika ingin mengganti file. PDF, DOCX, atau XLSX, maksimal ${BATAS_BERKAS_MB} MB.`}
        >
          <div className="flex items-center gap-4">
            <IkonBerkas
              tipe={berkasBaru ? ekstensiBerkas(berkasBaru) : dok.tipe}
            />

            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-semibold text-primary">
                {namaBerkas}
              </p>
              {berkasBaru && (
                <p className="text-xs text-secondary">
                  File baru dipilih
                </p>
              )}
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border-muted bg-surface-white px-3 py-2 text-sm font-semibold text-primary hover:bg-surface-light">
              <Icon name="upload" className="text-[18px]" />
              Ganti berkas
              <input
                id="edit-berkas"
                type="file"
                accept=".pdf,.docx,.xlsx"
                onChange={pilihBerkas}
                className="sr-only"
              />
            </label>
          </div>
        </KolomForm>

        <div className="flex items-center gap-3">
          <Saklar
            aktif={isi.aktif}
            onUbah={(v) => ubah('aktif', v)}
            label="Tampilkan di portal publik dan SIS"
          />
          <span className="text-sm font-medium text-on-surface">
            {isi.aktif
              ? 'Aktif di portal publik & SIS'
              : 'Nonaktif (disembunyikan)'}
          </span>
        </div>
      </form>
    </ModalDialog>
  )
}