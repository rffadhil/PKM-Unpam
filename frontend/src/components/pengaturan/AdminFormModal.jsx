import { useState } from 'react'
import ModalDialog from '@/components/ui/ModalDialog'
import KolomForm from '@/components/ui/KolomForm'
import { GAYA_INPUT, NOMOR_PENGGUNA, ROLE_ADMIN } from '@/config/pengaturanAdmin'
import { adminKosong, validasiAdmin } from '@/utils/pengaturan'

const ID_FORM = 'form-admin'

// Tambah / edit admin. `saya` = akun sendiri: peran dan status dikunci agar tidak mengunci diri.
export default function AdminFormModal({ admin, saya, galat, onSimpan, onTutup }) {
  const baru = !admin
  const [isi, setIsi] = useState(admin ? { ...admin, sandi: '' } : adminKosong())
  const [error, setError] = useState({})

  const ubah = (kunci, nilai) => setIsi((s) => ({ ...s, [kunci]: nilai }))
  const input = (kunci) => ({
    id: `admin-${kunci}`,
    value: isi[kunci],
    onChange: (e) => ubah(kunci, e.target.value),
    'aria-invalid': Boolean(error[kunci]),
    'aria-describedby': error[kunci] ? `admin-${kunci}-error` : undefined,
    className: GAYA_INPUT,
  })

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

        <KolomForm id="admin-role" label="Peran / Role (RBAC)" bantuan={saya ? 'Peran akun Anda sendiri tidak dapat diubah.' : undefined}>
          <select {...input('role')} disabled={saya}>{ROLE_ADMIN.map((r) => <option key={r.kunci} value={r.kunci}>{r.label}</option>)}</select>
        </KolomForm>

        {baru && (
          <KolomForm id="admin-sandi" label="Kata sandi sementara" error={error.sandi} bantuan="Minimal 8 karakter, kombinasi huruf dan angka. Pengguna wajib menggantinya saat login pertama.">
            <input type="password" autoComplete="new-password" {...input('sandi')} />
          </KolomForm>
        )}

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
      </form>
    </ModalDialog>
  )
}
