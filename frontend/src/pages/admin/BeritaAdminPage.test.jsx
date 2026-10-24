import { describe, it, expect } from 'vitest'
import { screen, within } from '@testing-library/react'
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

  describe('tabel & paginasi', () => {
    it('tidak lagi menampilkan kartu ringkasan dan tombol ekspor (desain baru)', async () => {
      await renderAplikasi()
      expect(screen.queryByRole('region', { name: 'Ringkasan artikel' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /Ekspor Data/ })).not.toBeInTheDocument()
    })

    it('halaman 1 menampilkan 5 artikel terbaru dengan format tanggal Indonesia', async () => {
      await renderAplikasi()
      const baris = barisData()
      expect(baris).toHaveLength(5)
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 48 artikel')
      expect(within(baris[0]).getByText(/Tim Robotik SMA Harapan Jaya/)).toBeInTheDocument()
      expect(within(baris[0]).getByText('24 Feb 2026')).toBeInTheDocument()
      expect(within(baris[0]).getByText('Terbit')).toBeInTheDocument()
      expect(within(baris[3]).getByText('Draf')).toBeInTheDocument()
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

  describe('filter & pencarian', () => {
    it('filter belum diterapkan sebelum tombol Filter ditekan', async () => {
      const user = await renderAplikasi()
      await user.selectOptions(screen.getByLabelText('Status:'), 'draf')
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 48 artikel')
      await user.click(screen.getByRole('button', { name: 'Filter' }))
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 6 artikel')
    })

    it('filter status Draf → 6 artikel dalam 2 halaman', async () => {
      const user = await renderAplikasi()
      await user.selectOptions(screen.getByLabelText('Status:'), 'draf')
      await user.click(screen.getByRole('button', { name: 'Filter' }))
      expect(barisData()).toHaveLength(5)
      await user.click(screen.getByRole('button', { name: 'Halaman 2' }))
      expect(barisData()).toHaveLength(1)
      expect(ringkasanHalaman()).toBe('Menampilkan 6 - 6 dari 6 artikel')
    })

    it('filter kategori + status digabung', async () => {
      const user = await renderAplikasi()
      await user.selectOptions(screen.getByLabelText('Kategori:'), 'Pengumuman Resmi')
      await user.selectOptions(screen.getByLabelText('Status:'), 'terbit')
      await user.click(screen.getByRole('button', { name: 'Filter' }))
      barisData().forEach((b) => expect(within(b).getByText('Pengumuman Resmi')).toBeInTheDocument())
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

  describe('pilih & hapus', () => {
    it('checkbox header memilih semua baris di halaman, indikator jumlah muncul', async () => {
      const user = await renderAplikasi()
      await user.click(screen.getByRole('checkbox', { name: 'Pilih semua artikel di halaman ini' }))
      expect(screen.getByText('5 dipilih')).toBeInTheDocument()
      await user.click(screen.getAllByRole('checkbox')[1]) // lepas satu baris
      expect(screen.getByText('4 dipilih')).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Pilih semua artikel di halaman ini' })).not.toBeChecked()
    })

    it('hapus: dialog konfirmasi, batal tidak mengubah data', async () => {
      const user = await renderAplikasi()
      await user.click(screen.getByRole('button', { name: /Hapus artikel Tim Robotik/ }))
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByText('Hapus artikel ini?')).toBeInTheDocument()
      await user.click(within(dialog).getByRole('button', { name: 'Batal' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 48 artikel')
    })

    it('hapus: Esc menutup dialog', async () => {
      const user = await renderAplikasi()
      await user.click(screen.getByRole('button', { name: /Hapus artikel Tim Robotik/ }))
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('hapus: konfirmasi menghapus baris dan menampilkan pemberitahuan', async () => {
      const user = await renderAplikasi()
      await user.click(screen.getByRole('button', { name: /Hapus artikel Tim Robotik SMA Harapan Jaya/ }))
      await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Hapus' }))
      expect(screen.getByRole('status')).toHaveTextContent('berhasil dihapus')
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 47 artikel')
      expect(barisData()[0]).not.toHaveTextContent('Tim Robotik SMA Harapan Jaya Sabet')
    })

    it('hapus artikel draf mengurangi jumlah hasil saat filter Draf aktif', async () => {
      const user = await renderAplikasi()
      await user.selectOptions(screen.getByLabelText('Status:'), 'draf')
      await user.click(screen.getByRole('button', { name: 'Filter' }))
      // ada lebih dari satu draf "Sosialisasi Asesmen" di data tiruan → ambil yang pertama
      await user.click(screen.getAllByRole('button', { name: /Hapus artikel Sosialisasi Asesmen/ })[0])
      await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Hapus' }))
      expect(await screen.findByText(/dari 5 artikel/)).toBeInTheDocument()
    })
  })

  describe('aksi baris', () => {
    it('Edit dan Tambah mengarah ke rute CMS, Lihat di Portal membuka tab baru', async () => {
      await renderAplikasi()
      expect(screen.getByRole('link', { name: 'Tambah Berita Baru' })).toHaveAttribute('href', '/admin/berita/baru')
      expect(screen.getByRole('link', { name: /Edit artikel Tim Robotik/ })).toHaveAttribute('href', '/admin/berita/1/edit')
      const lihat = screen.getByRole('link', { name: /Lihat artikel Tim Robotik.* di portal/ })
      expect(lihat).toHaveAttribute('href', '/berita/tim-robotik-juara-wro-2026-tokyo')
      expect(lihat).toHaveAttribute('target', '_blank')
      expect(lihat).toHaveAttribute('rel', expect.stringContaining('noopener'))
    })
  })
})
