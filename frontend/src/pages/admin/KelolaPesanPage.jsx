
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

import {
  ambilPengaturanLengkap,
  simpanKontakPTSP,
} from '@/services/pengaturan.service'

export default function KelolaPesanPage() {
  // Mengambil notifikasi global dari AdminLayout
  const {
    pencarian = '',
    tampilkanNotifikasi = () => {},
  } = useOutletContext() ?? {}

  const [filter, setFilter] = useState(FILTER_TIKET_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [tinjau, setTinjau] = useState(null)

  // State kontak PTSP
  const [kontak, setKontak] = useState(mockKontak)
  const [kontakTersimpan, setKontakTersimpan] = useState(mockKontak)
  const [errorKontak, setErrorKontak] = useState({})

  const [isLoadingKontak, setIsLoadingKontak] = useState(true)
  const [sedangSimpanKontak, setSedangSimpanKontak] = useState(false)
  const [errorMuatKontak, setErrorMuatKontak] = useState('')

  const [errorSimpan, setErrorSimpan] = useState('')

  // Mengambil data pesan dari backend
  const {
    data: responsPesan,
    isLoading,
    isError,
    error,
    refetch,
  } = useDaftarPesan()

  // Mutation untuk mengubah status pesan
  const ubahStatus = useUbahStatusPesan()

  // Mapping data backend ke format frontend
  const data = useMemo(
    () => (responsPesan ?? []).map(mapPesanDariApi),
    [responsPesan],
  )

  // Mengambil pengaturan kontak dari backend
  useEffect(() => {
    let aktif = true

    async function muatKontak() {
      try {
        setIsLoadingKontak(true)
        setErrorMuatKontak('')

        const respons = await ambilPengaturanLengkap()

        const daftar = Array.isArray(respons.data)
          ? respons.data
          : []

        const pengaturan = Object.fromEntries(
          daftar.map((item) => [item.key, item.value]),
        )

        const kontakDariApi = {
          whatsapp: pengaturan.whatsapp ?? mockKontak.whatsapp,

          telepon:
            pengaturan.telepon ??
            pengaturan.telepon_ptsp ??
            mockKontak.telepon,

          jamSenKam:
            pengaturan.jamSenKam ??
            mockKontak.jamSenKam,

          jamJumat:
            pengaturan.jamJumat ??
            mockKontak.jamJumat,

          alamat:
            pengaturan.alamat ??
            pengaturan.alamat_lengkap ??
            mockKontak.alamat,

          peta:
            pengaturan.peta ??
            mockKontak.peta,
        }

        if (aktif) {
          setKontak(kontakDariApi)
          setKontakTersimpan(kontakDariApi)
        }
      } catch (err) {
        if (aktif) {
          setErrorMuatKontak(
            err.message || 'Gagal memuat kontak PTSP.',
          )
        }
      } finally {
        if (aktif) {
          setIsLoadingKontak(false)
        }
      }
    }

    muatKontak()

    return () => {
      aktif = false
    }
  }, [])

  // Filter dan pengurutan tiket
  const hasil = useMemo(
    () =>
      urutkanTiket(
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

  // Memeriksa apakah kontak mengalami perubahan
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

  // Simpan perubahan status pesan ke database
  async function simpanTiket(tiket) {
    try {
      setErrorSimpan('')

      await ubahStatus.mutateAsync({
        id: tiket.id,
        status: tiket.status,
        catatan: tiket.catatan,
      })

      setTinjau(null)

      tampilkanNotifikasi(
        'success',
        'Tindak lanjut pesan berhasil disimpan.',
      )
    } catch (err) {
      const pesanError =
        err.message || 'Gagal menyimpan perubahan pesan.'

      setErrorSimpan(pesanError)

      tampilkanNotifikasi(
        'error',
        pesanError,
      )
    }
  }

  // Simpan perubahan kontak PTSP ke database
  async function simpanKontak() {
    const hasilValidasi = validasiKontak(kontak)

    setErrorKontak(hasilValidasi)
    setErrorSimpan('')

    // Validasi tetap ditampilkan pada form
    if (Object.keys(hasilValidasi).length > 0) return

    try {
      setSedangSimpanKontak(true)

      await simpanKontakPTSP(kontak)

      setKontakTersimpan({ ...kontak })

      tampilkanNotifikasi(
        'success',
        'Kontak PTSP berhasil disimpan.',
      )
    } catch (err) {
      const pesanError =
        err.message || 'Gagal menyimpan kontak PTSP.'

      setErrorSimpan(pesanError)

      tampilkanNotifikasi(
        'error',
        pesanError,
      )
    } finally {
      setSedangSimpanKontak(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <PesanToolbar
        nilai={filter}
        onUbah={terapkanFilter}
      />

      {/* Daftar pesan */}
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

      {/* Pengaturan Kontak PTSP */}
      {isLoadingKontak ? (
        <p className="rounded-xl bg-surface-light p-4 text-sm">
          Memuat pengaturan kontak PTSP...
        </p>
      ) : (
        <>
          {errorMuatKontak && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <p className="font-semibold">
                Gagal memuat kontak PTSP.
              </p>
              <p className="mt-1">{errorMuatKontak}</p>
            </div>
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

          {sedangSimpanKontak && (
            <p className="text-sm text-gray-500">
              Menyimpan perubahan kontak...
            </p>
          )}
        </>
      )}

      {/* Error penyimpanan */}
      {errorSimpan && (
        <p role="alert" className="text-sm text-red-600">
          {errorSimpan}
        </p>
      )}

      {/* Modal tinjau tiket */}
      {tinjau && (
        <TinjauTiketModal
          tiket={tinjau}
          onSimpan={simpanTiket}
          onTutup={() => {
            setTinjau(null)
            setErrorSimpan('')
          }}
        />
      )}
    </div>
  )
}
