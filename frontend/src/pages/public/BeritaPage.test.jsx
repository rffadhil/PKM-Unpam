import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BeritaPage from './BeritaPage'

// --- data uji: 14 artikel, id 1 paling baru. Headline = id 1; pengumuman = 3, 6 (disematkan), 10, 14 ---
const KATEGORI = {
  1: 'Prestasi Siswa', 2: 'Adiwiyata & Lingkungan', 3: 'Pengumuman Resmi', 4: 'Akademik', 5: 'Prestasi Siswa',
  6: 'Pengumuman Resmi', 7: 'Adiwiyata & Lingkungan', 8: 'Akademik', 9: 'Prestasi Siswa', 10: 'Pengumuman Resmi',
  11: 'Adiwiyata & Lingkungan', 12: 'Akademik', 13: 'Prestasi Siswa', 14: 'Pengumuman Resmi',
}
const JUDUL = { 1: 'Tim Robotik Juara Nasional', 9: 'Klub Robotik Pemula Berprestasi' }
const buatData = () =>
  Array.from({ length: 14 }, (_, i) => {
    const id = i + 1
    return {
      id,
      slug: `slug-${id}`,
      judul: JUDUL[id] ?? `Artikel nomor ${id}`,
      ringkasan: `Ringkasan artikel ${id}`,
      kategori: KATEGORI[id],
      gambar: '',
      tanggal: `2026-02-${String(25 - id).padStart(2, '0')}`,
      konten: `<p>${'kata '.repeat(400)}</p>`,
      penulis: { nama: 'Humas & Kesiswaan', email: 'humas@x.id', inisial: 'HK' },
      disematkan: id === 6,
    }
  })

function Probe() {
  const { search } = useLocation()
  return <output data-testid="url">{search}</output>
}

