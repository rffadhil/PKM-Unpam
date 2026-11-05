
import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import PesanToolbar from '@/components/pesan/PesanToolbar'
import TiketTable from '@/components/pesan/TiketTable'
import TinjauTiketModal from '@/components/pesan/TinjauTiketModal'
import KontakPublikForm from '@/components/pesan/KontakPublikForm'

import { mockKontak } from '@/mocks/adminPesan'
import { FILTER_TIKET_AWAL, TIKET_PER_HALAMAN } from '@/config/pesanAdmin'
import {
  saringTiket,
  urutkanTiket,
  validasiKontak,
  mapPesanDariApi,
} from '@/utils/tiket'

import { useDaftarPesan, useUbahStatusPesan } from '@/hooks/usePesan'

export default function KelolaPesanPage() {
  const { pencarian = '' } = useOutletContext() ?? {}

  const [filter, setFilter] = useState(FILTER_TIKET_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [tinjau, setTinjau] = useState(null)

  const [kontak, setKontak] = useState(mockKontak)
  const [kontakTersimpan, setKontakTersimpan] = useState(mockKontak)
  const [errorKontak, setErrorKontak] = useState({})

  const [notice, setNotice] = useState('')
  const [errorSimpan, setErrorSimpan] = useState('')

  // Mengambil data pesan dari backend.
  const {
    data: responsPesan,
    isLoading,
    isError,
    error,
    refetch,
  } = useDaftarPesan()

  // Mutation untuk mengubah status pesan.
  const ubahStatus = useUbahStatusPesan()

  // Mapping data backend ke format frontend.
  const data = useMemo(
    () => (responsPesan ?? []).map(mapPesanDariApi),
    [responsPesan],
  )

  useEffect(() => {
    if (!notice) return

    const t = setTimeout(() => setNotice(''), 4500)
    return () => clearTimeout(t)
  }, [notice])

  const hasil = useMemo(
    () => urutkanTiket(
      saringTiket(data, { ...filter, kata: pencarian }),
    ),
    [data, filter, pencarian],
  )

  const jumlahHalaman = Math.max(
    1,
    Math.ceil(hasil.length / TIKET_PER_HALAMAN),
  )

  const halamanAman = Math.min(halaman, jumlahHalaman)

  const items = hasil.slice(
    (halamanAman - 1) * TIKET_PER_HALAMAN,
    halamanAman * TIKET_PER_HALAMAN,
  )

  const kontakBerubah = Object.keys(kontak).some(
    (k) => kontak[k] !== kontakTersimpan[k],
  )

  function terapkanFilter(nilai) {
    setFilter(nilai)
    setHalaman(1)
  }

  function bukaTiket(tiket) {
    setErrorSimpan('')
    setTinjau(tiket)
  }

  // Simpan perubahan status ke database.
  async function simpanTiket(tiket) {
    try {
      setErrorSimpan('')

      await ubahStatus.mutateAsync({
        id: tiket.id,
        status: tiket.status,
        catatan: tiket.catatan,
      })

      setTinjau(null)
      setNotice('Tindak lanjut pesan berhasil disimpan.')
    } catch (err) {
      setErrorSimpan(err.message || 'Gagal menyimpan perubahan pesan.')
    }
  }

  // Kontak publik masih menggunakan state lokal.
  function simpanKontak() {
    const hasilValidasi = validasiKontak(kontak)

    setErrorKontak(hasilValidasi)

    if (Object.keys(hasilValidasi).length) return

    setKontakTersimpan(kontak)
    setNotice('Kontak berhasil disimpan secara lokal.')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <PesanToolbar
        nilai={filter}
        onUbah={terapkanFilter}
      />

      {notice && (
        <p
          role="status"
          className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark"
        >
          {notice}
        </p>
      )}

      {isLoading && (
        <p className="rounded-xl bg-surface-light p-4 text-sm">
          Memuat pesan masuk...
        </p>
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <p className="font-semibold">Gagal memuat pesan.</p>
          <p className="mt-1">{error?.message}</p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-red-600 px-3 py-2 font-semibold text-white"
          >
            Coba lagi
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <TiketTable
          items={items}
          total={hasil.length}
          halaman={halamanAman}
          jumlahHalaman={jumlahHalaman}
          perHalaman={TIKET_PER_HALAMAN}
          onHalaman={(n) =>
            setHalaman(Math.min(Math.max(1, n), jumlahHalaman))
          }
          onTinjau={bukaTiket}
        />
      )}

      <KontakPublikForm
        nilai={kontak}
        error={errorKontak}
        berubah={kontakBerubah}
        onUbah={(kunci, v) =>
          setKontak((k) => ({ ...k, [kunci]: v }))
        }
        onSimpan={simpanKontak}
      />

      {tinjau && (
        <>
          {errorSimpan && (
            <p role="alert" className="text-sm text-red-600">
              {errorSimpan}
            </p>
          )}

          <TinjauTiketModal
            tiket={tinjau}
            onSimpan={simpanTiket}
            onTutup={() => {
              setTinjau(null)
              setErrorSimpan('')
            }}
          />
        </>
      )}
    </div>
  )
}
