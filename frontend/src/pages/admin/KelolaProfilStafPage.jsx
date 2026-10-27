import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import StafToolbar from '@/components/staf/StafToolbar'
import StafTable from '@/components/staf/StafTable'
import StafFormModal from '@/components/staf/StafFormModal'
import StafDetailModal from '@/components/staf/StafDetailModal'
import ProfilSambutan from '@/components/staf/ProfilSambutan'
import { mockProfil, mockStaf } from '@/mocks/adminStaf'
import { FILTER_STAF_AWAL, JABATAN_KEPALA, STAF_PER_HALAMAN } from '@/config/stafAdmin'
import { saringPtk, urutkanPtk } from '@/utils/ptk'

// Profil & Staf: perakit layout + state. Kata kunci topbar digabung dengan kolom cari di filter.
// TODO: ganti state lokal dengan service ke API (/api/staf, /api/pengaturan-sekolah),
// pola sama dengan hooks/useBerita.js.
export default function KelolaProfilStafPage() {
  const { pencarian: cariTopbar = '' } = useOutletContext() ?? {}
  const [data, setData] = useState(mockStaf)
  const [filter, setFilter] = useState(FILTER_STAF_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [terpilih, setTerpilih] = useState([])
  const [modalForm, setModalForm] = useState(null) // { item } | null
  const [detail, setDetail] = useState(null)
  const [akanDihapus, setAkanDihapus] = useState(null) // staf | 'terpilih' | null
  const [profil, setProfil] = useState(mockProfil)
  const [profilTersimpan, setProfilTersimpan] = useState(mockProfil)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4500)
    return () => clearTimeout(t)
  }, [notice])

  const hasil = useMemo(
    () => urutkanPtk(saringPtk(data, { ...filter, kata: filter.kata || cariTopbar })),
    [data, filter, cariTopbar],
  )
  const jumlahHalaman = Math.max(1, Math.ceil(hasil.length / STAF_PER_HALAMAN))
  const halamanAman = Math.min(halaman, jumlahHalaman)
  const items = hasil.slice((halamanAman - 1) * STAF_PER_HALAMAN, halamanAman * STAF_PER_HALAMAN)

  const adaFilter = Boolean(filter.kata || filter.rumpun || filter.status)
  const kepala = data.find((s) => s.jabatan === JABATAN_KEPALA)
  const profilBerubah = profil.sambutan !== profilTersimpan.sambutan || profil.visi !== profilTersimpan.visi

  function terapkanFilter(nilai) {
    setFilter(nilai)
    setHalaman(1)
  }

  function simpan(staf) {
    if (staf.id) {
      setData((d) => d.map((s) => (s.id === staf.id ? staf : s)))
      setNotice('Data pendidik/staf berhasil diperbarui.')
    } else {
      setData((d) => [{ ...staf, id: Date.now() }, ...d])
      setNotice('Pendidik/staf baru berhasil ditambahkan.')
    }
    setModalForm(null)
    setDetail(null)
  }

  function ubahTampil(id, tampil) {
    setData((d) => d.map((s) => (s.id === id ? { ...s, tampil } : s)))
  }

  function pilih(id) {
    setTerpilih((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]))
  }

  function pilihSemua(centang) {
    const idHalaman = items.map((s) => s.id)
    setTerpilih((t) => (centang ? [...new Set([...t, ...idHalaman])] : t.filter((id) => !idHalaman.includes(id))))
  }

  function konfirmasiHapus() {
    if (akanDihapus === 'terpilih') {
      setData((d) => d.filter((s) => !terpilih.includes(s.id)))
      setNotice(`${terpilih.length} data dihapus.`)
      setTerpilih([])
    } else {
      setData((d) => d.filter((s) => s.id !== akanDihapus.id))
      setTerpilih((t) => t.filter((id) => id !== akanDihapus.id))
      setNotice('Data pendidik/staf dihapus.')
    }
    setAkanDihapus(null)
  }

  function simpanProfil() {
    // TODO: PUT /api/pengaturan-sekolah (kunci: sambutan_kepsek, visi)
    setProfilTersimpan(profil)
    setNotice('Sambutan dan visi berhasil disimpan dan ditayangkan.')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <StafToolbar
        filter={filter}
        onFilter={terapkanFilter}
        onReset={() => terapkanFilter(FILTER_STAF_AWAL)}
        adaFilter={adaFilter}
        onTambah={() => setModalForm({ item: null })}
      />

      {notice && (
        <p role="status" className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark">
          {notice}
        </p>
      )}

      <StafTable
        items={items}
        total={hasil.length}
        totalTerverifikasi={data.length}
        halaman={halamanAman}
        jumlahHalaman={jumlahHalaman}
        perHalaman={STAF_PER_HALAMAN}
        terpilih={terpilih}
        onPilih={pilih}
        onPilihSemua={pilihSemua}
        onHapusTerpilih={() => setAkanDihapus('terpilih')}
        onHalaman={(n) => setHalaman(Math.min(Math.max(1, n), jumlahHalaman))}
        onTampil={ubahTampil}
        onLihat={setDetail}
        onEdit={(item) => setModalForm({ item })}
        onHapus={setAkanDihapus}
      />

      <ProfilSambutan
        nilai={profil}
        penulis={kepala?.nama}
        berubah={profilBerubah}
        onUbah={(kunci, v) => setProfil((p) => ({ ...p, [kunci]: v }))}
        onSimpan={simpanProfil}
      />

      {modalForm && <StafFormModal item={modalForm.item} onSimpan={simpan} onTutup={() => setModalForm(null)} />}

      {detail && !modalForm && (
        <StafDetailModal staf={detail} onEdit={(item) => setModalForm({ item })} onTutup={() => setDetail(null)} />
      )}

      {akanDihapus && (
        <ConfirmDialog
          judul={akanDihapus === 'terpilih' ? `Hapus ${terpilih.length} data terpilih?` : 'Hapus data ini?'}
          pesan={
            akanDihapus === 'terpilih'
              ? 'Semua data yang dipilih akan dihapus dan tidak tampil lagi di portal.'
              : `“${akanDihapus.nama}” akan dihapus dan tidak tampil lagi di portal.`
          }
          labelKonfirmasi={akanDihapus === 'terpilih' ? `Hapus ${terpilih.length}` : 'Hapus'}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}
    </div>
  )
}
