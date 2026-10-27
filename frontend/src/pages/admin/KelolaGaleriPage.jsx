import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import GaleriHeader from '@/components/galeri/GaleriHeader'
import GaleriToolbar from '@/components/galeri/GaleriToolbar'
import AlbumList from '@/components/galeri/AlbumList'
import GaleriPagination from '@/components/galeri/GaleriPagination'
import AlbumFormModal from '@/components/galeri/AlbumFormModal'
import AlbumFotoModal from '@/components/galeri/AlbumFotoModal'
import { mockAlbum } from '@/mocks/adminGaleri'
import { ALBUM_PER_HALAMAN } from '@/config/galeriAdmin'
import { saringAlbum, urutkanAlbum } from '@/utils/album'

// Manajemen Galeri: perakit layout + state. Pencarian datang dari topbar lewat outlet context.
// TODO: ganti state lokal dengan service ke API (GET/POST/PUT/DELETE /api/galeri),
// pola sama dengan hooks/useBerita.js.
export default function KelolaGaleriPage() {
  const { pencarian = '' } = useOutletContext() ?? {}
  const [data, setData] = useState(mockAlbum)
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

  const hasil = useMemo(() => urutkanAlbum(saringAlbum(data, { kata: pencarian })), [data, pencarian])
  const jumlahHalaman = Math.max(1, Math.ceil(hasil.length / ALBUM_PER_HALAMAN))
  const halamanAman = Math.min(halaman, jumlahHalaman)
  const items = hasil.slice((halamanAman - 1) * ALBUM_PER_HALAMAN, halamanAman * ALBUM_PER_HALAMAN)
  const albumFoto = data.find((a) => a.id === idFoto) ?? null

  function simpan(album) {
    if (album.id) {
      setData((d) => d.map((a) => (a.id === album.id ? album : a)))
      setNotice('Album berhasil diperbarui.')
    } else {
      const baru = { ...album, id: Date.now() }
      setData((d) => [baru, ...d])
      setHalaman(1)
      setIdFoto(baru.id) // lanjut ke upload foto
      setNotice('Album baru dibuat. Silakan unggah foto.')
    }
    setModalForm(null)
  }

  function tambahFoto(id, jumlah) {
    setData((d) => d.map((a) => (a.id === id ? { ...a, jumlahFoto: a.jumlahFoto + jumlah } : a)))
    setIdFoto(null)
    setNotice(`${jumlah} foto ditambahkan ke album.`)
  }

  function konfirmasiHapus() {
    const { id } = akanDihapus
    setData((d) => d.filter((a) => a.id !== id))
    setAkanDihapus(null)
    setNotice('Album dihapus.')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <GaleriHeader onTambah={() => setModalForm({ item: null })} />

      {notice && (
        <p role="status" className="rounded-xl bg-secondary-container/60 px-4 py-3 text-sm font-medium text-secondary-dark">
          {notice}
        </p>
      )}

      <GaleriToolbar ditampilkan={items.length} total={hasil.length} tampilan={tampilan} onTampilan={setTampilan} />

      <AlbumList
        items={items}
        tampilan={tampilan}
        onFoto={(a) => setIdFoto(a.id)}
        onEdit={(item) => setModalForm({ item })}
        onHapus={setAkanDihapus}
      />

      {hasil.length > 0 && (
        <GaleriPagination
          halaman={halamanAman}
          jumlahHalaman={jumlahHalaman}
          onHalaman={(n) => setHalaman(Math.min(Math.max(1, n), jumlahHalaman))}
        />
      )}

      {modalForm && <AlbumFormModal item={modalForm.item} onSimpan={simpan} onTutup={() => setModalForm(null)} />}

      {albumFoto && <AlbumFotoModal album={albumFoto} onSimpan={tambahFoto} onTutup={() => setIdFoto(null)} />}

      {akanDihapus && (
        <ConfirmDialog
          judul="Hapus album ini?"
          pesan={`“${akanDihapus.judul}” beserta ${akanDihapus.jumlahFoto} fotonya akan dihapus dan tidak tampil lagi di portal.`}
          onKonfirmasi={konfirmasiHapus}
          onBatal={() => setAkanDihapus(null)}
        />
      )}
    </div>
  )
}
