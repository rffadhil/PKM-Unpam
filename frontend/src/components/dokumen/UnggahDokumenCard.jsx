import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import Saklar from '@/components/ui/Saklar'
import KolomForm from '@/components/ui/KolomForm'
import ZonaUnggah from '@/components/dokumen/ZonaUnggah'
import { GAYA_INPUT, KATEGORI_DOKUMEN } from '@/config/dokumenAdmin'
import { judulDariBerkas, validasiBerkas, validasiDokumen } from '@/utils/dokumen'

const AWAL = { judul: '', kategori: KATEGORI_DOKUMEN[0], deskripsi: '', aktif: true }

// Kartu "Unggah Template Dokumen Baru". Form dipegang di sini; hasilnya dikirim lewat onUnggah.
export default function UnggahDokumenCard({ onUnggah }) {
  const [berkas, setBerkas] = useState(null)
  const [isi, setIsi] = useState(AWAL)
  const [error, setError] = useState({})

  const ubah = (kunci, nilai) => setIsi((s) => ({ ...s, [kunci]: nilai }))

  function pilihBerkas(file) {
    const pesan = validasiBerkas(file)
    if (pesan) {
      setBerkas(null)
      return setError((s) => ({ ...s, berkas: pesan }))
    }
    setError((s) => ({ ...s, berkas: undefined }))
    setBerkas(file)
    setIsi((s) => (s.judul ? s : { ...s, judul: judulDariBerkas(file.name) }))
  }
  
  async function kirim(e) {e.preventDefault()
    const hasil = validasiDokumen(isi)
    
    if (!berkas && !error.berkas) {
      hasil.berkas = 'Pilih berkas template terlebih dulu.'
    }
    
    if (error.berkas) {
    hasil.berkas = error.berkas
    }

    setError(hasil)
    
    if (Object.keys(hasil).length) return

    try {
      await onUnggah({
        berkas,
       ...isi,
        judul: isi.judul.trim(),
       deskripsi: isi.deskripsi.trim(),
      })

      // Formulir dikosongkan hanya jika unggah berhasil
      setBerkas(null)
      setIsi(AWAL)
      setError({})
    } catch (err) {
      setError((s) => ({
        ...s,
        berkas: err.message || 'Gagal mengunggah dokumen.',
      }))
    }
  }


  return (
    <section className="rounded-2xl border border-border-muted bg-surface-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border-muted pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-container text-cta-gold">
            <Icon name="upload_file" className="text-[26px]" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-primary">Unggah Template Dokumen Baru</h2>
            <p className="text-body-sm text-text-muted">
              Publikasikan surat resmi, panduan teknis, dan formulir PPDB ke web publik dan portal siswa
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center self-start rounded-full border border-border-muted bg-surface-light px-4 py-1.5 text-xs font-bold text-secondary md:self-auto">
          Cloud Repository: Google Workspace for Education
        </span>
      </div>

      <form onSubmit={kirim} noValidate className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="mb-1.5 text-sm font-semibold text-primary">
            Berkas Dokumen Template <span className="text-error">*</span>
          </p>
          <ZonaUnggah berkas={berkas} error={error.berkas} onPilih={pilihBerkas} onHapus={() => setBerkas(null)} />
        </div>

        <div className="space-y-4 lg:col-span-3">
          <div className="grid gap-4 sm:grid-cols-5">
            <div className="sm:col-span-3">
              <KolomForm id="dokumen-judul" label="Judul Dokumen Publik *" error={error.judul}>
                <input
                  id="dokumen-judul"
                  type="text"
                  value={isi.judul}
                  onChange={(e) => ubah('judul', e.target.value)}
                  placeholder="Contoh: Formulir Pendaftaran Ulang"
                  aria-invalid={Boolean(error.judul)}
                  aria-describedby={error.judul ? 'dokumen-judul-error' : undefined}
                  className={GAYA_INPUT}
                />
              </KolomForm>
            </div>
            <div className="sm:col-span-2">
              <KolomForm id="dokumen-kategori" label="Kategori / Posisi Tampil *">
                <select id="dokumen-kategori" value={isi.kategori} onChange={(e) => ubah('kategori', e.target.value)} className={GAYA_INPUT}>
                  {KATEGORI_DOKUMEN.map((k) => <option key={k}>{k}</option>)}
                </select>
              </KolomForm>
            </div>
          </div>

          <KolomForm id="dokumen-deskripsi" label="Deskripsi Singkat Dokumen">
            <textarea
              id="dokumen-deskripsi"
              rows={3}
              maxLength={200}
              value={isi.deskripsi}
              onChange={(e) => ubah('deskripsi', e.target.value)}
              placeholder="Jelaskan isi dan kegunaan dokumen ini"
              className={GAYA_INPUT}
            />
          </KolomForm>

          <div className="flex flex-col gap-4 border-t border-border-muted pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Saklar aktif={isi.aktif} onUbah={(v) => ubah('aktif', v)} label="Tampilkan langsung di tombol Download Dokumen" />
              <div className="text-sm">
                <p className="font-semibold text-primary">Tampilkan Langsung di Tombol &quot;Download Dokumen&quot;</p>
                <p className="text-text-muted">
                  Status:{' '}
                  <strong className={isi.aktif ? 'text-secondary' : 'text-on-surface'}>
                    {isi.aktif ? 'Aktif di Portal Publik & SIS' : 'Disimpan sebagai nonaktif'}
                  </strong>
                </p>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cta-gold px-6 py-3 text-sm font-bold text-primary shadow-sm transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Icon name="add_circle" className="text-[20px]" />
              {isi.aktif ? 'Unggah & Publikasikan ke Portal' : 'Unggah & Simpan (Nonaktif)'}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
