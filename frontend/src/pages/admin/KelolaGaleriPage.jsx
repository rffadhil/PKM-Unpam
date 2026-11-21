
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useOutletContext } from 'react-router-dom'

import GaleriHeader from '@/components/galeri/GaleriHeader'
import GaleriToolbar from '@/components/galeri/GaleriToolbar'
import AlbumList from '@/components/galeri/AlbumList'
import GaleriPagination from '@/components/galeri/GaleriPagination'
import AlbumFormModal from '@/components/galeri/AlbumFormModal'
import AlbumFotoModal from '@/components/galeri/AlbumFotoModal'
import Icon from '@/components/ui/Icon'

import { ALBUM_PER_HALAMAN } from '@/config/galeriAdmin'
import { saringAlbum, urutkanAlbum } from '@/utils/album'

import {
  useDaftarGaleri,
  useSimpanGaleri,
  useHapusGaleri,
  useTambahFotoGaleri,
  useHapusFotoGaleri,
} from '@/hooks/useGaleri'


// Dialog konfirmasi khusus Galeri.
// Portal membuat dialog selalu berada di atas modal album/foto,
// tanpa membongkar modal album yang sedang terbuka.
function KonfirmasiGaleri({
  judul,
  pesan,
  sedangMemproses = false,
  onKonfirmasi,
  onBatal,
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !sedangMemproses) {
          onBatal()
        }
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="judul-konfirmasi-galeri"
        aria-describedby="pesan-konfirmasi-galeri"
        className="my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex gap-4 p-5 sm:p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Icon name="delete" className="text-2xl" />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="judul-konfirmasi-galeri"
              className="text-lg font-bold leading-snug text-slate-900"
            >
              {judul}
            </h2>
            <p
              id="pesan-konfirmasi-galeri"
              className="mt-2 break-words text-sm leading-relaxed text-slate-600"
            >
              {pesan}
            </p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onBatal}
            disabled={sedangMemproses}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onKonfirmasi}
            disabled={sedangMemproses}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sedangMemproses ? 'Memproses...' : 'Hapus'}
          </button>
        </div>
      </section>
    </div>,
    document.body
  )
}

// Membaca data album dari beberapa kemungkinan bentuk response API.
function ambilDataAlbum(response) {
  return (
    response?.data?.data ??
    response?.data ??
    response?.album ??
    response ??
    null
  )
}

