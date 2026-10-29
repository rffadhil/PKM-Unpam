import { describe, it, expect } from 'vitest'
import { screen, within, waitFor } from '@testing-library/react'
import { renderAplikasi } from '@/test/utils'


// Baris data di <tbody> (tanpa baris header)
const barisData = () => within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')
const ringkasanHalaman = () => screen.getByText(/Menampilkan/).textContent.replace(/\s+/g, ' ').trim()

describe('Admin · Berita & Pengumuman', () => {
  describe('layout (sidebar & topbar)', () => {
    it('menampilkan topbar bersih: judul, pencarian, notifikasi, profil', async () => {
      await renderAplikasi()
      expect(screen.getByRole('heading', { level: 1, name: 'Manajemen Berita & Pengumuman' })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Cari judul berita, kata kunci, atau penulis...')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Notifikasi, 2 belum dibaca/ })).toBeInTheDocument()
      expect(screen.getByText('Super Admin')).toBeInTheDocument()
      // elemen yang sengaja dihilangkan dari versi lama
      expect(screen.queryByText(/Server Online/)).not.toBeInTheDocument()
      expect(screen.queryByText(/v1\.2 Production/)).not.toBeInTheDocument()
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument() // breadcrumb
    })

    it('sidebar memuat 8 menu, menu Berita aktif, badge pesan baru', async () => {
      await renderAplikasi()
      const nav = screen.getByRole('navigation', { name: 'Navigasi CMS' })
      expect(within(nav).getAllByRole('link')).toHaveLength(8)
      expect(within(nav).getByRole('link', { name: /Berita & Pengumuman/ })).toHaveAttribute('aria-current', 'page')
      expect(within(nav).getByRole('link', { name: /Agenda/ })).not.toHaveAttribute('aria-current')
      expect(within(nav).getByText('3 baru')).toBeInTheDocument()
      expect(screen.getByText('NPSN: 20108392')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Keluar dari Sistem/ })).toHaveAttribute('href', '/admin/login')
    })

    it('klik menu Agenda pindah halaman dan judul topbar berubah', async () => {
      const user = await renderAplikasi()
      await user.click(within(screen.getByRole('navigation', { name: 'Navigasi CMS' })).getByRole('link', { name: /Agenda/ }))
      expect(screen.getByRole('heading', { level: 1, name: 'Manajemen Agenda' })).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Cari agenda atau lokasi...')).toBeInTheDocument()
    })

    it('/admin membuka Overview dengan menu Overview aktif', async () => {
      await renderAplikasi('/admin')
      expect(screen.getByRole('heading', { level: 1, name: 'Dashboard Overview & Statistik' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Overview/ })).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('desain final: tanpa statistik, status, ekspor, dan checkbox', () => {
    it('tidak ada kartu ringkasan, tombol ekspor, filter status, maupun kolom checkbox', async () => {
      await renderAplikasi()
      expect(screen.queryByRole('region', { name: 'Ringkasan artikel' })).not.toBeInTheDocument()
      expect(screen.queryByText('Total Artikel')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Ekspor Data/ })).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Status:')).not.toBeInTheDocument()
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
      expect(screen.queryByText('Terbit')).not.toBeInTheDocument()
      expect(screen.queryByText('Draf')).not.toBeInTheDocument()
    })

    it('kolom tabel: Judul & Cuplikan, Kategori, Penulis, Tanggal, Aksi', async () => {
      await renderAplikasi()
      const kolom = screen.getAllByRole('columnheader').map((k) => k.textContent.trim())
      expect(kolom).toEqual(['Judul Artikel & Cuplikan', 'Kategori', 'Penulis', 'Tanggal', 'Aksi'])
    })

    it('header kartu: judul, deskripsi, dan satu tombol Tambah Berita Baru', async () => {
      await renderAplikasi()
      expect(screen.getByRole('heading', { name: 'Daftar Artikel & Publikasi Sekolah' })).toBeInTheDocument()
      expect(screen.getByText(/Kelola berita utama, rilis pers/)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Tambah Berita Baru' })).toHaveAttribute('href', '/admin/berita/baru')
      expect(screen.getByText('Urutkan:')).toBeInTheDocument()
      expect(screen.getByText('Terbaru (Default)')).toBeInTheDocument()
    })
  })

  describe('tabel & paginasi', () => {
    it('halaman 1 menampilkan 5 artikel terbaru dengan tanggal berformat Indonesia', async () => {
      await renderAplikasi()
      const baris = barisData()
      expect(baris).toHaveLength(5)
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 48 artikel')
      expect(within(baris[0]).getByText(/Tim Robotik SMA Harapan Jaya/)).toBeInTheDocument()
      expect(within(baris[0]).getByText('24 Feb 2026')).toBeInTheDocument()
      expect(within(baris[0]).getByText('Prestasi Siswa')).toBeInTheDocument()
      expect(within(baris[0]).getByText('Humas & Kesiswaan')).toBeInTheDocument()
      expect(within(baris[0]).getByText('humas@smaharapanjaya.sch.id')).toBeInTheDocument()
    })

    it('paginasi: ke halaman 2, Selanjutnya, dan tombol Sebelumnya nonaktif di halaman 1', async () => {
      const user = await renderAplikasi()
      expect(screen.getByRole('button', { name: /Sebelumnya/ })).toBeDisabled()
      await user.click(screen.getByRole('button', { name: 'Halaman 2' }))
      expect(ringkasanHalaman()).toBe('Menampilkan 6 - 10 dari 48 artikel')
      expect(screen.getByRole('button', { name: 'Halaman 2' })).toHaveAttribute('aria-current', 'page')
      await user.click(screen.getByRole('button', { name: /Selanjutnya/ }))
      expect(ringkasanHalaman()).toBe('Menampilkan 11 - 15 dari 48 artikel')
      await user.click(screen.getByRole('button', { name: 'Halaman 10' }))
      expect(ringkasanHalaman()).toBe('Menampilkan 46 - 48 dari 48 artikel')
      expect(screen.getByRole('button', { name: /Selanjutnya/ })).toBeDisabled()
    })
  })

  describe('filter kategori & pencarian', () => {
    it('filter belum diterapkan sebelum tombol Filter ditekan', async () => {
      const user = await renderAplikasi()
      await user.selectOptions(screen.getByLabelText('Kategori:'), 'Akademik')
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 48 artikel')
      await user.click(screen.getByRole('button', { name: 'Filter' }))
      expect(ringkasanHalaman()).not.toBe('Menampilkan 1 - 5 dari 48 artikel')
    })

    it('filter kategori hanya menampilkan kategori itu di semua halaman', async () => {
      const user = await renderAplikasi()
      await user.selectOptions(screen.getByLabelText('Kategori:'), 'Pengumuman Resmi')
      await user.click(screen.getByRole('button', { name: 'Filter' }))
      // 2 dari tiap 5 artikel dasar berkategori Pengumuman Resmi → 19 dari 48 (id 3, 5, 8, 10, ..., 48)
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 19 artikel')
      barisData().forEach((b) => expect(within(b).getByText('Pengumuman Resmi')).toBeInTheDocument())
      await user.click(screen.getByRole('button', { name: 'Halaman 4' }))
      barisData().forEach((b) => expect(within(b).getByText('Pengumuman Resmi')).toBeInTheDocument())
    })

    it('"Semua Kategori" mengembalikan seluruh artikel', async () => {
      const user = await renderAplikasi()
      await user.selectOptions(screen.getByLabelText('Kategori:'), 'Akademik')
      await user.click(screen.getByRole('button', { name: 'Filter' }))
      await user.selectOptions(screen.getByLabelText('Kategori:'), 'semua')
      await user.click(screen.getByRole('button', { name: 'Filter' }))
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 48 artikel')
    })

    it('pencarian di topbar menyaring judul/penulis dan kembali ke halaman 1', async () => {
      const user = await renderAplikasi()
      await user.click(screen.getByRole('button', { name: 'Halaman 3' }))
      await user.type(screen.getByRole('searchbox', { name: 'Cari di halaman ini' }), 'robotik')
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 10 artikel')
      barisData().forEach((b) => expect(within(b).getByText(/Robotik/)).toBeInTheDocument())

      await user.clear(screen.getByRole('searchbox'))
      await user.type(screen.getByRole('searchbox'), 'panitia ppdb')
      expect(barisData().length).toBeGreaterThan(0)
    })

    it('pencarian digabung dengan filter kategori', async () => {
      const user = await renderAplikasi()
      await user.selectOptions(screen.getByLabelText('Kategori:'), 'Prestasi Siswa')
      await user.click(screen.getByRole('button', { name: 'Filter' }))
      await user.type(screen.getByRole('searchbox'), 'robotik')
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 10 artikel') // semua artikel robotik berkategori Prestasi Siswa
      await user.clear(screen.getByRole('searchbox'))
      await user.type(screen.getByRole('searchbox'), 'ppdb')
      expect(screen.getByText('Tidak ada artikel yang cocok dengan filter atau pencarian.')).toBeInTheDocument()
    })

    it('hasil kosong menampilkan pesan, bukan tabel kosong', async () => {
      const user = await renderAplikasi()
      await user.type(screen.getByRole('searchbox'), 'zzzzzz')
      expect(screen.getByText('Tidak ada artikel yang cocok dengan filter atau pencarian.')).toBeInTheDocument()
      expect(ringkasanHalaman()).toBe('Menampilkan 0 - 0 dari 0 artikel')
    })

    it('pencarian tidak terbawa ke halaman menu lain', async () => {
      const user = await renderAplikasi()
      await user.type(screen.getByRole('searchbox'), 'robotik')
      const nav = screen.getByRole('navigation', { name: 'Navigasi CMS' })
      await user.click(within(nav).getByRole('link', { name: /Agenda/ }))
      expect(screen.getByRole('searchbox')).toHaveValue('')
    })
  })

  describe('hapus', () => {
    it('dialog konfirmasi; Batal tidak mengubah data', async () => {
      const user = await renderAplikasi()
      await user.click(screen.getByRole('button', { name: /Hapus artikel Tim Robotik/ }))
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByText('Hapus artikel ini?')).toBeInTheDocument()
      await user.click(within(dialog).getByRole('button', { name: 'Batal' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 48 artikel')
    })

    it('Esc menutup dialog', async () => {
      const user = await renderAplikasi()
      await user.click(screen.getByRole('button', { name: /Hapus artikel Tim Robotik/ }))
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('konfirmasi menghapus baris dan menampilkan pemberitahuan', async () => {
      const user = await renderAplikasi()
      await user.click(screen.getByRole('button', { name: /Hapus artikel Tim Robotik SMA Harapan Jaya/ }))
      await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Hapus' }))
      expect(await screen.findByText(/berhasil dihapus/)).toBeInTheDocument()
      await waitFor(() => expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 47 artikel'))
      expect(barisData()[0]).not.toHaveTextContent('Tim Robotik SMA Harapan Jaya Sabet')
    })

    it('jumlah artikel di Overview ikut berkurang setelah hapus', async () => {
      const user = await renderAplikasi()
      await user.click(screen.getByRole('button', { name: /Hapus artikel Tim Robotik SMA Harapan Jaya/ }))
      await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Hapus' }))
      await screen.findByText(/berhasil dihapus/)
      await user.click(within(screen.getByRole('navigation', { name: 'Navigasi CMS' })).getByRole('link', { name: /Overview/ }))
      expect(await screen.findByText('artikel & pengumuman dipublikasikan')).toBeInTheDocument()
      expect(screen.getByText('47')).toBeInTheDocument()
    })
  })

  describe('aksi baris', () => {
    it('Edit mengarah ke form edit, Lihat di Portal membuka tab baru', async () => {
      await renderAplikasi()
      expect(screen.getByRole('link', { name: /Edit artikel Tim Robotik/ })).toHaveAttribute('href', '/admin/berita/1/edit')
      const lihat = screen.getByRole('link', { name: /Lihat artikel Tim Robotik.* di portal/ })
      expect(lihat).toHaveAttribute('href', '/berita/tim-robotik-juara-wro-2026-tokyo')
      expect(lihat).toHaveAttribute('target', '_blank')
      expect(lihat).toHaveAttribute('rel', expect.stringContaining('noopener'))
    })

    it('artikel yang disematkan diberi ikon pin', async () => {
      await renderAplikasi()
      const barisPin = barisData().find((b) => within(b).queryByTitle('Disematkan di Beranda'))
      expect(barisPin).toBeTruthy()
      expect(within(barisPin).getByText(/Verifikasi Berkas/)).toBeInTheDocument()
    })
  })
})
