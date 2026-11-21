import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import ConfirmDialog from '@/components/admin/ConfirmDialog'
import UnggahDokumenCard from '@/components/dokumen/UnggahDokumenCard'
import DokumenTable from '@/components/dokumen/DokumenTable'
import DokumenFormModal from '@/components/dokumen/DokumenFormModal'
import DokumenDetailModal from '@/components/dokumen/DokumenDetailModal'

import {
  ambilDokumenAdmin,
  unggahDokumen,
  perbaruiDokumen,
  hapusDokumen,
  API_BASE_URL,
} from '@/services/dokumenService'

import {
  DOKUMEN_PER_HALAMAN,
  FILTER_DOKUMEN_AWAL,
} from '@/config/dokumenAdmin'

import {
  saringDokumen,
  urutkanDokumen,
} from '@/utils/dokumen'


function ubahFormatDokumen(dok) {
  const fileUrl = dok.file_url || ''
  const namaFile = fileUrl.split('?')[0].split('/').pop() || ''
  const tipe = namaFile.includes('.')
    ? namaFile.split('.').pop().toLowerCase()
    : 'file'

  return {
    id: dok.id,
    nama: dok.nama_dokumen,
    tipe,
    ukuranBytes: dok.ukuran_bytes || 0,
    kategori: dok.kategori || 'Umum & Siswa',
    deskripsi: dok.deskripsi || '',
    pengunggah: dok.pengunggah || 'Tidak diketahui',
    diunggah: dok.created_at,
    terakhirDieditOleh: dok.terakhir_diedit_oleh || null,
    terakhirDiedit: dok.updated_by ? dok.updated_at : null,
    aktif: dok.status_publikasi === 'Aktif di SIS',
    url: `${API_BASE_URL}/api/dokumen/${dok.id}/download`,
    fileUrl,
  }
}


export default function KelolaDokumenPage() {
  const {
    pencarian = '',
    tampilkanNotifikasi = () => {},
  } = useOutletContext() ?? {}

  const [data, setData] = useState([])
  const [filter, setFilter] = useState(FILTER_DOKUMEN_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [detail, setDetail] = useState(null)
  const [diedit, setDiedit] = useState(null)
  const [akanDihapus, setAkanDihapus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function muatUlang() {
    try {
      setLoading(true)
      setError('')

      const hasil = await ambilDokumenAdmin()
      setData(hasil.map(ubahFormatDokumen))
    } catch (err) {
      setError(err.message || 'Gagal mengambil daftar dokumen.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    muatUlang()
  }, [])

  const hasil = useMemo(
    () =>
      urutkanDokumen(
        saringDokumen(data, { ...filter, kata: pencarian }),
      ),
    [data, filter, pencarian],
  )

  const jumlahHalaman = Math.max(
    1,
    Math.ceil(hasil.length / DOKUMEN_PER_HALAMAN),
  )

  const halamanAman = Math.min(halaman, jumlahHalaman)

  const items = hasil.slice(
    (halamanAman - 1) * DOKUMEN_PER_HALAMAN,
    halamanAman * DOKUMEN_PER_HALAMAN,
  )

  function terapkanFilter(nilai) {
    setFilter(nilai)
    setHalaman(1)
  }

  // Upload dokumen
  async function unggah(dataUnggahan) {
    try {
      setError('')

      await unggahDokumen(dataUnggahan)
      await muatUlang()

      setFilter(FILTER_DOKUMEN_AWAL)
      setHalaman(1)

      tampilkanNotifikasi(
        'success',
        dataUnggahan.aktif
          ? 'Dokumen berhasil diunggah dan dipublikasikan.'
          : 'Dokumen berhasil diunggah sebagai draft.',
      )
    } catch (err) {
      const pesan = err.message || 'Dokumen gagal diunggah.'
      setError(pesan)
      tampilkanNotifikasi('error', pesan)
      throw err
    }
  }

  // Edit dokumen
  async function simpan(dok) {
    try {
      setError('')

      await perbaruiDokumen(dok.id, dok)
      await muatUlang()

      setDiedit(null)
      setDetail(null)

      tampilkanNotifikasi(
        'success',
        'Data dokumen berhasil diperbarui.',
      )
    } catch (err) {
      const pesan = err.message || 'Data dokumen gagal diperbarui.'
      setError(pesan)
      tampilkanNotifikasi('error', pesan)
      throw err
    }
  }

  // Hapus dokumen
  async function konfirmasiHapus() {
    try {
      setError('')

      await hapusDokumen(akanDihapus.id)
      setAkanDihapus(null)

      await muatUlang()

      tampilkanNotifikasi(
        'success',
        'Dokumen berhasil dihapus dari portal.',
      )
    } catch (err) {
      const pesan = err.message || 'Dokumen gagal dihapus.'
      setError(pesan)
      tampilkanNotifikasi('error', pesan)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <UnggahDokumenCard onUnggah={unggah} />

      {/* Error pemuatan data tetap ditampilkan di halaman */}
      {error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}

      {loading && (
        <p className="text-sm text-on-surface-variant">
          Memuat daftar dokumen...
        </p>
      )}

      <DokumenTable
        items={items}
        total={hasil.length}
        totalSemua={data.length}
        halaman={halamanAman}
        jumlahHalaman={jumlahHalaman}
        perHalaman={DOKUMEN_PER_HALAMAN}
        filter={filter}
        onFilter={terapkanFilter}
        onMuat={muatUlang}
        onHalaman={(n) =>
          setHalaman(Math.min(Math.max(1, n), jumlahHalaman))
        }
        onLihat={setDetail}
        onEdit={setDiedit}
        onHapus={setAkanDihapus}
      />

      {detail && !diedit && (
        <DokumenDetailModal
          dok={detail}
          onEdit={setDiedit}
          onTutup={() => setDetail(null)}
        />
      )}

      {diedit && (
        <DokumenFormModal
          dok={diedit}
          onSimpan={simpan}
          onTutup={() => setDiedit(null)}
        />
      )}

      {akanDihapus && (
        <ConfirmDialog
          judul="Hapus dokumen ini?"
          pesan={`“${akanDihapus.nama}.${akanDihapus.tipe}” akan dihapus dan tombol unduhnya hilang dari portal.`}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}
    </div>
  )
}