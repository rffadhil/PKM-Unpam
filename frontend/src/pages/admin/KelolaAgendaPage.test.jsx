import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { renderAplikasi } from '@/test/utils'
import { mockAgenda } from '@/mocks/adminAgenda'

describe('Admin · Kelola Agenda Page', () => {
  beforeEach(() => {
    localStorage.setItem('cms_token', 'test-token')
    localStorage.setItem('cms_user', JSON.stringify({ nama: 'Admin Test' }))
    localStorage.removeItem('cms_agenda_data')
  })

  it('menampilkan header, filter, dan tabel agenda terdaftar', async () => {
    await renderAplikasi('/admin/agenda')

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /Daftar Agenda Akademik & Aktivitas Civitas/i,
      }),
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /Tambah Agenda Baru/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Periode Akademik/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Kategori Agenda/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Ketik kata kunci agenda/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Terapkan Filter/i })).toBeInTheDocument()

    // Memastikan baris agenda pertama dari data mock tampil
    await waitFor(() => {
      expect(screen.getByText(mockAgenda[0].judul)).toBeInTheDocument()
    })
  })

  it('filter kategori menyaring baris agenda dan tombol reset mengembalikannya', async () => {
    const user = await renderAplikasi('/admin/agenda')

    await waitFor(() => {
      expect(screen.getByText(mockAgenda[0].judul)).toBeInTheDocument()
    })

    // Pilih kategori "Akademik & Ujian"
    const select = screen.getByLabelText(/Kategori Agenda/i)
    await user.selectOptions(select, 'Akademik & Ujian')
    await user.click(screen.getByRole('button', { name: /Terapkan Filter/i }))

    // Memastikan tombol Reset muncul saat ada filter aktif
    const tombolReset = await screen.findByRole('button', { name: /Reset/i })
    expect(tombolReset).toBeInTheDocument()

    // Memastikan agenda yang tampil adalah kategori Akademik & Ujian
    await waitFor(() => {
      expect(screen.getByText(/Asesmen Sumatif Akhir Jenjang/i)).toBeInTheDocument()
    })

    // Klik tombol reset
    await user.click(tombolReset)

    // Memastikan kembali menampilkan agenda umum
    await waitFor(() => {
      expect(screen.getByText(mockAgenda[0].judul)).toBeInTheDocument()
    })
  })

  it('filter periode menyaring baris agenda sesuai periode akademik', async () => {
    const user = await renderAplikasi('/admin/agenda')

    await waitFor(() => {
      expect(screen.getByText(mockAgenda[0].judul)).toBeInTheDocument()
    })

    // Pilih periode "Semester Ganjil 2025/2026" yang belum ada itemnya
    const selectPeriode = screen.getByLabelText(/Periode Akademik/i)
    await user.selectOptions(selectPeriode, 'Semester Ganjil 2025/2026')
    await user.click(screen.getByRole('button', { name: /Terapkan Filter/i }))

    // Memastikan pesan kosong tampil jika tidak ada agenda pada periode tersebut
    await waitFor(() => {
      expect(
        screen.getByText(/Belum ada agenda yang cocok. Ubah filter atau tambah agenda baru./i),
      ).toBeInTheDocument()
    })

    // Klik tombol reset
    const tombolReset = await screen.findByRole('button', { name: /Reset/i })
    await user.click(tombolReset)

    // Data agenda kembali tampil
    await waitFor(() => {
      expect(screen.getByText(mockAgenda[0].judul)).toBeInTheDocument()
    })
  })

  it('validasi form: wajib mengisi judul dan tanggal mulai yang benar', async () => {
    const user = await renderAplikasi('/admin/agenda')

    // Buka modal tambah agenda
    await user.click(screen.getByRole('button', { name: /Tambah Agenda Baru/i }))

    expect(screen.getByRole('heading', { level: 2, name: /Tambah Agenda Baru/i })).toBeInTheDocument()

    // Submit form kosong
    await user.click(screen.getByRole('button', { name: /Simpan Agenda/i }))

    expect(await screen.findByText('Nama agenda wajib diisi.')).toBeInTheDocument()
    expect(await screen.findByText('Tanggal mulai wajib diisi.')).toBeInTheDocument()

    // Isi tanggal selesai sebelum tanggal mulai
    const inputTglMulai = screen.getByLabelText(/Tanggal Mulai/i)
    const inputTglSelesai = screen.getByLabelText(/Tanggal Selesai/i)
    await user.type(inputTglMulai, '2026-06-10')
    await user.type(inputTglSelesai, '2026-06-05')
    await user.type(screen.getByLabelText(/Nama Agenda/i), 'Uji Coba Validasi')

    await user.click(screen.getByRole('button', { name: /Simpan Agenda/i }))

    expect(
      await screen.findByText('Tanggal selesai tidak boleh sebelum tanggal mulai.'),
    ).toBeInTheDocument()

    // Tombol Batal menutup modal
    await user.click(screen.getByRole('button', { name: /Batal/i }))
    expect(screen.queryByRole('heading', { level: 2, name: /Tambah Agenda Baru/i })).not.toBeInTheDocument()
  })

  it('tambah agenda baru berhasil menyimpan dan muncul di tabel', async () => {
    const user = await renderAplikasi('/admin/agenda')

    await user.click(screen.getByRole('button', { name: /Tambah Agenda Baru/i }))

    const judulBaru = 'Rapat Koordinasi Awal Mei 2026'
    await user.type(screen.getByLabelText(/Nama Agenda/i), judulBaru)
    await user.type(screen.getByLabelText(/Tanggal Mulai/i), '2026-05-01')
    await user.type(screen.getByLabelText(/Waktu/i), '08.00 - 12.00 WIB')
    await user.type(screen.getByLabelText(/Lokasi/i), 'Gedung Serbaguna')
    await user.type(screen.getByLabelText(/Penyelenggara/i), 'Kepala Sekolah')
    await user.type(screen.getByLabelText(/Deskripsi Singkat/i), 'Rapat koordinasi awal bulan')

    await user.click(screen.getByRole('button', { name: /Simpan Agenda/i }))

    // Modal tertutup dan notifikasi sukses muncul
    await waitFor(() => {
      expect(screen.getByText('Agenda baru berhasil ditambahkan.')).toBeInTheDocument()
    })

    // Agenda baru masuk ke daftar tabel pada halaman 1
    expect(await screen.findByText(judulBaru)).toBeInTheDocument()
  })

  it('edit agenda berhasil memperbarui data di tabel', async () => {
    const user = await renderAplikasi('/admin/agenda')

    await waitFor(() => {
      expect(screen.getByText(mockAgenda[0].judul)).toBeInTheDocument()
    })

    // Klik tombol edit baris pertama
    const tombolEdit = screen.getByRole('button', { name: new RegExp(`Edit ${mockAgenda[0].judul}`, 'i') })
    await user.click(tombolEdit)

    expect(screen.getByRole('heading', { level: 2, name: /Edit Agenda/i })).toBeInTheDocument()

    const inputJudul = screen.getByLabelText(/Nama Agenda/i)
    await user.clear(inputJudul)
    const judulUpdate = 'Rapat Pleno Komite & Sosialisasi Terpadu Revisi'
    await user.type(inputJudul, judulUpdate)

    await user.click(screen.getByRole('button', { name: /Simpan Agenda/i }))

    await waitFor(() => {
      expect(screen.getByText('Agenda berhasil diperbarui.')).toBeInTheDocument()
    })

    expect(await screen.findByText(judulUpdate)).toBeInTheDocument()
  })

  it('hapus agenda menampilkan dialog konfirmasi dan menghapus baris setelah konfirmasi', async () => {
    const user = await renderAplikasi('/admin/agenda')

    await waitFor(() => {
      expect(screen.getByText(mockAgenda[0].judul)).toBeInTheDocument()
    })

    const judulDihapus = mockAgenda[0].judul
    const tombolHapus = screen.getByRole('button', { name: new RegExp(`Hapus ${judulDihapus}`, 'i') })
    await user.click(tombolHapus)

    // Dialog konfirmasi terbuka
    const dialog = screen.getByRole('dialog', { name: 'Hapus agenda ini?' })
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText(new RegExp(judulDihapus, 'i'))).toBeInTheDocument()

    // Klik tombol konfirmasi Hapus di dalam dialog
    const tombolKonfirmasi = within(dialog).getByRole('button', { name: 'Hapus' })
    await user.click(tombolKonfirmasi)

    // Notifikasi sukses tampil dan judul terhapus dari tampilan
    await waitFor(() => {
      expect(screen.getByText(`Agenda “${judulDihapus}” berhasil dihapus.`)).toBeInTheDocument()
    })

    expect(screen.queryByText(judulDihapus)).not.toBeInTheDocument()
  })
})
