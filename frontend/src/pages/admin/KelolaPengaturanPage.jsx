import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import IdentitasSekolahForm from '@/components/pengaturan/IdentitasSekolahForm'
import KontakFooterForm from '@/components/pengaturan/KontakFooterForm'
import PortalStatusPanel from '@/components/pengaturan/PortalStatusPanel'
import AdminAksesPanel from '@/components/pengaturan/AdminAksesPanel'
import AdminFormModal from '@/components/pengaturan/AdminFormModal'
import SesiAdminPanel from '@/components/pengaturan/SesiAdminPanel'
import BarSimpan from '@/components/pengaturan/BarSimpan'

import { adminUser } from '@/mocks/admin'
import { mockAdmin, mockPengaturan, mockSesi } from '@/mocks/adminPengaturan'
import { BAGIAN_PER_PERAN, FORMAT_FAVICON, FORMAT_LOGO, KATA_BAGIAN, ROLE_ADMIN } from '@/config/pengaturanAdmin'
import { adalahSuperAdmin, samaIsi, validasiAset, validasiPengaturan } from '@/utils/pengaturan'

// Pengaturan Sistem & Portal Sekolah. Bagian yang tampil tergantung peran (lihat BAGIAN_PER_PERAN):
// - superadmin: identitas, kontak, mode pemeliharaan & PPDB, kelola semua admin
// - subadmin: identitas, kontak, dan sesinya sendiri
// Isian identitas/kontak/status portal = "draf" yang baru berlaku setelah klik Simpan.
// Daftar admin langsung berlaku saat disimpan di modalnya.
// TODO: ganti state lokal dengan service ke API (/api/pengaturan, /api/admin) dan ambil peran dari login.
export default function KelolaPengaturanPage() {
  const { pencarian = '' } = useOutletContext() ?? {}
  // `peran` dari login (sementara dari mock `adminUser.peran` di src/mocks/admin.js).
  const peran = adalahSuperAdmin(adminUser.peran) ? 'superadmin' : 'subadmin'
  const adalahSuper = peran === 'superadmin'

  const [tersimpan, setTersimpan] = useState(mockPengaturan)
  const [draf, setDraf] = useState(mockPengaturan)
  const [error, setError] = useState({})
  const [admin, setAdmin] = useState(mockAdmin)
  const [modalAdmin, setModalAdmin] = useState(null) // { item } | null
  const [galatAdmin, setGalatAdmin] = useState('')
  const [akanDihapus, setAkanDihapus] = useState(null)
  const [konfirmasiPemeliharaan, setKonfirmasiPemeliharaan] = useState(false)
  const [notice, setNotice] = useState('')

  // Akun yang sedang dipakai (sementara: akun pertama = super admin, kedua = sub admin).
  const akunSaya = mockAdmin.find((a) => a.role === peran) ?? mockAdmin[0]
  const sesi = {
    ...mockSesi,
    nama: akunSaya.nama,
    peran: ROLE_ADMIN.find((r) => r.kunci === peran)?.label ?? peran,
  }

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4500)
    return () => clearTimeout(t)
  }, [notice])

  const berubah = !samaIsi(draf, tersimpan)
  const kata = pencarian.trim().toLowerCase()
  const bagian = BAGIAN_PER_PERAN[peran].filter((b) => !kata || KATA_BAGIAN[b].includes(kata))

  function ubah(kunci, nilai) {
    // Mode pemeliharaan & PPDB hanya boleh diubah Super Admin.
    if ((kunci === 'maintenance' || kunci === 'ppdb') && !adalahSuper) return
    if (kunci === 'maintenance' && nilai) return setKonfirmasiPemeliharaan(true)
    setDraf((d) => ({ ...d, [kunci]: nilai }))
  }

  function gantiAset(kunci, file) {
    const pesan = validasiAset(file, kunci === 'logo' ? FORMAT_LOGO : FORMAT_FAVICON)
    setError((e) => ({ ...e, [kunci]: pesan || undefined }))
    if (pesan) return
    // TODO: kirim ke upload.service.js, simpan URL hasilnya (bukan object URL).
    setDraf((d) => ({ ...d, [kunci]: URL.createObjectURL(file), [`${kunci}Nama`]: file.name }))
  }

  function simpanPengaturan() {
    const hasil = validasiPengaturan(draf)
    setError(hasil)
    if (Object.keys(hasil).length) return setNotice('Periksa kembali isian yang ditandai merah.')
    // TODO: PUT /api/pengaturan
    setTersimpan(draf)
    setNotice('Pengaturan berhasil disimpan dan diterapkan ke portal.')
  }

  function batalkan() {
    setDraf(tersimpan)
    setError({})
  }

  function simpanAdmin(data) {
    if (!adalahSuper) return
    const daftarBaru = data.id ? admin.map((a) => (a.id === data.id ? data : a)) : [...admin, { ...data, id: Date.now() }]
    if (!daftarBaru.some((a) => a.role === 'superadmin' && a.aktif)) {
      return setGalatAdmin('Harus ada minimal satu Super Admin yang aktif.')
    }
    // TODO: POST/PUT /api/admin (kirim kata sandi sementara, hash di server)
    setAdmin(daftarBaru)
    setModalAdmin(null)
    setGalatAdmin('')
    setNotice(data.id ? 'Data admin diperbarui.' : 'Akun admin baru dibuat.')
  }

  function konfirmasiHapus() {
    if (!adalahSuper) return
    // TODO: DELETE /api/admin/:id
    setAdmin((d) => d.filter((a) => a.id !== akanDihapus.id))
    setAkanDihapus(null)
    setNotice('Akun admin dihapus.')
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-6">
      {notice && (
        <p role="status" className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark">
          {notice}
        </p>
      )}

      {bagian.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border-muted bg-surface-white p-10 text-center text-text-muted">
          Tidak ada pengaturan yang cocok dengan “{pencarian}”.
        </p>
      )}

      {bagian.includes('identitas') && (
        <IdentitasSekolahForm nilai={draf} error={error} onUbah={ubah} onGantiAset={gantiAset} />
      )}
      {bagian.includes('kontak') && <KontakFooterForm nilai={draf} error={error} onUbah={ubah} />}

      {/* Khusus Super Admin */}
      {adalahSuper && bagian.includes('portal') && <PortalStatusPanel nilai={draf} onUbah={ubah} />}
      {adalahSuper && bagian.includes('akses') && (
        <AdminAksesPanel
          daftar={admin}
          idSaya={akunSaya.id}
          onTambah={() => { setGalatAdmin(''); setModalAdmin({ item: null }) }}
          onEdit={(item) => { setGalatAdmin(''); setModalAdmin({ item }) }}
          onHapus={setAkanDihapus}
        />
      )}

      {/* Khusus Sub Admin */}
      {!adalahSuper && bagian.includes('sesi') && <SesiAdminPanel sesi={sesi} />}

      <BarSimpan berubah={berubah} onBatal={batalkan} onSimpan={simpanPengaturan} />

      {adalahSuper && modalAdmin && (
        <AdminFormModal
          admin={modalAdmin.item}
          galat={galatAdmin}
          onSimpan={simpanAdmin}
          onTutup={() => setModalAdmin(null)}
        />
      )}

      {adalahSuper && akanDihapus && (
        <ConfirmDialog
          judul="Hapus akun admin ini?"
          pesan={`Akun “${akanDihapus.nama}” akan dihapus dan tidak bisa login lagi. Untuk sementara, pertimbangkan menonaktifkan akun saja.`}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}

      {adalahSuper && konfirmasiPemeliharaan && (
        <ConfirmDialog
          judul="Aktifkan Mode Pemeliharaan?"
          pesan="Setelah Anda menyimpan, seluruh halaman publik akan diganti halaman pemberitahuan pemeliharaan. Akses CMS Admin tetap dapat dibuka."
          labelKonfirmasi="Aktifkan"
          ikon="build"
          onKonfirmasi={() => {
            setDraf((d) => ({ ...d, maintenance: true }))
            setKonfirmasiPemeliharaan(false)
          }}
          onBatal={() => setKonfirmasiPemeliharaan(false)}
        />
      )}
    </div>
  )
}