async function renderBerita(url = '/berita', data = buatData()) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => data }))
  const user = userEvent.setup()
  const klien = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  render(
    <QueryClientProvider client={klien}>
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route
            path="/berita"
            element={
              <>
                <BeritaPage />
                <Probe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
  await waitFor(() => expect(screen.queryByText('Memuat data…')).not.toBeInTheDocument())
  return user
}

const ringkasan = () => screen.getByText(/Menampilkan \d/).textContent.replace(/\s+/g, ' ').trim()
const kartu = () => within(screen.getByRole('region', { name: 'Kumpulan Warta Terkini' })).getAllByRole('article')
const judulKartu = () => kartu().map((k) => within(k).getByRole('heading', { level: 3 }).textContent)
const url = () => screen.getByTestId('url').textContent

describe('Halaman Berita publik (/berita)', () => {
  afterEach(() => vi.unstubAllGlobals())

  describe('tampilan awal', () => {
    it('menampilkan kerangka pemuatan lalu isi', async () => {
      vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {}))) // tidak pernah selesai
      render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter initialEntries={['/berita']}>
            <BeritaPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )
      expect(screen.getByRole('status')).toHaveTextContent('Memuat data…')
      expect(screen.getByRole('heading', { level: 1, name: 'Warta & Informasi Sekolah Harapan Jaya' })).toBeInTheDocument()
    })

    it('judul halaman, kanal resmi, dan deskripsi', async () => {
      await renderBerita()
      expect(screen.getByRole('heading', { level: 1, name: 'Warta & Informasi Sekolah Harapan Jaya' })).toBeInTheDocument()
      expect(screen.getByText('Kanal Resmi Warta Sekolah')).toBeInTheDocument()
      expect(screen.getByText(/Pusat publikasi berita terkini/)).toBeInTheDocument()
    })

    it('mengisi judul dokumen untuk SEO', async () => {
      await renderBerita()
      await waitFor(() => expect(document.title).toBe('Berita & Pengumuman — SMA Harapan Jaya'))
    })

    it('tombol kategori memuat jumlah artikel dari data (bukan angka tetap)', async () => {
      await renderBerita()
      const grup = screen.getByRole('group', { name: 'Filter kategori berita' })
      const label = within(grup).getAllByRole('button').map((b) => b.textContent)
      expect(label).toEqual([
        'Semua Berita (14)',
        'Prestasi Siswa (4)',
        'Adiwiyata & Lingkungan (3)',
        'Akademik (3)',
        'Pengumuman Resmi (4)',
      ])
      expect(within(grup).getByRole('button', { name: /Semua Berita/ })).toHaveAttribute('aria-pressed', 'true')
    })

    it('headline = artikel terbaru non-pengumuman, dengan penulis dan tautan baca', async () => {
      await renderBerita()
      const headline = screen.getAllByRole('article')[0]
      expect(within(headline).getByRole('heading', { level: 2, name: 'Tim Robotik Juara Nasional' })).toBeInTheDocument()
      expect(within(headline).getByText('Headline Utama')).toBeInTheDocument()
      expect(within(headline).getByText('Prestasi Siswa')).toBeInTheDocument()
      expect(within(headline).getByText('24 Februari 2026')).toBeInTheDocument()
      expect(within(headline).getByText('3 menit baca')).toBeInTheDocument()
      expect(within(headline).getByText('Humas & Kesiswaan')).toBeInTheDocument()
      expect(within(headline).getByRole('link', { name: /Baca Selengkapnya/ })).toHaveAttribute('href', '/berita/slug-1')
    })

    it('grid memuat 6 kartu per halaman dan tidak mengulang headline', async () => {
      await renderBerita()
      expect(kartu()).toHaveLength(6)
      expect(ringkasan()).toBe('Menampilkan 1–6 dari 13 artikel')
      expect(judulKartu()).not.toContain('Tim Robotik Juara Nasional')
      expect(judulKartu()[0]).toBe('Artikel nomor 2')
      const pertama = kartu()[0]
      expect(within(pertama).getByText('23 Feb 2026')).toBeInTheDocument()
      expect(within(pertama).getByText('Adiwiyata & Lingkungan')).toBeInTheDocument()
      expect(within(pertama).getByText('3 mnt baca')).toBeInTheDocument()
      expect(within(pertama).getByRole('link', { name: 'Artikel nomor 2' })).toHaveAttribute('href', '/berita/slug-2')
    })
  })

  describe('paginasi', () => {
    it('jumlah halaman dihitung dari data nyata (13 artikel → 3 halaman) dan tersimpan di URL', async () => {
      const user = await renderBerita()
      expect(screen.getByText(/Menampilkan halaman/).textContent.replace(/\s+/g, ' ')).toContain('1 dari 3 (Total 13 Berita)')
      await user.click(screen.getByRole('button', { name: /Selanjutnya/ }))
      expect(ringkasan()).toBe('Menampilkan 7–12 dari 13 artikel')
      expect(url()).toBe('?hal=2')
      await user.click(screen.getByRole('button', { name: /Selanjutnya/ }))
      expect(ringkasan()).toBe('Menampilkan 13–13 dari 13 artikel')
      expect(kartu()).toHaveLength(1)
      expect(screen.getByRole('button', { name: /Selanjutnya/ })).toBeDisabled()
      await user.click(screen.getByRole('button', { name: /Sebelumnya/ }))
      await user.click(screen.getByRole('button', { name: /Sebelumnya/ }))
      expect(url()).toBe('') // halaman 1 tidak ditulis di URL
    })

    it('?hal berlebih dirapikan ke halaman terakhir; nilai tak valid ke halaman 1', async () => {
      await renderBerita('/berita?hal=99')
      expect(ringkasan()).toBe('Menampilkan 13–13 dari 13 artikel')
    })

    it('?hal tidak valid dianggap halaman 1', async () => {
      await renderBerita('/berita?hal=abc')
      expect(ringkasan()).toBe('Menampilkan 1–6 dari 13 artikel')
    })
  })

  describe('filter kategori', () => {
    it('memilih kategori menyaring semua halaman, menyembunyikan headline, dan menulis URL', async () => {
      const user = await renderBerita()
      await user.click(screen.getByRole('button', { name: 'Prestasi Siswa (4)' }))
      expect(screen.getByRole('button', { name: 'Prestasi Siswa (4)' })).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('button', { name: /Semua Berita/ })).toHaveAttribute('aria-pressed', 'false')
      expect(ringkasan()).toBe('Menampilkan 1–4 dari 4 artikel')
      expect(screen.queryByText('Headline Utama')).not.toBeInTheDocument()
      kartu().forEach((k) => expect(within(k).getByText('Prestasi Siswa')).toBeInTheDocument())
      expect(url()).toBe('?kategori=Prestasi+Siswa')
    })

    it('berpindah kategori mengembalikan ke halaman 1', async () => {
      const user = await renderBerita()
      await user.click(screen.getByRole('button', { name: /Selanjutnya/ }))
      expect(url()).toBe('?hal=2')
      await user.click(screen.getByRole('button', { name: 'Akademik (3)' }))
      expect(url()).toBe('?kategori=Akademik')
    })

    it('"Semua Berita" membersihkan filter dan headline kembali tampil', async () => {
      const user = await renderBerita('/berita?kategori=Akademik')
      expect(ringkasan()).toBe('Menampilkan 1–3 dari 3 artikel')
      await user.click(screen.getByRole('button', { name: /Semua Berita/ }))
      expect(url()).toBe('')
      expect(screen.getByText('Headline Utama')).toBeInTheDocument()
      expect(ringkasan()).toBe('Menampilkan 1–6 dari 13 artikel')
    })

    it('kategori di URL terbaca saat halaman dibuka', async () => {
      await renderBerita('/berita?kategori=Pengumuman%20Resmi')
      expect(screen.getByRole('button', { name: 'Pengumuman Resmi (4)' })).toHaveAttribute('aria-pressed', 'true')
      expect(ringkasan()).toBe('Menampilkan 1–4 dari 4 artikel')
    })
  })

  describe('pencarian & urutan', () => {
    it('mencari di judul dan menyimpan kata kunci di URL', async () => {
      const user = await renderBerita()
      await user.type(screen.getByRole('searchbox', { name: 'Cari berita' }), 'robotik')
      expect(ringkasan()).toBe('Menampilkan 1–2 dari 2 artikel')
      expect(judulKartu().sort()).toEqual(['Klub Robotik Pemula Berprestasi', 'Tim Robotik Juara Nasional'])
      expect(screen.queryByText('Headline Utama')).not.toBeInTheDocument()
      expect(url()).toBe('?q=robotik')
    })

    it('hasil kosong → pesan, lalu Reset Filter mengembalikan semua berita dan membersihkan URL', async () => {
      const user = await renderBerita()
      await user.type(screen.getByRole('searchbox', { name: 'Cari berita' }), 'zzzz')
      expect(screen.getByRole('heading', { name: 'Berita tidak ditemukan' })).toBeInTheDocument()
      expect(screen.getByText('Tidak ada artikel')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Reset Filter' }))
      expect(url()).toBe('')
      expect(screen.getByRole('searchbox', { name: 'Cari berita' })).toHaveValue('')
      expect(ringkasan()).toBe('Menampilkan 1–6 dari 13 artikel')
    })

    it('pencarian digabung dengan kategori', async () => {
      const user = await renderBerita('/berita?kategori=Akademik')
      await user.type(screen.getByRole('searchbox', { name: 'Cari berita' }), 'robotik')
      expect(screen.getByRole('heading', { name: 'Berita tidak ditemukan' })).toBeInTheDocument() // robotik bukan Akademik
    })

    it('urutan Terlama membalik daftar; headline tetap tampil', async () => {
      const user = await renderBerita()
      await user.selectOptions(screen.getByLabelText('Urutkan:'), 'terlama')
      expect(judulKartu()[0]).toBe('Artikel nomor 14')
      expect(screen.getByText('Headline Utama')).toBeInTheDocument()
      expect(url()).toBe('?urut=terlama')
      await user.selectOptions(screen.getByLabelText('Urutkan:'), 'terbaru')
      expect(url()).toBe('')
      expect(judulKartu()[0]).toBe('Artikel nomor 2')
    })

    it('?urut=terlama di URL terbaca saat halaman dibuka', async () => {
      await renderBerita('/berita?urut=terlama')
      expect(screen.getByLabelText('Urutkan:')).toHaveValue('terlama')
      expect(judulKartu()[0]).toBe('Artikel nomor 14')
    })
  })

  describe('sidebar', () => {
    it('Pengumuman Resmi: yang disematkan dulu, lalu terbaru, maksimal 3, dengan tautan baca', async () => {
      await renderBerita()
      const panel = screen.getByRole('region', { name: 'Pengumuman Resmi' })
      const judul = within(panel).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
      expect(judul).toEqual(['Artikel nomor 6', 'Artikel nomor 3', 'Artikel nomor 10'])
      expect(within(panel).getByText('Disematkan')).toBeInTheDocument()
      expect(within(panel).getByText('Penting')).toBeInTheDocument()
      expect(within(panel).getByRole('link', { name: 'Baca pengumuman: Artikel nomor 6' })).toHaveAttribute('href', '/berita/slug-6')
      expect(within(panel).getByRole('link', { name: /Lihat Seluruh Pengumuman Resmi \(4\)/ })).toHaveAttribute(
        'href',
        '/berita?kategori=Pengumuman%20Resmi',
      )
    })

    it('Pengumuman Resmi kosong menampilkan pesan', async () => {
      await renderBerita('/berita', buatData().filter((a) => a.kategori !== 'Pengumuman Resmi'))
      const panel = screen.getByRole('region', { name: 'Pengumuman Resmi' })
      expect(within(panel).getByText('Belum ada pengumuman resmi.')).toBeInTheDocument()
      expect(within(panel).getByRole('link', { name: /\(0\)/ })).toBeInTheDocument()
    })

    it('Layanan Pers & Liputan Media: email dan telepon dapat diklik', async () => {
      await renderBerita()
      const panel = screen.getByRole('region', { name: /Layanan Pers/ })
      expect(within(panel).getByRole('link', { name: 'redaksi.warta@smaharapanjaya.sch.id' })).toHaveAttribute(
        'href',
        'mailto:redaksi.warta@smaharapanjaya.sch.id',
      )
      expect(within(panel).getByRole('link', { name: '+62 812-8899-7766' })).toHaveAttribute('href', 'tel:+6281288997766')
    })
  })

  describe('kondisi khusus data', () => {
    it('tanpa artikel sama sekali: tidak ada headline, kartu kosong', async () => {
      await renderBerita('/berita', [])
      expect(screen.queryByText('Headline Utama')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Berita tidak ditemukan' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Semua Berita (0)' })).toBeInTheDocument()
    })

    it('satu artikel saja: menjadi headline, grid kosong', async () => {
      await renderBerita('/berita', [buatData()[0]])
      expect(screen.getByText('Headline Utama')).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Berita tidak ditemukan' })).toBeInTheDocument()
    })

    it('respons berbentuk { data: [...] } juga diterima', async () => {
      await renderBerita('/berita', { data: buatData() })
      expect(screen.getByRole('button', { name: 'Semua Berita (14)' })).toBeInTheDocument()
    })

    it('artikel tanpa gambar memakai placeholder, tanpa <img> rusak', async () => {
      await renderBerita()
      expect(document.querySelectorAll('img')).toHaveLength(0)
    })

    it('gambar yang ada ditampilkan; kartu memakai alt kosong (dekoratif), headline memakai judul', async () => {
      const data = buatData().map((a) => ({ ...a, gambar: `https://x.test/${a.id}.jpg` }))
      await renderBerita('/berita', data)
      expect(screen.getByAltText('Tim Robotik Juara Nasional')).toHaveAttribute('src', 'https://x.test/1.jpg')
      const gambarKartu = within(kartu()[0]).getByRole('presentation', { hidden: true })
      expect(gambarKartu).toHaveAttribute('loading', 'lazy')
    })

    it('mendukung nama field alternatif dari API (gambar_cover, created_at, is_pinned)', async () => {
      const data = buatData().map(({ gambar: _gambar, tanggal, disematkan, ...sisa }) => ({
        ...sisa,
        gambar_cover: 'https://x.test/a.jpg',
        created_at: `${tanggal}T08:00:00`,
        is_pinned: disematkan,
      }))
      await renderBerita('/berita', data)
      expect(screen.getByText('24 Februari 2026')).toBeInTheDocument()
      expect(screen.getByAltText('Tim Robotik Juara Nasional')).toHaveAttribute('src', 'https://x.test/a.jpg')
      expect(screen.getByText('Disematkan')).toBeInTheDocument()
    })
  })

  describe('galat jaringan', () => {
    let fetchMock
    beforeEach(() => {
      fetchMock = vi.fn().mockRejectedValue(new Error('jaringan putus'))
      vi.stubGlobal('fetch', fetchMock)
    })

    it('menampilkan pesan galat dan Coba Lagi memuat ulang tanpa data tiruan', async () => {
      const user = userEvent.setup()
      render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })}>
          <MemoryRouter initialEntries={['/berita']}>
            <BeritaPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )
      expect(await screen.findByRole('alert')).toHaveTextContent('Gagal memuat berita')
      expect(screen.queryByText('Headline Utama')).not.toBeInTheDocument() // tidak menampilkan berita palsu
      expect(screen.queryByRole('article')).not.toBeInTheDocument()

      fetchMock.mockResolvedValue({ ok: true, json: async () => buatData() })
      await user.click(screen.getByRole('button', { name: 'Coba Lagi' }))
      expect(await screen.findByText('Headline Utama')).toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('respons non-OK dari server juga dianggap galat', async () => {
      fetchMock.mockResolvedValue({ ok: false, json: async () => ({ message: 'Server error' }) })
      render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })}>
          <MemoryRouter initialEntries={['/berita']}>
            <BeritaPage />
          </MemoryRouter>
        </QueryClientProvider>,
      )
      expect(await screen.findByRole('alert')).toBeInTheDocument()
    })
  })
})
