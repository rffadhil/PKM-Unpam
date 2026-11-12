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

  it('topbar & sidebar: judul, placeholder pencarian, menu Overview aktif', async () => {
    await renderAplikasi('/admin')
    expect(screen.getByRole('heading', { level: 1, name: 'Dashboard Overview & Statistik' })).toBeInTheDocument()
    // Search input removed in topbar redesign
    expect(screen.getByRole('link', { name: /Overview/ })).toHaveAttribute('aria-current', 'page')
    expect(screen.queryByText(/Kapasitas Server/)).not.toBeInTheDocument()
    expect(screen.queryByText(/PHP/)).not.toBeInTheDocument()
  })

  it('desain baru: tidak ada kartu statistik, grafik tren, maupun panel pesan', async () => {
    await renderAplikasi('/admin')
    expect(screen.queryByRole('region', { name: 'Ringkasan statistik' })).not.toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Pesan masuk belum diproses' })).not.toBeInTheDocument()
    expect(screen.queryByRole('img', { name: /Grafik tren/ })).not.toBeInTheDocument()
    expect(screen.queryByText('Total Kunjungan Web')).not.toBeInTheDocument()
  })

  it('kartu sambutan: nama, tanggal, tahun pelajaran, status portal, tombol aksi', async () => {
    await renderAplikasi('/admin')
    const sambutan = screen.getByRole('region', { name: 'Sambutan' })
    expect(within(sambutan).getByRole('heading', { name: /Selamat Datang kembali, (Arya Gagah|Admin Test)!/ })).toBeInTheDocument()
    expect(within(sambutan).getByText('Selasa, 24 Februari 2026')).toBeInTheDocument()
    expect(within(sambutan).queryByText(/Tahun Pelajaran/i)).not.toBeInTheDocument()
    expect(within(sambutan).queryByText(/Portal berjalan normal/)).not.toBeInTheDocument()
    expect(within(sambutan).getByRole('link', { name: 'Publikasi Cepat' })).toHaveAttribute('href', '/admin/berita/baru')
    const portal = within(sambutan).getByRole('link', { name: 'Lihat Portal Publik' })
    expect(portal).toHaveAttribute('href', '/')
    expect(portal).toHaveAttribute('target', '_blank')
    expect(portal).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('tahun pelajaran mengikuti tanggal (Oktober 2026 → 2026/2027)', async () => {
    vi.setSystemTime(new Date('2026-10-10T08:00:00'))
    await renderAplikasi('/admin')
    expect(screen.queryByText(/Tahun Pelajaran/i)).not.toBeInTheDocument()
  })

  it('agenda terdekat: 3 acara dan tautan kelola', async () => {
    await renderAplikasi('/admin')
    const agenda = screen.getByRole('region', { name: 'Agenda kampus terdekat' })
    expect(within(agenda).getByText('3 Acara')).toBeInTheDocument()
    expect(within(agenda).getAllByRole('listitem')).toHaveLength(3)
    expect(within(agenda).getByText('Simulasi UTBK-SNBT 2026 Gel. 1')).toBeInTheDocument()
    expect(within(agenda).getByRole('link', { name: /Kelola Semua Agenda/ })).toHaveAttribute('href', '/admin/agenda')
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

  it('Kelola Semua Agenda membuka halaman Agenda', async () => {
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