export default function KelolaGaleriPage() {
  const { pencarian = '', tampilkanNotifikasi = () => {} } = useOutletContext() ?? {}

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useDaftarGaleri()

  const simpanMutation = useSimpanGaleri()
  const hapusMutation = useHapusGaleri()
  const tambahFotoMutation = useTambahFotoGaleri()
  const hapusFotoMutation = useHapusFotoGaleri()

  const [kategori, setKategori] = useState('')
  const [tampilan, setTampilan] = useState('grid')
  const [halaman, setHalaman] = useState(1)

  const [modalForm, setModalForm] = useState(null)
  const [idFoto, setIdFoto] = useState(null)
  const [albumSementara, setAlbumSementara] = useState(null)

  // State konfirmasi penghapusan foto.
  const [fotoAkanDihapus, setFotoAkanDihapus] = useState(null)

  // State konfirmasi penghapusan album.
  const [akanDihapus, setAkanDihapus] = useState(null)

  // Kembali ke halaman pertama saat filter berubah.
  useEffect(() => {
    setHalaman(1)
  }, [pencarian, kategori])

  // Pastikan data berupa array.
  const daftarAlbum = Array.isArray(data) ? data : []

  // Filter dan urutkan album.
  const hasil = useMemo(() => {
    return urutkanAlbum(
      saringAlbum(daftarAlbum, {
        kata: pencarian,
        kategori,
      })
    )
  }, [daftarAlbum, pencarian, kategori])

  const jumlahHalaman = Math.max(
    1,
    Math.ceil(hasil.length / ALBUM_PER_HALAMAN)
  )

  const halamanAman = Math.min(halaman, jumlahHalaman)

  const items = hasil.slice(
    (halamanAman - 1) * ALBUM_PER_HALAMAN,
    halamanAman * ALBUM_PER_HALAMAN
  )

  // Cari album yang akan ditambahkan atau dikelola fotonya.
  const albumFoto =
    daftarAlbum.find(
      (album) => String(album.id) === String(idFoto)
    ) ??
    (String(albumSementara?.id) === String(idFoto)
      ? albumSementara
      : null)

  // Membuat album baru atau memperbarui album.
  function simpan(album) {
    if (simpanMutation.isPending) return

    const isEdit = Boolean(album.id)

    simpanMutation.mutate(album, {
      onSuccess: async (response) => {
        const saved = ambilDataAlbum(response)

        // Pastikan ID album tersedia.
        if (!isEdit && !saved?.id) {
          tampilkanNotifikasi(
            'warning',
            'Album tersimpan, tetapi ID album tidak diterima dari server. Periksa respons API.'
          )

          await refetch()
          return
        }

        setModalForm(null)

        if (isEdit) {
          tampilkanNotifikasi('success', 'Album berhasil diperbarui.')
          await refetch()
          return
        }

        // Simpan data sementara agar modal foto langsung memperoleh album.
        setAlbumSementara(saved)
        setIdFoto(saved.id)

        tampilkanNotifikasi(
          'success',
          'Album berhasil dibuat. Silakan pilih foto tambahan.'
        )

        await refetch()
      },

      onError: (err) => {
        console.error('Gagal menyimpan album:', err)

        tampilkanNotifikasi(
          'error',
          `Gagal menyimpan album: ${err.message || 'Terjadi kesalahan.'}`
        )
      },
    })
  }

  // Menambahkan beberapa foto ke album.
  function tambahFoto(id, files) {
    if (!id) {
      tampilkanNotifikasi('error', 'ID album tidak ditemukan.')
      return
    }

    if (!files || files.length === 0) {
      tampilkanNotifikasi('warning', 'Pilih minimal satu foto.')
      return
    }

    if (tambahFotoMutation.isPending) return

    tambahFotoMutation.mutate(
      {
        id,
        files,
      },
      {
        onSuccess: async () => {
          setIdFoto(null)
          setAlbumSementara(null)

          tampilkanNotifikasi(
            'success',
            `${files.length} foto berhasil ditambahkan ke album.`
          )

          await refetch()
        },

        onError: (err) => {
          console.error('Gagal menambahkan foto:', err)

          tampilkanNotifikasi(
            'error',
            `Gagal mengunggah foto: ${err.message || 'Terjadi kesalahan.'}`
          )
        },
      }
    )
  }

  // Menghapus satu foto dari album.
  function konfirmasiHapusFoto() {
    if (!fotoAkanDihapus || hapusFotoMutation.isPending) return

    if (!idFoto) {
      tampilkanNotifikasi('error', 'ID album tidak ditemukan.')
      setFotoAkanDihapus(null)
      return
    }

    const { fotoId, nama } = fotoAkanDihapus

    hapusFotoMutation.mutate(
      {
        id: idFoto,
        fotoId,
      },
      {
        onSuccess: async () => {
          setFotoAkanDihapus(null)

          tampilkanNotifikasi('success', `Foto "${nama}" berhasil dihapus.`)

          await refetch()
        },

        onError: (err) => {
          console.error('Gagal menghapus foto:', err)

          tampilkanNotifikasi(
            'error',
            `Gagal menghapus foto: ${err.message || 'Terjadi kesalahan.'}`
          )

          setFotoAkanDihapus(null)
        },
      }
    )
  }

  // Menghapus album.
  function konfirmasiHapus() {
    if (!akanDihapus || hapusMutation.isPending) return

    const { id, judul } = akanDihapus

    hapusMutation.mutate(id, {
      onSuccess: async () => {
        setAkanDihapus(null)

        tampilkanNotifikasi(
          'success',
          `Album "${judul}" berhasil dihapus.`
        )

        await refetch()
      },

      onError: (err) => {
        console.error('Gagal menghapus album:', err)

        tampilkanNotifikasi(
          'error',
          `Gagal menghapus album: ${err.message || 'Terjadi kesalahan.'}`
        )

        setAkanDihapus(null)
      },
    })
  }

  // Menutup modal pengelolaan foto.
  function tutupModalFoto() {
    if (
      tambahFotoMutation.isPending ||
      hapusFotoMutation.isPending
    ) {
      return
    }

    setIdFoto(null)
    setAlbumSementara(null)
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">

      {/* HEADER */}
      <GaleriHeader
        onTambah={() => setModalForm({ item: null })}
      />

      {/* ERROR MEMUAT DATA */}
      {isError && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
        >
          <span>
            Gagal memuat galeri: {error?.message}
          </span>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-error px-3 py-1 text-xs font-bold text-white hover:opacity-90"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* TOOLBAR */}
      <GaleriToolbar
        ditampilkan={items.length}
        total={hasil.length}
        tampilan={tampilan}
        onTampilan={setTampilan}
        kategori={kategori}
        onKategori={setKategori}
      />

      {/* DAFTAR ALBUM */}
      {isLoading ? (
        <section className="flex flex-col items-center justify-center rounded-2xl border border-border-muted bg-surface-white py-16 shadow-sm">
          <Icon
            name="progress_activity"
            className="animate-spin text-[36px] text-secondary"
          />

          <p className="mt-3 text-sm font-medium text-text-muted">
            Memuat album galeri...
          </p>
        </section>
      ) : (
        <AlbumList
          items={items}
          tampilan={tampilan}
          onFoto={(album) => {
            setAlbumSementara(album)
            setIdFoto(album.id)
          }}
          onEdit={(item) => {
            setModalForm({ item })
          }}
          onHapus={setAkanDihapus}
        />
      )}

      {/* PAGINATION */}
      {hasil.length > 0 && (
        <GaleriPagination
          halaman={halamanAman}
          jumlahHalaman={jumlahHalaman}
          onHalaman={(nomor) =>
            setHalaman(
              Math.min(
                Math.max(1, nomor),
                jumlahHalaman
              )
            )
          }
        />
      )}

      {/* MODAL BUAT DAN EDIT ALBUM */}
      {modalForm && (
        <AlbumFormModal
          item={modalForm.item}
          sedangMenyimpan={simpanMutation.isPending}
          onSimpan={simpan}
          onTutup={() => {
            if (!simpanMutation.isPending) {
              setModalForm(null)
            }
          }}
        />
      )}

      {/* MODAL UPLOAD DAN KELOLA FOTO */}
      {albumFoto && (
        <AlbumFotoModal
          album={albumFoto}
          onSimpan={tambahFoto}
          onTutup={tutupModalFoto}
          onHapusFoto={(foto) => {
            setFotoAkanDihapus({
              fotoId: foto.id,
              nama: foto.url || foto.image_url || 'Foto',
            })
          }}
          sedangMenyimpan={tambahFotoMutation.isPending}
          sedangMenghapusFoto={hapusFotoMutation.isPending}
        />
      )}

      {/* KONFIRMASI HAPUS ALBUM */}
      {akanDihapus && (
        <KonfirmasiGaleri
          judul="Hapus album ini?"
          pesan={`"${akanDihapus.judul}" beserta ${akanDihapus.jumlahFoto} fotonya akan dihapus dan tidak tampil lagi di portal.`}
          sedangMemproses={hapusMutation.isPending}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => {
            if (!hapusMutation.isPending) {
              setAkanDihapus(null)
            }
          }}
        />
      )}

      {/* KONFIRMASI HAPUS FOTO */}
      {fotoAkanDihapus && (
        <KonfirmasiGaleri
          judul="Hapus foto ini?"
          pesan="Foto yang dipilih akan dihapus dari album. Foto lainnya tidak akan terpengaruh."
          sedangMemproses={hapusFotoMutation.isPending}
          onKonfirmasi={konfirmasiHapusFoto}
          onBatal={() => {
            if (!hapusFotoMutation.isPending) {
              setFotoAkanDihapus(null)
            }
          }}
        />
      )}

    </div>
  )
}
