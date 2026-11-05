
import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import ConfirmDialog from '@/components/admin/ConfirmDialog'
import StafToolbar from '@/components/staf/StafToolbar'
import StafTable from '@/components/staf/StafTable'
import StafFormModal from '@/components/staf/StafFormModal'
import StafDetailModal from '@/components/staf/StafDetailModal'
import ProfilSambutan from '@/components/staf/ProfilSambutan'

import { mockProfil } from '@/mocks/adminStaf'

import {
  ambilSemuaStaf,
  tambahStaf,
  editStaf,
  hapusStaf,
} from '@/services/stafService'

import {
  FILTER_STAF_AWAL,
  JABATAN_KEPALA,
  STAF_PER_HALAMAN,
} from '@/config/stafAdmin'

import { saringPtk, urutkanPtk } from '@/utils/ptk'

// Mapping data backend ke format frontend.
function mapStafDariApi(staf) {
  return {
    ...staf,

    tipeNomor: 'NIP/NUPTK',
    nomor: staf.nip_nuptk ?? '',

    bidang: staf.mata_pelajaran ?? '',
    foto: staf.foto_url ?? '',
    tampil: staf.tampil_publik ?? false,

    pendidikan: staf.pendidikan_terakhir ?? '',
    kampus: staf.almamater ?? '',
    kepegawaian: staf.kepegawaian ?? '',
    statusKepegawaian: staf.status_kepegawaian ?? '',
  }
}

// Mapping data frontend ke format backend.
function mapStafKeApi(staf) {
  return {
    nama: staf.nama?.trim() ?? '',
    nip_nuptk: staf.nomor?.trim() || null,
    jabatan: staf.jabatan?.trim() ?? '',
    rumpun: staf.rumpun || null,
    mata_pelajaran: staf.bidang?.trim() || null,
    foto_url: staf.foto?.trim() || null,

    pendidikan_terakhir: staf.pendidikan?.trim() || null,
    almamater: staf.kampus?.trim() || null,
    status_kepegawaian: staf.statusKepegawaian || null,

    urutan: Number(staf.urutan ?? 0),
    tampil_publik: Boolean(staf.tampil),
  }
}

