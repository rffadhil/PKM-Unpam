import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import GaleriHeader from '@/components/galeri/GaleriHeader'
import GaleriToolbar from '@/components/galeri/GaleriToolbar'
import AlbumList from '@/components/galeri/AlbumList'
import GaleriPagination from '@/components/galeri/GaleriPagination'
import AlbumFormModal from '@/components/galeri/AlbumFormModal'
import AlbumFotoModal from '@/components/galeri/AlbumFotoModal'
import Icon from '@/components/ui/Icon'
import { ALBUM_PER_HALAMAN } from '@/config/galeriAdmin'
import { saringAlbum, urutkanAlbum } from '@/utils/album'
import { useDaftarGaleri, useSimpanGaleri, useHapusGaleri, useTambahFotoGaleri,} from '@/hooks/useGaleri'

export default function KelolaGaleriPage() {
  const { pencarian = '' } = useOutletContext() ?? {}
  const { data = [], isLoading, isError, error, refetch } = useDaftarGaleri()
  const simpanMutation = useSimpanGaleri()
  const hapusMutation = useHapusGaleri()
  const tambahFotoMutation = useTambahFotoGaleri()
  
  const [kategori, setKategori] = useState('')
  const [tampilan, setTampilan] = useState('grid')
  const [halaman, setHalaman] = useState(1)
  const [modalForm, setModalForm] = useState(null) // { item } | null
  const [idFoto, setIdFoto] = useState(null)
  const [akanDihapus, setAkanDihapus] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(''), 4500)
    return () => clearTimeout(t)
  }, [notice])

  // Reset ke halaman pertama saat pencarian atau kategori berubah
  useEffect(() => {
    setHalaman(1)
  }, [pencarian, kategori])

  const hasil = useMemo(
    () => urutkanAlbum(saringAlbum(data, { kata: pencarian, kategori })),
    [data, pencarian, kategori]
  )
  const jumlahHalaman = Math.max(1, Math.ceil(hasil.length / ALBUM_PER_HALAMAN))
  const halamanAman = Math.min(halaman, jumlahHalaman)
  const items = hasil.slice((halamanAman - 1) * ALBUM_PER_HALAMAN, halamanAman * ALBUM_PER_HALAMAN)
  const albumFoto = data.find((a) => a.id === idFoto) ?? null

  function simpan(album) {
    const isEdit = Boolean(album.id)
    simpanMutation.mutate(album, {
      onSuccess: (saved) => {
        setNotice(isEdit ? 'Album berhasil diperbarui.' : 'Album baru dibuat. Silakan unggah foto.')
        setModalForm(null)
        if (!isEdit && saved?.id) {
          setIdFoto(saved.id)
        }
      },
      onError: (err) => {
        setNotice(`Gagal menyimpan album: ${err.message}`)
      },
    })
  }

  function tambahFoto(id, files) {
    tambahFotoMutation.mutate(
      { id, files },
      {
        onSuccess: () => {
          setIdFoto(null)
          setNotice(
            `${files.length} foto berhasil ditambahkan ke album.`
          )
        },
        onError: (err) => {
          setNotice(
            `Gagal mengunggah foto: ${err.message}`
          )
        },
      }
    )
  }

  function konfirmasiHapus() {
    if (!akanDihapus) return
    const { id, judul } = akanDihapus
    hapusMutation.mutate(id, {
      onSuccess: () => {
        setAkanDihapus(null)
        setNotice(`Album “${judul}” berhasil dihapus.`)
      },
      onError: (err) => {
        setNotice(`Gagal menghapus album: ${err.message}`)
        setAkanDihapus(null)
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <GaleriHeader onTambah={() => setModalForm({ item: null })} />

      {notice && (
        <p role="status" className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark">
          {notice}
        </p>
      )}

      {isError && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
        >
          <span>Gagal memuat galeri: {error?.message}</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-error px-3 py-1 text-xs font-bold text-white hover:opacity-90"
          >
            Coba Lagi
          </button>
        </div>
      )}

      <GaleriToolbar
        ditampilkan={items.length}
        total={hasil.length}
        tampilan={tampilan}
        onTampilan={setTampilan}
        kategori={kategori}
        onKategori={setKategori}
      />

      {isLoading ? (
        <section className="flex flex-col items-center justify-center rounded-2xl border border-border-muted bg-surface-white py-16 shadow-sm">
          <Icon name="progress_activity" className="animate-spin text-[36px] text-secondary" />
          <p className="mt-3 text-sm font-medium text-text-muted">Memuat album galeri...</p>
        </section>
      ) : (
        <AlbumList
          items={items}
          tampilan={tampilan}
          onFoto={(a) => setIdFoto(a.id)}
          onEdit={(item) => setModalForm({ item })}
          onHapus={setAkanDihapus}
        />
      )}

      {hasil.length > 0 && (
        <GaleriPagination
          halaman={halamanAman}
          jumlahHalaman={jumlahHalaman}
          onHalaman={(n) => setHalaman(Math.min(Math.max(1, n), jumlahHalaman))}
        />
      )}

      {modalForm && (
        <AlbumFormModal
          item={modalForm.item}
          sedangMenyimpan={simpanMutation.isPending}
          onSimpan={simpan}
          onTutup={() => setModalForm(null)}
        />
      )}

      {albumFoto && ( <AlbumFotoModal album={albumFoto} onSimpan={tambahFoto} onTutup={() => setIdFoto(null)}sedangMenyimpan={tambahFotoMutation.isPending}
    />
)}

      {akanDihapus && (
        <ConfirmDialog
          judul="Hapus album ini?"
          pesan={`“${akanDihapus.judul}” beserta ${akanDihapus.jumlahFoto} fotonya akan dihapus dan tidak tampil lagi di portal.`}
          sedangMemproses={hapusMutation.isPending}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => !hapusMutation.isPending && setAkanDihapus(null)}
        />
      )}
    </div>
  )
}
