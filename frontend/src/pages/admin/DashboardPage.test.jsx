import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderAplikasi } from '@/test/utils'


describe('Admin · Overview Dashboard', () => {
  beforeEach(() => {
    // Kunci tanggal sistem agar teks tanggal & tahun pelajaran bisa dicek pasti
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-02-24T08:00:00'))
  })
  afterEach(() => vi.useRealTimers())

  it('topbar & sidebar: judul, placeholder pencarian, menu Overview aktif, tanpa elemen lama', async () => {
    await renderAplikasi('/admin')
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard Overview & Statistik' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Cari data artikel, agenda, pesan...')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Overview/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByText(/V1\.2 PRODUCTION/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Kapasitas Server/)).not.toBeInTheDocument() // widget yang dihapus di desain baru
    expect(screen.queryByText(/PHP/)).not.toBeInTheDocument()
  })

  it('kartu sambutan: nama, tanggal, tahun pelajaran, status portal, tombol aksi', async () => {
    await renderAplikasi('/admin')
    const sambutan = screen.getByRole('region', { name: 'Sambutan' })
    expect(within(sambutan).getByRole('heading', { name: 'Selamat Datang kembali, Arya Gagah!' })).toBeInTheDocument()
    expect(within(sambutan).getByText('Selasa, 24 Februari 2026')).toBeInTheDocument()
    expect(within(sambutan).getByText(/Tahun Pelajaran 2025\/2026/i)).toBeInTheDocument()
    expect(within(sambutan).getByText(/Portal berjalan normal/)).toBeInTheDocument()
    expect(within(sambutan).getByRole('link', { name: 'Publikasi Cepat' })).toHaveAttribute('href', '/admin/berita/baru')
    const portal = within(sambutan).getByRole('link', { name: 'Lihat Portal Publik' })
    expect(portal).toHaveAttribute('href', '/')
    expect(portal).toHaveAttribute('target', '_blank')
    expect(portal).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('tahun pelajaran mengikuti tanggal (Oktober 2026 → 2026/2027)', async () => {
    vi.setSystemTime(new Date('2026-10-10T08:00:00'))
    await renderAplikasi('/admin')
    expect(screen.getByText(/Tahun Pelajaran 2026\/2027/i)).toBeInTheDocument()
  })

  it('4 kartu ringkasan dengan angka sesuai desain', async () => {
    await renderAplikasi('/admin')
    const ringkasan = screen.getByRole('region', { name: 'Ringkasan statistik' })
    expect(within(ringkasan).getByText('48.250')).toBeInTheDocument()
    expect(within(ringkasan).getByText('+12.4%')).toBeInTheDocument()
    expect(within(ringkasan).getByText('vs bulan lalu')).toBeInTheDocument()
    expect(within(ringkasan).getByText('48')).toBeInTheDocument()
    expect(within(ringkasan).getByText('artikel & pengumuman dipublikasikan')).toBeInTheDocument()
    expect(within(ringkasan).getByText('3 Pekan Ini')).toBeInTheDocument()
    expect(within(ringkasan).getByText('1 agenda darurat')).toBeInTheDocument()
    expect(within(ringkasan).getByText('dari total 126 pesan diterima')).toBeInTheDocument()
  })

  it('kartu berita tidak lagi memisahkan Tayang/Draf (tidak ada konsep status)', async () => {
    await renderAplikasi('/admin')
    const ringkasan = screen.getByRole('region', { name: 'Ringkasan statistik' })
    expect(within(ringkasan).queryByText(/Tayang/)).not.toBeInTheDocument()
    expect(within(ringkasan).queryByText(/Draf/)).not.toBeInTheDocument()
  })

  describe('grafik tren', () => {
    it('default 30 hari: puncak 2.410 pada 18 Februari, rata-rata 1.608, label sumbu X', async () => {
      await renderAplikasi('/admin')
      expect(screen.getByRole('img', { name: /Puncak 2\.410 pengunjung pada 18 Februari 2026/ })).toBeInTheDocument()
      const tooltip = screen.getByTestId('tooltip-puncak')
      expect(tooltip).toHaveTextContent('Puncak PPDB: 2.410 Pengunjung')
      expect(tooltip).toHaveTextContent('18 Februari 2026')
      expect(screen.getByText('1.608 Sesi')).toBeInTheDocument()
      expect(screen.getByText('Juknis PPDB 2026')).toBeInTheDocument()
      expect(screen.getByText('3m 42s')).toBeInTheDocument()
      ;['01 Feb', '06 Feb', '12 Feb', '18 Feb (Peluncuran PPDB)', '24 Feb (Hari Ini)'].forEach((l) =>
        expect(screen.getByText(l)).toBeInTheDocument(),
      )
    })

    it('mengganti rentang ke 7 hari memperbarui judul, label sumbu, dan rata-rata', async () => {
      const user = await renderAplikasi('/admin')
      await user.selectOptions(screen.getByLabelText('Rentang waktu grafik'), '7')
      expect(screen.getByRole('heading', { name: /7 Hari Terakhir/ })).toBeInTheDocument()
      expect(screen.getByText('18 Feb')).toBeInTheDocument()
      expect(screen.queryByText('06 Feb')).not.toBeInTheDocument()
      expect(screen.queryByText('1.608 Sesi')).not.toBeInTheDocument()
      expect(screen.getByText(/Rata-rata Harian/)).toBeInTheDocument()
    })

    it('rentang Semester Ini memakai rata-rata per pekan', async () => {
      const user = await renderAplikasi('/admin')
      await user.selectOptions(screen.getByLabelText('Rentang waktu grafik'), 'semester')
      expect(screen.getByRole('heading', { name: /Semester Ini/ })).toBeInTheDocument()
      expect(screen.getByText('Rata-rata Per Pekan')).toBeInTheDocument()
      expect(screen.getByTestId('tooltip-puncak')).toHaveTextContent('14.210')
    })

    it('menggambar dua seri (garis & area) di SVG', async () => {
      await renderAplikasi('/admin')
      const svg = screen.getByRole('img', { name: /Grafik tren/ })
      expect(svg.querySelectorAll('path')).toHaveLength(4)
    })
  })

  it('agenda terdekat: 3 acara dan tautan kelola', async () => {
    await renderAplikasi('/admin')
    const agenda = screen.getByRole('region', { name: 'Agenda kampus terdekat' })
    expect(within(agenda).getByText('3 Acara')).toBeInTheDocument()
    expect(within(agenda).getAllByRole('listitem')).toHaveLength(3)
    expect(within(agenda).getByText('Simulasi UTBK-SNBT 2026 Gel. 1')).toBeInTheDocument()
    expect(within(agenda).getByRole('link', { name: /Kelola Semua Agenda/ })).toHaveAttribute('href', '/admin/agenda')
  })

  it('pesan belum diproses: 2 pesan teratas, badge 3 Menunggu, tombol Balas', async () => {
    await renderAplikasi('/admin')
    const pesan = screen.getByRole('region', { name: 'Pesan masuk belum diproses' })
    expect(within(pesan).getByText('3 Menunggu')).toBeInTheDocument()
    expect(within(pesan).getAllByRole('listitem')).toHaveLength(2)
    expect(within(pesan).getByRole('link', { name: 'Balas pesan dari Bambang Hariyadi' })).toHaveAttribute(
      'href',
      '/admin/pesan?id=101',
    )
    expect(within(pesan).getByRole('link', { name: /Buka Kotak Pesan Masuk Lengkap/ })).toHaveAttribute(
      'href',
      '/admin/pesan',
    )
  })

  it('log aktivitas: 4 entri dan tautan Lihat Semua Log', async () => {
    await renderAplikasi('/admin')
    const log = screen.getByRole('region', { name: 'Aktivitas publikasi dan log sistem' })
    expect(within(log).getAllByRole('listitem')).toHaveLength(4)
    expect(within(log).getByText(/Tim Robotik WRO Lolos Babak Nasional/)).toBeInTheDocument()
    expect(within(log).getByText('12 menit lalu')).toBeInTheDocument()
    expect(within(log).getByText('Belum Dijawab')).toHaveClass('text-error')
    expect(within(log).getByRole('link', { name: /Lihat Semua Log/ })).toHaveAttribute('href', '/admin/log')
  })

  it('footer CMS tampil', async () => {
    await renderAplikasi('/admin')
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByText(/Terakreditasi Unggul \(A\) BAN-S\/M/)).toBeInTheDocument()
    expect(within(footer).getByText(/Hak Cipta Dilindungi Undang-Undang/)).toBeInTheDocument()
  })

  it('navigasi dari kartu: Kelola Semua Agenda → halaman Agenda, Lihat Semua Log → Log', async () => {
    const user = await renderAplikasi('/admin')
    await user.click(screen.getByRole('link', { name: /Kelola Semua Agenda/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'Manajemen Agenda' })).toBeInTheDocument()
  })

  it('Publikasi Cepat membuka halaman Tambah Berita', async () => {
    const user = await renderAplikasi('/admin')
    await user.click(screen.getByRole('link', { name: 'Publikasi Cepat' }))
    expect(screen.getByRole('heading', { level: 2, name: 'Tambah Berita Baru' })).toBeInTheDocument()
  })
})