export default function KelolaProfilStafPage() {
  const { pencarian: cariTopbar = '' } = useOutletContext() ?? {}

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [filter, setFilter] = useState(FILTER_STAF_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [terpilih, setTerpilih] = useState([])

  const [modalForm, setModalForm] = useState(null)
  const [detail, setDetail] = useState(null)
  const [akanDihapus, setAkanDihapus] = useState(null)

  const [profil, setProfil] = useState(mockProfil)
  const [profilTersimpan, setProfilTersimpan] = useState(mockProfil)

  const [notice, setNotice] = useState('')

  // Menghilangkan notifikasi setelah 4,5 detik.
  useEffect(() => {
    if (!notice) return

    const timer = setTimeout(() => setNotice(''), 4500)

    return () => clearTimeout(timer)
  }, [notice])

  // Mengambil data staf dari backend.
  useEffect(() => {
    async function loadStaf() {
      try {
        const result = await ambilSemuaStaf()

        const dataStaf = (result.data || []).map(mapStafDariApi)

        setData(dataStaf)
      } catch (error) {
        console.error('Gagal mengambil data staf:', error)

        setNotice(`Gagal mengambil data staf: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }

    loadStaf()
  }, [])

  // Filter dan pengurutan data staf.
  const hasil = useMemo(
    () =>
      urutkanPtk(
        saringPtk(data, {
          ...filter,
          kata: filter.kata || cariTopbar,
        }),
      ),
    [data, filter, cariTopbar],
  )

  // Pagination.
  const jumlahHalaman = Math.max(
    1,
    Math.ceil(hasil.length / STAF_PER_HALAMAN),
  )

  const halamanAman = Math.min(halaman, jumlahHalaman)

  const items = hasil.slice(
    (halamanAman - 1) * STAF_PER_HALAMAN,
    halamanAman * STAF_PER_HALAMAN,
  )

  // Status filter.
  const adaFilter = Boolean(
    filter.kata || filter.rumpun || filter.status,
  )

  // Mengambil data kepala sekolah.
  const kepala = data.find(
    (staf) => staf.jabatan === JABATAN_KEPALA,
  )

  // Memeriksa perubahan profil.
  const profilBerubah =
    profil.sambutan !== profilTersimpan.sambutan ||
    profil.visi !== profilTersimpan.visi

  // Menerapkan filter.
  function terapkanFilter(nilai) {
    setFilter(nilai)
    setHalaman(1)
  }

  // Tambah atau edit staf melalui backend.
  async function simpan(staf) {
    try {
      const payload = mapStafKeApi(staf)

      const result = staf.id
        ? await editStaf(staf.id, payload)
        : await tambahStaf(payload)

      if (!result.success || !result.data) {
        throw new Error(
          result.message || 'Respons API tidak valid.',
        )
      }

      const stafTersimpan = mapStafDariApi(result.data)

      if (staf.id) {
        setData((dataLama) =>
          dataLama.map((item) =>
            item.id === staf.id ? stafTersimpan : item,
          ),
        )

        setNotice('Data pendidik/staf berhasil diperbarui.')
      } else {
        setData((dataLama) => [
          stafTersimpan,
          ...dataLama,
        ])

        setNotice('Pendidik/staf baru berhasil ditambahkan.')
      }

      setModalForm(null)
      setDetail(null)
    } catch (error) {
      console.error('Gagal menyimpan data staf:', error)

      setNotice(`Gagal menyimpan data staf: ${error.message}`)
    }
  }

  // Mengubah status tampil staf melalui backend.
  async function ubahTampil(id, tampil) {
    const stafLama = data.find((item) => item.id === id)

    if (!stafLama) return

    try {
      // Kirim data lengkap karena controller PUT memvalidasi
      // seluruh field staf.
      const payload = mapStafKeApi({
        ...stafLama,
        tampil,
      })

      const result = await editStaf(id, payload)

      if (!result.success || !result.data) {
        throw new Error(
          result.message || 'Gagal mengubah status tampil.',
        )
      }

      const stafTerbaru = mapStafDariApi(result.data)

      setData((dataLama) =>
        dataLama.map((item) =>
          item.id === id ? stafTerbaru : item,
        ),
      )

      setNotice(
        tampil
          ? 'Staf berhasil ditampilkan di portal.'
          : 'Staf berhasil disembunyikan dari portal.',
      )
    } catch (error) {
      console.error('Gagal mengubah status tampil:', error)

      setNotice(`Gagal mengubah status tampil: ${error.message}`)
    }
  }

  // Memilih atau membatalkan pilihan staf.
  function pilih(id) {
    setTerpilih((pilihan) =>
      pilihan.includes(id)
        ? pilihan.filter((itemId) => itemId !== id)
        : [...pilihan, id],
    )
  }

  // Memilih semua staf pada halaman aktif.
  function pilihSemua(centang) {
    const idHalaman = items.map((staf) => staf.id)

    setTerpilih((pilihan) =>
      centang
        ? [...new Set([...pilihan, ...idHalaman])]
        : pilihan.filter((id) => !idHalaman.includes(id)),
    )
  }

  // Menghapus satu atau beberapa staf melalui backend.
  async function konfirmasiHapus() {
    try {
      const ids =
        akanDihapus === 'terpilih'
          ? terpilih
          : [akanDihapus.id]

      if (!ids.length) {
        setAkanDihapus(null)
        return
      }

      // Tunggu semua request DELETE berhasil.
      await Promise.all(ids.map((id) => hapusStaf(id)))

      setData((dataLama) =>
        dataLama.filter((staf) => !ids.includes(staf.id)),
      )

      setTerpilih((pilihan) =>
        pilihan.filter((id) => !ids.includes(id)),
      )

      setNotice(
        ids.length > 1
          ? `${ids.length} data berhasil dihapus.`
          : 'Data pendidik/staf berhasil dihapus.',
      )

      setAkanDihapus(null)
    } catch (error) {
      console.error('Gagal menghapus data staf:', error)

      setNotice(`Gagal menghapus data staf: ${error.message}`)
    }
  }

  // Menyimpan sambutan dan visi secara lokal.
  // Integrasi API pengaturan sekolah belum dilakukan.
  function simpanProfil() {
    setProfilTersimpan(profil)

    setNotice(
      'Sambutan dan visi berhasil disimpan dan ditayangkan.',
    )
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

      {/* Notifikasi */}
      {notice && (
        <p
          role="status"
          className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark"
        >
          {notice}
        </p>
      )}

      {/* Tabel staf */}
      {loading ? (
        <p className="text-sm text-gray-500">
          Memuat data staf...
        </p>
      ) : (
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
          onHapusTerpilih={() =>
            setAkanDihapus('terpilih')
          }
          onHalaman={(nomorHalaman) =>
            setHalaman(
              Math.min(
                Math.max(1, nomorHalaman),
                jumlahHalaman,
              ),
            )
          }
          onTampil={ubahTampil}
          onLihat={setDetail}
          onEdit={(item) =>
            setModalForm({ item })
          }
          onHapus={setAkanDihapus}
        />
      )}

      {/* Sambutan kepala sekolah */}
      <ProfilSambutan
        nilai={profil}
        penulis={kepala?.nama}
        berubah={profilBerubah}
        onUbah={(kunci, nilai) =>
          setProfil((sebelumnya) => ({
            ...sebelumnya,
            [kunci]: nilai,
          }))
        }
        onSimpan={simpanProfil}
      />

      {/* Modal tambah dan edit staf */}
      {modalForm && (
        <StafFormModal
          item={modalForm.item}
          onSimpan={simpan}
          onTutup={() => setModalForm(null)}
        />
      )}

      {/* Modal detail staf */}
      {detail && !modalForm && (
        <StafDetailModal
          staf={detail}
          onEdit={(item) =>
            setModalForm({ item })
          }
          onTutup={() => setDetail(null)}
        />
      )}

      {/* Dialog konfirmasi hapus */}
      {akanDihapus && (
        <ConfirmDialog
          judul={
            akanDihapus === 'terpilih'
              ? `Hapus ${terpilih.length} data terpilih?`
              : 'Hapus data ini?'
          }
          pesan={
            akanDihapus === 'terpilih'
              ? 'Semua data yang dipilih akan dihapus dan tidak tampil lagi di portal.'
              : `“${akanDihapus.nama}” akan dihapus dan tidak tampil lagi di portal.`
          }
          labelKonfirmasi={
            akanDihapus === 'terpilih'
              ? `Hapus ${terpilih.length}`
              : 'Hapus'
          }
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}
    </div>
  )
}
