import { useState } from 'react'
import ModalDialog from '@/components/ui/ModalDialog'
import KolomForm from '@/components/ui/KolomForm'
import StafFoto from '@/components/staf/StafFoto'
import Icon from '@/components/ui/Icon'
import { BATAS_FOTO_MB, GAYA_INPUT, RUMPUN_PTK, STATUS_PEGAWAI, TIPE_NOMOR, TONE_RUMPUN } from '@/config/stafAdmin'
import { ptkKosong, validasiFoto, validasiPtk } from '@/utils/ptk'

const ID_FORM = 'form-staf'

// Form tambah / edit PTK. `item` null = baru.
export default function StafFormModal({ item, onSimpan, onTutup }) {
  const [isi, setIsi] = useState(item ?? ptkKosong())
  const [error, setError] = useState({})
  const baru = !item

  const ubah = (kunci, nilai) => setIsi((s) => ({ ...s, [kunci]: nilai }))
  const input = (kunci) => ({
    id: `staf-${kunci}`,
    value: isi[kunci],
    onChange: (e) => ubah(kunci, e.target.value),
    'aria-invalid': Boolean(error[kunci]),
    'aria-describedby': error[kunci] ? `staf-${kunci}-error` : undefined,
    className: GAYA_INPUT,
  })

  function ubahRumpun(rumpun) {
    setIsi((s) => ({ ...s, rumpun, tone: TONE_RUMPUN[rumpun] ?? 'abu' }))
  }

  function pilihFoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const pesan = validasiFoto(file)
    if (pesan) return setError((s) => ({ ...s, foto: pesan }))
    setError((s) => ({ ...s, foto: undefined }))
    // TODO: kirim ke upload.service.js, simpan URL hasilnya (bukan object URL).
    ubah('foto', URL.createObjectURL(file))
  }

  function kirim(e) {
    e.preventDefault()
    const hasil = validasiPtk(isi)
    setError(hasil)
    if (Object.keys(hasil).length) return
    onSimpan({
      ...isi,
      nama: isi.nama.trim(),
      nomor: isi.nomor.trim(),
      jabatan: isi.jabatan.trim(),
      bidang: isi.bidang.trim(),
      pendidikan: isi.pendidikan.trim(),
      kampus: isi.kampus.trim(),
      kepegawaian: isi.kepegawaian.trim(),
      urutan: Number(isi.urutan),
    })
  }

  return (
    <ModalDialog
      judul={baru ? 'Tambah Pendidik / Staf' : 'Edit Pendidik / Staf'}
      lebar="max-w-2xl"
      onTutup={onTutup}
      footer={
        <>
          <button type="button" onClick={onTutup} className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container">
            Batal
          </button>
          <button type="submit" form={ID_FORM} className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95">
            {baru ? 'Simpan Data' : 'Simpan Perubahan'}
          </button>
        </>
      }
    >
      <form id={ID_FORM} onSubmit={kirim} noValidate className="space-y-4">
        <KolomForm id="staf-nama" label="Nama lengkap (beserta gelar)" error={error.nama}>
          <input type="text" placeholder="Contoh: Dra. Hj. Siti Nurjanah, M.Si" {...input('nama')} />
        </KolomForm>

        <div className="grid gap-4 sm:grid-cols-3">
          <KolomForm id="staf-tipeNomor" label="Jenis nomor">
            <select {...input('tipeNomor')}>
              {TIPE_NOMOR.map((t) => <option key={t}>{t}</option>)}
            </select>
          </KolomForm>
          <div className="sm:col-span-2">
            <KolomForm id="staf-nomor" label={`Nomor ${isi.tipeNomor}`} error={error.nomor}>
              <input type="text" inputMode="numeric" placeholder="19680812 199403 1 004" {...input('nomor')} />
            </KolomForm>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <KolomForm id="staf-rumpun" label="Rumpun">
            <select id="staf-rumpun" value={isi.rumpun} onChange={(e) => ubahRumpun(e.target.value)} className={GAYA_INPUT}>
              {RUMPUN_PTK.map((r) => <option key={r}>{r}</option>)}
            </select>
          </KolomForm>
          <KolomForm id="staf-jabatan" label="Jabatan" error={error.jabatan}>
            <input type="text" placeholder="Contoh: Wakasek Kurikulum" {...input('jabatan')} />
          </KolomForm>
        </div>

        <KolomForm id="staf-bidang" label="Bidang / mata pelajaran">
          <input type="text" placeholder="Contoh: MIPA - Kimia Organik" {...input('bidang')} />
        </KolomForm>

        <div className="grid gap-4 sm:grid-cols-2">
          <KolomForm id="staf-pendidikan" label="Pendidikan terakhir">
            <input type="text" placeholder="Contoh: S2 Kimia Sains" {...input('pendidikan')} />
          </KolomForm>
          <KolomForm id="staf-kampus" label="Institusi">
            <input type="text" placeholder="Contoh: Institut Teknologi Bandung" {...input('kampus')} />
          </KolomForm>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <KolomForm id="staf-statusKepegawaian" label="Kelompok status">
            <select {...input('statusKepegawaian')}>
              {STATUS_PEGAWAI.map((s) => <option key={s.nilai} value={s.nilai}>{s.label}</option>)}
            </select>
          </KolomForm>
          <KolomForm id="staf-kepegawaian" label="Golongan / keterangan" error={error.kepegawaian}>
            <input type="text" placeholder="PNS Pembina" {...input('kepegawaian')} />
          </KolomForm>
          <KolomForm id="staf-urutan" label="Urutan tampil" error={error.urutan} bantuan="Angka kecil tampil lebih dulu.">
            <input type="number" min={1} {...input('urutan')} />
          </KolomForm>
        </div>

        <KolomForm id="staf-foto" label="Foto" error={error.foto} bantuan={`JPG, PNG, atau WebP. Maksimal ${BATAS_FOTO_MB} MB.`}>
          <div className="flex items-center gap-4">
            <StafFoto key={isi.foto} nama={isi.nama || 'Staf baru'} src={isi.foto} className="h-16 w-16 text-lg" />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border-muted bg-surface-white px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-light focus-within:ring-2 focus-within:ring-secondary/30">
              <Icon name="upload" className="text-[18px]" />
              {isi.foto ? 'Ganti foto' : 'Pilih foto'}
              <input id="staf-foto" type="file" accept="image/*" onChange={pilihFoto} className="sr-only" />
            </label>
          </div>
        </KolomForm>

        <label className="flex items-center gap-2.5 text-sm font-medium text-on-surface">
          <input
            type="checkbox"
            checked={isi.tampil}
            onChange={(e) => ubah('tampil', e.target.checked)}
            className="h-4 w-4 rounded border-border-muted text-secondary focus:ring-secondary"
          />
          Tampilkan di halaman profil publik
        </label>
      </form>
    </ModalDialog>
  )
}
