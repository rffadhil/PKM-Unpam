import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import GaleriStats from '@/components/galeri/GaleriStats'
import GaleriToolbar from '@/components/galeri/GaleriToolbar'
import AlbumList from '@/components/galeri/AlbumList'
import GaleriPagination from '@/components/galeri/GaleriPagination'
import KurasiKiriman from '@/components/galeri/KurasiKiriman'
import AlbumFormModal from '@/components/galeri/AlbumFormModal'
import { albumGaleri, kirimanKurasi, ringkasanGaleri } from '@/mocks/adminGaleri'
import { KATEGORI_GALERI, LENCANA_DEFAULT } from '@/config/galeri'
import { hitungKategori, saringAlbum, urutkanAlbum } from '@/utils/galeri'

const PER_HALAMAN = 6
const FILTER_AWAL = { kata: '', status: '', urutan: 'terbaru' }

// Manajemen Galeri. TODO: ganti state lokal dengan service ke API (album + kiriman kurasi).
export default function KelolaGaleriPage() {
  const { pencarian: cariTopbar = '' } = useOutletContext() ?? {}
  const [albums, setAlbums] = useState(albumGaleri)
  const [kiriman, setKiriman] = useState(kirimanKurasi)
  const [kategori, setKategori] = useState('')
  const [filter, setFilter] = useState(FILTER_AWAL)
  const [halaman, setHalaman] = useState(1)
  const [tampilan, setTampilan] = useState('grid')
  const [modal, setModal] = useState(null) // { album } | null
  const [notice, setNotice] = useState(null) // { teks, error }

  useEffect(() => {
    if (!notice) return
    const t = setTimeout(() => setNotice(null), 4500)
    return () => clearTimeout(t)
  }, [notice])

  const info = (teks, error = false) => setNotice({ teks, error })
  const belumTerhubung = (nama) => info(`${nama} belum terhubung ke backend.`, true)

  const totalFoto = useMemo(() => albums.reduce((s, a) => s + a.jumlahFoto, 0), [albums])
  const jumlahKategori = useMemo(() => hitungKategori(albums, KATEGORI_GALERI), [albums])
  const hasil = useMemo(
    () => urutkanAlbum(saringAlbum(albums, { kategori, status: filter.status, kata: filter.kata || cariTopbar }), filter.urutan),
    [albums, kategori, filter, cariTopbar],
  )

  const jumlahHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN))
  const halamanAman = Math.min(halaman, jumlahHalaman)
  const items = hasil.slice((halamanAman - 1) * PER_HALAMAN, halamanAman * PER_HALAMAN)

  function ubahKategori(k) {
    setKategori(k)
    setHalaman(1)
  }
  function ubahFilter(f) {
    setFilter(f)
    setHalaman(1)
  }

  function simpan(album) {
    if (album.id) {
      setAlbums((d) => d.map((a) => (a.id === album.id ? album : a)))
      info('Album berhasil diperbarui.')
    } else {
      setAlbums((d) => [{ ...album, id: Date.now() }, ...d])
      setHalaman(1)
      info('Album baru berhasil dibuat.')
    }
    setModal(null)
  }

  function hapus(a) {
    if (!window.confirm(`Hapus album "${a.judul}" beserta ${a.jumlahFoto} fotonya?`)) return
    setAlbums((d) => d.filter((x) => x.id !== a.id))
    info('Album dihapus.')
  }

  function setujui(k) {
    setAlbums((d) => [
      {
        id: Date.now(),
        judul: k.judul,
        deskripsi: `Dikirim oleh ${k.pengirim} (${k.satuan}).`,
        kategori: k.kategori,
        lencana: LENCANA_DEFAULT[k.kategori],
        jumlahFoto: k.jumlahFoto,
        tanggal: new Date().toISOString().slice(0, 10),
        penyelenggara: k.pengirim,
        status: 'tayang',
        cover: null,
      },
      ...d,
    ])
    setKiriman((x) => x.filter((i) => i.id !== k.id))
    info(`Kiriman "${k.judul}" dipublikasikan sebagai album.`)
  }

  function tolak(k) {
    if (!window.confirm(`Tolak kiriman "${k.judul}"?`)) return
    setKiriman((x) => x.filter((i) => i.id !== k.id))
    info('Kiriman ditolak dan dihapus dari antrean.')
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <GaleriStats totalAlbum={albums.length} totalFoto={totalFoto} storage={ringkasanGaleri.storage} jumlahKiriman={kiriman.length} />

      <GaleriToolbar
        totalAlbum={albums.length}
        hitungKategori={jumlahKategori}
        kategori={kategori}
        onKategori={ubahKategori}
        filter={filter}
        onFilter={ubahFilter}
        onBuatAlbum={() => setModal({ album: null })}
        onVideo={() => belumTerhubung('Pengelolaan video YouTube')}
        onKompresi={() => belumTerhubung('Optimasi kompresi gambar')}
      />

      {notice && (
        <p role="status" className={`rounded-xl px-4 py-3 text-sm font-medium ${notice.error ? 'bg-error-container text-on-error-container' : 'bg-secondary-container/60 text-secondary-dark'}`}>
          {notice.teks}
        </p>
      )}

      <AlbumList
        items={items}
        total={hasil.length}
        tampilan={tampilan}
        onTampilan={setTampilan}
        onFoto={(a) => info(`Pengelolaan foto per album "${a.judul}" belum dibuat (halaman detail album).`, true)}
        onEdit={(album) => setModal({ album })}
        onHapus={hapus}
      />

      <GaleriPagination halaman={halamanAman} jumlahHalaman={jumlahHalaman} onHalaman={(n) => setHalaman(Math.min(Math.max(1, n), jumlahHalaman))} />

      <KurasiKiriman items={kiriman} onSetujui={setujui} onTolak={tolak} onSinkron={() => belumTerhubung('Sinkronisasi kiriman')} />

      {modal && <AlbumFormModal album={modal.album} onSimpan={simpan} onTutup={() => setModal(null)} />}
    </div>
  )
}
