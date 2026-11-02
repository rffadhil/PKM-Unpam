import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { renderAplikasi } from '@/test/utils'
import { mockAlbum } from '@/mocks/adminGaleri'

describe('Admin · Kelola Galeri Page', () => {
  beforeEach(() => {
    localStorage.setItem('cms_token', 'test-token')
    localStorage.setItem('cms_user', JSON.stringify({ nama: 'Admin Test' }))
    localStorage.removeItem('cms_galeri_data')
  })

  it('menampilkan header katalog, toolbar, filter kategori, dan daftar album beserta jumlah foto', async () => {
    await renderAplikasi('/admin/galeri')

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Katalog Dokumentasi Multimedia Sekolah/i,
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /Buat Album Baru/i })
    ).toBeInTheDocument()

    expect(screen.getByLabelText(/Filter kategori album/i)).toBeInTheDocument()

    // Memastikan album pertama tampil beserta jumlah fotonya
    await waitFor(() => {
      expect(screen.getByText(mockAlbum[0].judul)).toBeInTheDocument()
      expect(
        screen.getByRole('button', {
          name: new RegExp(`Kelola ${mockAlbum[0].jumlahFoto} foto album ${mockAlbum[0].judul}`, 'i'),
        })
      ).toBeInTheDocument()
    })
  })

  it('filter kategori menyaring album sesuai kategori yang dipilih', async () => {
    const user = await renderAplikasi('/admin/galeri')

    await waitFor(() => {
      expect(screen.getByText(mockAlbum[0].judul)).toBeInTheDocument()
    })

    // Pilih kategori "Prestasi"
    const select = screen.getByLabelText(/Filter kategori album/i)
    await user.selectOptions(select, 'Prestasi')

    // Album dengan kategori Prestasi tampil
    await waitFor(() => {
      expect(screen.getByText(/Penganugerahan Juara Umum OSN/i)).toBeInTheDocument()
    })

    // Kembalikan ke "Semua Kategori"
    await user.selectOptions(select, '')
    await waitFor(() => {
      expect(screen.getByText(mockAlbum[0].judul)).toBeInTheDocument()
    })
  })

  it('tambah album baru berhasil menyimpan dan muncul di daftar katalog', async () => {
    const user = await renderAplikasi('/admin/galeri')

    await user.click(screen.getByRole('button', { name: /Buat Album Baru/i }))

    expect(
      screen.getByRole('heading', { level: 2, name: /Buat Album Baru/i })
    ).toBeInTheDocument()

    const judulBaru = 'Dokumentasi Gelar Seni & Budaya Nusantara'
    await user.type(screen.getByLabelText(/Judul album/i), judulBaru)
    await user.type(screen.getByLabelText(/Penyelenggara \/ PIC/i), 'Panitia Dies Natalis')
    await user.type(screen.getByLabelText(/Deskripsi singkat/i), 'Dokumentasi pentas seni tahunan')

    await user.click(
      screen.getByRole('button', { name: /Simpan & Lanjut Upload Foto/i })
    )

    // Notifikasi sukses tampil
    await waitFor(() => {
      expect(
        screen.getByText(/Album baru dibuat. Silakan unggah foto./i)
      ).toBeInTheDocument()
    })

    // Album baru muncul di daftar
    expect(await screen.findByText(judulBaru)).toBeInTheDocument()
  })

  it('edit album berhasil memperbarui data di daftar katalog', async () => {
    const user = await renderAplikasi('/admin/galeri')

    await waitFor(() => {
      expect(screen.getByText(mockAlbum[0].judul)).toBeInTheDocument()
    })

    // Klik tombol edit pada album pertama
    const tombolEdit = screen.getByRole('button', {
      name: new RegExp(`Edit album ${mockAlbum[0].judul}`, 'i'),
    })
    await user.click(tombolEdit)

    expect(
      screen.getByRole('heading', { level: 2, name: /Edit Album/i })
    ).toBeInTheDocument()

    const inputJudul = screen.getByLabelText(/Judul album/i)
    await user.clear(inputJudul)
    const judulUpdate = 'Panen Raya Hidroponik & Biopori Edisi Revisi'
    await user.type(inputJudul, judulUpdate)

    await user.click(
      screen.getByRole('button', { name: /Simpan Perubahan/i })
    )

    await waitFor(() => {
      expect(screen.getByText(/Album berhasil diperbarui./i)).toBeInTheDocument()
    })

    expect(await screen.findByText(judulUpdate)).toBeInTheDocument()
  })

  it('hapus album menampilkan dialog konfirmasi dan menghapus album setelah konfirmasi', async () => {
    const user = await renderAplikasi('/admin/galeri')

    await waitFor(() => {
      expect(screen.getByText(mockAlbum[0].judul)).toBeInTheDocument()
    })

    const judulDihapus = mockAlbum[0].judul
    const tombolHapus = screen.getByRole('button', {
      name: new RegExp(`Hapus album ${judulDihapus}`, 'i'),
    })
    await user.click(tombolHapus)

    // Dialog konfirmasi terbuka
    const dialog = screen.getByRole('dialog', { name: 'Hapus album ini?' })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText(new RegExp(judulDihapus, 'i'))).toBeInTheDocument()

    // Klik tombol konfirmasi Hapus di dalam dialog
    const tombolKonfirmasi = within(dialog).getByRole('button', { name: 'Hapus' })
    await user.click(tombolKonfirmasi)

    // Notifikasi sukses tampil dan judul terhapus dari tampilan
    await waitFor(() => {
      expect(screen.getByText(new RegExp(`Album “${judulDihapus}” berhasil dihapus.`, 'i'))).toBeInTheDocument()
    })

    expect(screen.queryByText(judulDihapus)).not.toBeInTheDocument()
  })
})
