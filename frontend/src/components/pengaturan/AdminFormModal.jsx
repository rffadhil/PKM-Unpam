import { useRef, useState } from 'react'
import ModalDialog from '@/components/ui/ModalDialog'
import KolomForm from '@/components/ui/KolomForm'
import { FORMAT_FOTO, GAYA_INPUT, NOMOR_PENGGUNA } from '@/config/pengaturanAdmin'
import { adminKosong, inisialAdmin, validasiAdmin, validasiAset } from '@/utils/pengaturan'

const ID_FORM = 'form-admin'

// Tambah / edit admin. Peran tidak dipilih di form: akun baru = Sub Admin.
// Status aktif diatur lewat checkbox (dikunci untuk akun sendiri). Foto profil bersifat opsional.
export default function AdminFormModal({ admin, saya, galat, onSimpan, onTutup }) {
  const baru = !admin
  const [isi, setIsi] = useState(admin ? { ...admin, foto: admin.foto ?? '', sandi: '' } : adminKosong())
  const [error, setError] = useState({})
  const berkasRef = useRef(null)

  const ubah = (kunci, nilai) => setIsi((s) => ({ ...s, [kunci]: nilai }))
  const input = (kunci) => ({
    id: `admin-${kunci}`,
    value: isi[kunci],
    onChange: (e) => ubah(kunci, e.target.value),
    'aria-invalid': Boolean(error[kunci]),
    'aria-describedby': error[kunci] ? `admin-${kunci}-error` : undefined,
    className: GAYA_INPUT,
  })

  function pilihFoto(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const pesan = validasiAset(file, FORMAT_FOTO)
    setError((s) => ({ ...s, foto: pesan || undefined }))
    if (pesan) return
    // TODO: kirim ke upload.service.js, simpan URL hasilnya (bukan object URL).
    ubah('foto', URL.createObjectURL(file))
  }

  function hapusFoto() {
    ubah('foto', '')
    setError((s) => ({ ...s, foto: undefined }))
  }

  function kirim(e) {
    e.preventDefault()
    const hasil = validasiAdmin(isi, { baru })
    setError(hasil)
    if (Object.keys(hasil).length) return
    // Kata sandi tidak disimpan di state daftar. TODO: kirim ke POST /api/admin, hash di server.
    const { sandi, ...data } = isi
    onSimpan({ ...data, nama: data.nama.trim(), nomor: data.nomor.trim(), email: data.email.trim() }, sandi)
  }

  return (
    <ModalDialog
      judul={baru ? 'Tambah Admin Baru' : 'Edit Admin'}
      onTutup={onTutup}
      footer={
        <>
          <button type="button" onClick={onTutup} className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container">
            Batal
          </button>
          <button type="submit" form={ID_FORM} className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95">
            {baru ? 'Buat Akun Admin' : 'Simpan Perubahan'}
          </button>
        </>
      }
    >
      <form id={ID_FORM} onSubmit={kirim} noValidate className="space-y-4">
        {galat && <p role="alert" className="rounded-lg bg-error-container px-3 py-2 text-sm font-medium text-on-error-container">{galat}</p>}

        {/* Foto profil */}
        <div>
          <p className="mb-1.5 text-sm font-semibold text-on-surface">Foto profil</p>
          <div className="flex items-center gap-4">
            {isi.foto ? (
              <img src={isi.foto} alt={`Foto ${isi.nama || 'admin'}`} className="h-20 w-20 shrink-0 rounded-full border border-border-muted object-cover" />
            ) : (
              <span aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-xl font-bold text-primary">
                {inisialAdmin(isi.nama)}
              </span>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => berkasRef.current?.click()}
                  className="rounded-lg border border-border-muted bg-surface-white px-3.5 py-2 text-sm font-semibold text-primary hover:bg-surface-light"
                >
                  {isi.foto ? 'Ganti Foto' : 'Unggah Foto'}
                </button>
                {isi.foto && (
                  <button type="button" onClick={hapusFoto} className="rounded-lg px-3.5 py-2 text-sm font-semibold text-error hover:bg-error-container">
                    Hapus Foto
                  </button>
                )}
              </div>
              <p className="mt-1.5 text-xs text-text-muted">Format {FORMAT_FOTO.join(', ').toUpperCase()}. Maksimum 2MB.</p>
              {error.foto && <p role="alert" className="mt-1 text-xs font-medium text-error">{error.foto}</p>}
            </div>
            <input
              ref={berkasRef}
              type="file"
              accept={FORMAT_FOTO.map((f) => `.${f}`).join(',')}
              onChange={pilihFoto}
              className="hidden"
              aria-label="Pilih berkas foto profil"
            />
          </div>
        </div>

        <KolomForm id="admin-nama" label="Nama lengkap (beserta gelar)" error={error.nama}>
          <input type="text" {...input('nama')} />
        </KolomForm>

        <div className="grid gap-4 sm:grid-cols-3">
          <KolomForm id="admin-tipeNomor" label="Jenis nomor">
            <select {...input('tipeNomor')}>{NOMOR_PENGGUNA.map((t) => <option key={t}>{t}</option>)}</select>
          </KolomForm>
          <div className="sm:col-span-2">
            <KolomForm id="admin-nomor" label={`Nomor ${isi.tipeNomor}`} error={error.nomor}>
              <input type="text" inputMode="numeric" {...input('nomor')} />
            </KolomForm>
          </div>
        </div>

        <KolomForm id="admin-email" label="Email institusi (untuk login)" error={error.email}>
          <input type="email" {...input('email')} />
        </KolomForm>

        {baru && (
          <>
            <KolomForm id="admin-sandi" label="Kata sandi sementara" error={error.sandi} bantuan="Minimal 8 karakter, kombinasi huruf dan angka. Pengguna wajib menggantinya saat login pertama.">
              <input type="password" autoComplete="new-password" {...input('sandi')} />
            </KolomForm>
            <p className="rounded-lg bg-surface-container px-3 py-2 text-xs text-text-muted">
              Akun baru otomatis dibuat sebagai <strong className="text-primary">Sub Admin</strong>.
            </p>
          </>
        )}

        <div>
          <label className={`flex items-center gap-2.5 text-sm font-medium ${saya ? 'text-text-muted' : 'text-on-surface'}`}>
            <input
              type="checkbox"
              checked={isi.aktif}
              disabled={saya}
              onChange={(e) => ubah('aktif', e.target.checked)}
              className="h-4 w-4 rounded border-border-muted text-secondary focus:ring-secondary"
            />
            Akun aktif (boleh login ke CMS)
          </label>
          {saya && <p className="mt-1 text-xs text-text-muted">Status akun Anda sendiri tidak dapat diubah.</p>}
        </div>
      </form>
    </ModalDialog>
  )
}