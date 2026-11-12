
import { useState } from 'react'
import ModalGaleri from '@/components/galeri/ModalGaleri'
import AlbumField from '@/components/galeri/AlbumField'
import AlbumCover from '@/components/galeri/AlbumCover'
import Icon from '@/components/ui/Icon'
import {
  BATAS_FOTO_MB,
  GAYA_INPUT,
  KATEGORI_ALBUM,
  STATUS_ALBUM,
} from '@/config/galeriAdmin'
import {
  albumKosong,
  validasiAlbum,
  validasiGambar,
} from '@/utils/album'

const ID_FORM = 'form-album'

export default function AlbumFormModal({
  item,
  sedangMenyimpan = false,
  onSimpan,
  onTutup,
}) {
  const [isi, setIsi] = useState(() => item ?? albumKosong())
  const [error, setError] = useState({})
  const baru = !item

  const ubah = (kunci, nilai) => {
    setIsi((sebelumnya) => ({
      ...sebelumnya,
      [kunci]: nilai,
    }))
  }

  const input = (kunci) => ({
    id: `album-${kunci}`,
    name: kunci,
    value: isi[kunci] ?? '',
    onChange: (e) => ubah(kunci, e.target.value),
    'aria-invalid': Boolean(error[kunci]),
    'aria-describedby': error[kunci]
      ? `album-${kunci}-error`
      : undefined,
    className: GAYA_INPUT,
  })

  function pilihCover(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const pesan = validasiGambar(file)

    if (pesan) {
      setError((sebelumnya) => ({
        ...sebelumnya,
        cover: pesan,
      }))
      e.target.value = ''
      return
    }

    setError((sebelumnya) => ({
      ...sebelumnya,
      cover: undefined,
    }))

    const reader = new FileReader()

    reader.onload = () => {
      ubah('cover', reader.result)
      ubah('fileCover', file)
    }

    reader.onerror = () => {
      setError((sebelumnya) => ({
        ...sebelumnya,
        cover: 'Gagal membaca gambar sampul.',
      }))
    }

    reader.readAsDataURL(file)
    e.target.value = ''
  }

  function kirim(e) {
    e.preventDefault()

    if (sedangMenyimpan) return

    const hasil = validasiAlbum(isi)
    setError(hasil)

    if (Object.keys(hasil).length > 0) return

    onSimpan({
      ...isi,
      judul: String(isi.judul || '').trim(),
      deskripsi: String(isi.deskripsi || '').trim(),
      penyelenggara: String(isi.penyelenggara || '').trim(),
    })
  }

  return (
    <ModalGaleri
      judul={baru ? 'Buat Album Baru' : 'Edit Album'}
      onTutup={sedangMenyimpan ? undefined : onTutup}
      footer={
        <>
          <button
            type="button"
            disabled={sedangMenyimpan}
            onClick={onTutup}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-container disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="submit"
            form={ID_FORM}
            disabled={sedangMenyimpan}
            className="rounded-full bg-cta-gold px-5 py-2 text-sm font-bold text-primary hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sedangMenyimpan
              ? 'Menyimpan...'
              : baru
                ? 'Simpan & Lanjut Upload Foto'
                : 'Simpan Perubahan'}
          </button>
        </>
      }
    >
      <form
        id={ID_FORM}
        onSubmit={kirim}
        noValidate
        className="space-y-4"
      >
        <AlbumField
          id="album-judul"
          label="Judul album"
          error={error.judul}
        >
          <input
            type="text"
            placeholder="Contoh: Panen Raya Hidroponik"
            {...input('judul')}
          />
        </AlbumField>

        <div className="grid gap-4 sm:grid-cols-2">
          <AlbumField id="album-kategori" label="Kategori">
            <select {...input('kategori')}>
              {KATEGORI_ALBUM.map((kategori) => (
                <option key={kategori} value={kategori}>
                  {kategori}
                </option>
              ))}
            </select>
          </AlbumField>

          <AlbumField id="album-status" label="Status">
            <select {...input('status')}>
              {Object.entries(STATUS_ALBUM).map(([nilai, status]) => (
                <option key={nilai} value={nilai}>
                  {status.label}
                </option>
              ))}
            </select>
          </AlbumField>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AlbumField
            id="album-tanggal"
            label="Tanggal kegiatan"
            error={error.tanggal}
          >
            <input type="date" {...input('tanggal')} />
          </AlbumField>

          <AlbumField
            id="album-penyelenggara"
            label="Penyelenggara / PIC"
            error={error.penyelenggara}
          >
            <input
              type="text"
              placeholder="Contoh: Humas Sekolah"
              {...input('penyelenggara')}
            />
          </AlbumField>
        </div>

        <AlbumField
          id="album-deskripsi"
          label="Deskripsi singkat"
          error={error.deskripsi}
          bantuan={`${String(isi.deskripsi || '').length}/300 karakter`}
        >
          <textarea rows={3} {...input('deskripsi')} />
        </AlbumField>

        <AlbumField
          id="album-cover"
          label="Foto sampul"
          error={error.cover}
          bantuan={`JPG, PNG, atau WebP. Maksimal ${BATAS_FOTO_MB} MB.`}
        >
          <div className="flex items-center gap-4">
            <AlbumCover
              key={isi.cover}
              src={isi.cover}
              alt="Pratinjau sampul"
              className="h-20 w-28 shrink-0 rounded-lg"
            />

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border-muted bg-surface-white px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-light">
              <Icon name="upload" className="text-[18px]" />
              <span>Pilih Gambar</span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={pilihCover}
                disabled={sedangMenyimpan}
                className="sr-only"
              />
            </label>
          </div>
        </AlbumField>
      </form>
    </ModalGaleri>
  )
}
