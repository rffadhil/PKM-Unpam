import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, within, waitFor, fireEvent } from '@testing-library/react'
import { renderAplikasi } from '@/test/utils'

// Editor TipTap diganti textarea sederhana agar tes halaman fokus ke logika form.
// Editor sungguhan diuji terpisah di components/admin/forms/EditorTeks.test.jsx.
vi.mock('@/components/admin/forms/EditorTeks', () => ({
  default: ({ id, nilai, onUbah }) => (
    <textarea
      id={id}
      aria-label="Isi artikel"
      defaultValue={(nilai ?? '').replace(/<[^>]+>/g, '')}
      onChange={(e) => onUbah(e.target.value ? `<p>${e.target.value}</p>` : '')}
    />
  ),
}))

const ISI_PANJANG = 'Isi artikel yang cukup panjang untuk lolos validasi penerbitan.'
const isi = (label, nilai) => fireEvent.change(screen.getByLabelText(label), { target: { value: nilai } })
const buatFile = (nama, tipe, ukuran = 1000) =>
  Object.defineProperty(new File(['x'], nama, { type: tipe }), 'size', { value: ukuran })
const ringkasanHalaman = () => screen.getByText(/Menampilkan/).textContent.replace(/\s+/g, ' ').trim()
const barisData = () => within(screen.getAllByRole('rowgroup')[1]).getAllByRole('row')
const ringkasan = () => screen.getByRole('region', { name: 'Ringkasan artikel' })
// Setelah simpan, aplikasi pindah ke daftar yang memuat ulang data. Tunggu sampai daftar selesai
// dimuat DAN banner pemberitahuan muncul (keduanya harus benar bersamaan).
const banner = async () => {
  await waitFor(() => {
    expect(screen.queryByText('Memuat data…')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
  return screen.getByRole('status')
}

describe('Admin · Form Berita', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date('2026-02-24T08:00:00'))
  })
  afterEach(() => vi.useRealTimers())

  describe('tambah berita baru', () => {
    it('Tambah Berita Baru dari daftar membuka form (bukan modal) dan topbar tanpa pencarian', async () => {
      const user = await renderAplikasi('/admin/berita')
      await user.click(screen.getByRole('link', { name: 'Tambah Berita Baru' }))
      expect(screen.getByRole('form', { name: 'Form tambah berita' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: 'Tambah Berita Baru' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 1, name: 'Manajemen Berita & Pengumuman' })).toBeInTheDocument()
      expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('nilai awal: status Draf, tanggal hari ini, tombol Simpan Draf, kolom pin nonaktif', async () => {
      await renderAplikasi('/admin/berita/baru')
      expect(screen.getByLabelText('Status')).toHaveValue('draf')
      expect(screen.getByLabelText(/Tanggal publikasi/)).toHaveValue('2026-02-24')
      expect(screen.getAllByRole('button', { name: 'Simpan Draf' })).toHaveLength(2) // atas & bawah
      expect(screen.getByLabelText(/Sematkan di Beranda/)).toBeDisabled()
      expect(screen.getByText(/Penulis:/)).toHaveTextContent('Arya Gagah')
    })

    it('label tombol mengikuti status: Terbitkan saat Terbit', async () => {
      await renderAplikasi('/admin/berita/baru')
      fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'terbit' } })
      expect(screen.getAllByRole('button', { name: 'Terbitkan' })).toHaveLength(2)
    })

    describe('slug', () => {
      it('dibuat otomatis dari judul sampai diubah manual', async () => {
        await renderAplikasi('/admin/berita/baru')
        isi(/^Judul/, 'Tim Robotik: Juara WRO 2026!')
        expect(screen.getByLabelText(/Slug/)).toHaveValue('tim-robotik-juara-wro-2026')
        isi(/Slug/, 'slug-kustom')
        isi(/^Judul/, 'Judul Berubah Lagi')
        expect(screen.getByLabelText(/Slug/)).toHaveValue('slug-kustom')
      })

      it('karakter tak valid dibuang saat mengetik dan dirapikan saat blur', async () => {
        await renderAplikasi('/admin/berita/baru')
        isi(/Slug/, 'Tim Robotik!--Juara--')
        expect(screen.getByLabelText(/Slug/)).toHaveValue('tim-robotik--juara--')
        fireEvent.blur(screen.getByLabelText(/Slug/))
        expect(screen.getByLabelText(/Slug/)).toHaveValue('tim-robotik-juara')
      })
    })

    describe('simpan draf', () => {
      it('draf cukup dengan judul: kembali ke daftar, ada pemberitahuan, total jadi 49', async () => {
        const user = await renderAplikasi('/admin/berita/baru')
        isi(/^Judul/, 'Rencana Berita Pekan Depan')
        await user.click(screen.getAllByRole('button', { name: 'Simpan Draf' })[0])

        expect(await banner()).toHaveTextContent('Artikel “Rencana Berita Pekan Depan” berhasil disimpan sebagai draf.')
        await waitFor(() => expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 49 artikel'))
        const baris = barisData()[0]
        expect(within(baris).getByText('Rencana Berita Pekan Depan')).toBeInTheDocument()
        expect(within(baris).getByText('Draf')).toBeInTheDocument()
        expect(within(baris).getByText('Tanpa kategori')).toBeInTheDocument()
        expect(within(baris).getByText('Arya Gagah')).toBeInTheDocument()
        expect(within(ringkasan()).getByText('49')).toBeInTheDocument()
        expect(within(ringkasan()).getByText('42')).toBeInTheDocument() // terbit tetap
        expect(within(ringkasan()).getByText('7')).toBeInTheDocument() // draf bertambah
      })

      it('cuplikan dibuat otomatis dari isi artikel bila dikosongkan', async () => {
        const user = await renderAplikasi('/admin/berita/baru')
        isi(/^Judul/, 'Berita Dengan Isi')
        isi('Isi artikel', 'Ini adalah isi berita yang akan menjadi cuplikan otomatis.')
        await user.click(screen.getAllByRole('button', { name: 'Simpan Draf' })[0])
        await banner()
        expect(within(barisData()[0]).getByText('Ini adalah isi berita yang akan menjadi cuplikan otomatis.')).toBeInTheDocument()
      })
    })

    describe('validasi saat menerbitkan', () => {
      it('menampilkan ringkasan kesalahan, pesan per kolom, dan memfokuskan kolom pertama yang salah', async () => {
        const user = await renderAplikasi('/admin/berita/baru')
        isi(/^Judul/, 'Berita Siap Terbit')
        fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'terbit' } })
        await user.click(screen.getAllByRole('button', { name: 'Terbitkan' })[0])

        expect(screen.getByText(/3 kolom perlu diperbaiki/)).toBeInTheDocument()
        expect(screen.getByText('Pilih kategori sebelum menerbitkan.')).toBeInTheDocument()
        expect(screen.getByText(/Isi artikel minimal 20 karakter/)).toBeInTheDocument()
        expect(screen.getByText('Gambar cover wajib untuk artikel yang diterbitkan.')).toBeInTheDocument()
        expect(screen.getByLabelText(/Kategori/)).toHaveAttribute('aria-invalid', 'true')
        expect(screen.getByLabelText(/Kategori/)).toHaveFocus()
        expect(screen.getByRole('form')).toBeInTheDocument() // tetap di halaman form
      })

      it('kesalahan hilang begitu isian diperbaiki', async () => {
        const user = await renderAplikasi('/admin/berita/baru')
        isi(/^Judul/, 'Berita Siap Terbit')
        fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'terbit' } })
        await user.click(screen.getAllByRole('button', { name: 'Terbitkan' })[0])
        fireEvent.change(screen.getByLabelText(/Kategori/), { target: { value: 'Akademik' } })
        expect(screen.queryByText('Pilih kategori sebelum menerbitkan.')).not.toBeInTheDocument()
        expect(screen.getByText(/2 kolom perlu diperbaiki/)).toBeInTheDocument()
      })

      it('judul terlalu pendek ditolak walau berstatus draf', async () => {
        const user = await renderAplikasi('/admin/berita/baru')
        isi(/^Judul/, 'abc')
        await user.click(screen.getAllByRole('button', { name: 'Simpan Draf' })[0])
        expect(screen.getByText('Judul minimal 5 karakter.')).toBeInTheDocument()
        expect(screen.getByLabelText(/^Judul/)).toHaveFocus()
      })
    })

    it('alur lengkap: isi semua kolom, unggah cover, terbitkan → muncul di daftar & statistik Overview ikut berubah', async () => {
      const user = await renderAplikasi('/admin/berita/baru')
      isi(/^Judul/, 'Peringatan Hari Pendidikan Nasional 2026')
      fireEvent.change(screen.getByLabelText(/Kategori/), { target: { value: 'Akademik' } })
      isi('Isi artikel', ISI_PANJANG)
      await user.upload(screen.getByLabelText('Pilih gambar cover'), buatFile('cover.png', 'image/png'))
      expect(await screen.findByAltText('Pratinjau gambar cover')).toBeInTheDocument()
      fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'terbit' } })
      await user.click(screen.getAllByRole('button', { name: 'Terbitkan' })[0])

      expect(await banner()).toHaveTextContent('berhasil diterbitkan')
      await waitFor(() => expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 49 artikel'))
      const baris = barisData()[0]
      expect(within(baris).getByText('Peringatan Hari Pendidikan Nasional 2026')).toBeInTheDocument()
      expect(within(baris).getByText('Terbit')).toBeInTheDocument()
      expect(within(baris).getByText('Akademik')).toBeInTheDocument()
      expect(within(baris).getByRole('link', { name: /Lihat artikel .* di portal/ })).toHaveAttribute(
        'href',
        '/berita/peringatan-hari-pendidikan-nasional-2026',
      )

      // Overview memakai sumber data yang sama
      await user.click(within(screen.getByRole('navigation', { name: 'Navigasi CMS' })).getByRole('link', { name: /Overview/ }))
      expect(await screen.findByText(/43 Tayang/)).toBeInTheDocument()
      expect(screen.getByText(/6 Draf/)).toBeInTheDocument()
      expect(screen.getByText('49')).toBeInTheDocument()
    })

    it('slug yang sudah dipakai ditolak server dan ditampilkan pada kolom slug', async () => {
      const user = await renderAplikasi('/admin/berita/baru')
      isi(/^Judul/, 'Judul Berbeda Tapi Slug Kembar')
      isi(/Slug/, 'tim-robotik-juara-wro-2026-tokyo')
      await user.click(screen.getAllByRole('button', { name: 'Simpan Draf' })[0])
      expect(await screen.findByText('Slug sudah dipakai artikel lain.')).toBeInTheDocument()
      expect(screen.getByLabelText(/Slug/)).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByLabelText(/Slug/)).toHaveFocus()
    })

    describe('sematkan pengumuman', () => {
      it('hanya aktif untuk kategori Pengumuman Resmi dan reset saat kategori diganti', async () => {
        await renderAplikasi('/admin/berita/baru')
        const pin = screen.getByLabelText(/Sematkan di Beranda/)
        expect(pin).toBeDisabled()
        fireEvent.change(screen.getByLabelText(/Kategori/), { target: { value: 'Pengumuman Resmi' } })
        expect(pin).toBeEnabled()
        fireEvent.click(pin)
        expect(pin).toBeChecked()
        fireEvent.change(screen.getByLabelText(/Kategori/), { target: { value: 'Akademik' } })
        expect(pin).toBeDisabled()
        expect(pin).not.toBeChecked()
      })

      it('artikel tersemat tampil dengan ikon pin di daftar', async () => {
        const user = await renderAplikasi('/admin/berita/baru')
        isi(/^Judul/, 'Pengumuman Libur Semester Genap')
        fireEvent.change(screen.getByLabelText(/Kategori/), { target: { value: 'Pengumuman Resmi' } })
        fireEvent.click(screen.getByLabelText(/Sematkan di Beranda/))
        await user.click(screen.getAllByRole('button', { name: 'Simpan Draf' })[0])
        await banner()
        expect(within(barisData()[0]).getByTitle('Disematkan di Beranda')).toBeInTheDocument()
      })
    })

    describe('gambar cover', () => {
      it('menolak format selain JPG/PNG/WebP', async () => {
        await renderAplikasi('/admin/berita/baru')
        fireEvent.change(screen.getByLabelText('Pilih gambar cover'), { target: { files: [buatFile('a.gif', 'image/gif')] } })
        expect(await screen.findByText('Format gambar harus JPG, PNG, atau WebP.')).toBeInTheDocument()
        expect(screen.queryByAltText('Pratinjau gambar cover')).not.toBeInTheDocument()
      })

      it('menolak file lebih dari 5 MB', async () => {
        await renderAplikasi('/admin/berita/baru')
        fireEvent.change(screen.getByLabelText('Pilih gambar cover'), {
          target: { files: [buatFile('besar.jpg', 'image/jpeg', 5 * 1024 * 1024 + 1)] },
        })
        expect(await screen.findByText('Ukuran gambar maksimal 5 MB.')).toBeInTheDocument()
      })

      it('menampilkan pratinjau setelah unggah, lalu bisa dihapus', async () => {
        const user = await renderAplikasi('/admin/berita/baru')
        await user.upload(screen.getByLabelText('Pilih gambar cover'), buatFile('ok.webp', 'image/webp'))
        const img = await screen.findByAltText('Pratinjau gambar cover')
        expect(img.getAttribute('src')).toMatch(/^data:image\/webp/)
        await user.click(screen.getByRole('button', { name: /Hapus/ }))
        expect(screen.queryByAltText('Pratinjau gambar cover')).not.toBeInTheDocument()
        expect(screen.getByText('Klik atau tarik gambar ke sini')).toBeInTheDocument()
      })
    })

    describe('pratinjau', () => {
      it('menampilkan judul dan isi, serta membuang skrip/atribut berbahaya (XSS)', async () => {
        const user = await renderAplikasi('/admin/berita/baru')
        isi(/^Judul/, 'Judul Pratinjau')
        isi('Isi artikel', 'Halo <img src=x onerror=alert(1)><script>alert(2)</script>')
        await user.click(screen.getByRole('tab', { name: 'Pratinjau' }))
        const pratinjau = screen.getByRole('article', { name: 'Pratinjau artikel' })
        expect(within(pratinjau).getByRole('heading', { name: 'Judul Pratinjau' })).toBeInTheDocument()
        expect(within(pratinjau).getByText(/Halo/)).toBeInTheDocument()
        expect(pratinjau.querySelector('script')).toBeNull()
        expect(pratinjau.querySelector('[onerror]')).toBeNull()
        await user.click(screen.getByRole('tab', { name: 'Tulis' }))
        expect(screen.getByLabelText('Isi artikel')).toBeVisible()
      })
    })
  })

  describe('edit berita', () => {
    it('Edit dari daftar membuka form terisi data artikel', async () => {
      const user = await renderAplikasi('/admin/berita')
      await user.click(screen.getByRole('link', { name: /Edit artikel Tim Robotik/ }))
      expect(await screen.findByRole('form', { name: 'Form edit berita' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2, name: 'Edit Berita' })).toBeInTheDocument()
      expect(screen.getByLabelText(/^Judul/)).toHaveValue('Tim Robotik SMA Harapan Jaya Sabet Medali Emas WRO 2026 di Tokyo')
      expect(screen.getByLabelText(/Slug/)).toHaveValue('tim-robotik-juara-wro-2026-tokyo')
      expect(screen.getByLabelText(/Kategori/)).toHaveValue('Prestasi Siswa')
      expect(screen.getByLabelText('Status')).toHaveValue('terbit')
      expect(screen.getByLabelText(/Tanggal publikasi/)).toHaveValue('2026-02-24')
      expect(screen.getByAltText('Pratinjau gambar cover')).toBeInTheDocument()
      expect(screen.getByLabelText('Isi artikel').value).toContain('Tim robotik SMA Harapan Jaya')
      expect(screen.getAllByRole('button', { name: 'Simpan Perubahan' })).toHaveLength(2)
      expect(screen.getByText(/Penulis:/)).toHaveTextContent('Humas & Kesiswaan')
    })

    it('mengubah judul tidak mengubah slug yang sudah ada', async () => {
      await renderAplikasi('/admin/berita/1/edit')
      isi(/^Judul/, 'Judul Baru Untuk Artikel Ini')
      expect(screen.getByLabelText(/Slug/)).toHaveValue('tim-robotik-juara-wro-2026-tokyo')
    })

    it('menyimpan perubahan: kembali ke daftar, judul berubah, penulis asli tetap', async () => {
      const user = await renderAplikasi('/admin/berita/1/edit')
      isi(/^Judul/, 'Tim Robotik Juara Dunia WRO 2026')
      await user.click(screen.getAllByRole('button', { name: 'Simpan Perubahan' })[0])
      expect(await banner()).toHaveTextContent('Artikel “Tim Robotik Juara Dunia WRO 2026” berhasil diperbarui.')
      await waitFor(() => expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 48 artikel'))
      const baris = barisData()[0]
      expect(within(baris).getByText('Tim Robotik Juara Dunia WRO 2026')).toBeInTheDocument()
      expect(within(baris).getByText('Humas & Kesiswaan')).toBeInTheDocument()
    })

    it('mengubah status artikel terbit menjadi draf memperbarui statistik', async () => {
      const user = await renderAplikasi('/admin/berita/1/edit')
      fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'draf' } })
      expect(screen.getAllByRole('button', { name: 'Simpan Draf' })).toHaveLength(2)
      await user.click(screen.getAllByRole('button', { name: 'Simpan Draf' })[0])
      await banner()
      await waitFor(() => expect(within(ringkasan()).getByText('41')).toBeInTheDocument())
      expect(within(ringkasan()).getByText('7')).toBeInTheDocument()
    })

    it('artikel yang tidak ada menampilkan pesan dan tautan kembali', async () => {
      await renderAplikasi('/admin/berita/999/edit')
      expect(await screen.findByRole('heading', { name: 'Artikel tidak ditemukan' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /Kembali ke daftar berita/ })).toHaveAttribute('href', '/admin/berita')
    })
  })

  describe('batal & perubahan belum disimpan', () => {
    it('tanpa perubahan: Batal langsung kembali ke daftar', async () => {
      const user = await renderAplikasi('/admin/berita/baru')
      await user.click(screen.getAllByRole('button', { name: 'Batal' })[0])
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Daftar Artikel & Publikasi Sekolah' })).toBeInTheDocument()
    })

    it('ada perubahan: muncul konfirmasi; "Batal" di dialog tetap di form, "Buang Perubahan" kembali', async () => {
      const user = await renderAplikasi('/admin/berita/baru')
      isi(/^Judul/, 'Draf yang belum disimpan')
      await user.click(screen.getAllByRole('button', { name: 'Batal' })[0])
      const dialog = screen.getByRole('dialog')
      expect(within(dialog).getByText('Buang perubahan?')).toBeInTheDocument()

      await user.click(within(dialog).getByRole('button', { name: 'Batal' }))
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByLabelText(/^Judul/)).toHaveValue('Draf yang belum disimpan')

      await user.click(screen.getAllByRole('button', { name: 'Batal' })[0])
      await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Buang Perubahan' }))
      expect(await screen.findByRole('heading', { name: 'Daftar Artikel & Publikasi Sekolah' })).toBeInTheDocument()
      expect(ringkasanHalaman()).toBe('Menampilkan 1 - 5 dari 48 artikel') // tidak ada yang tersimpan
    })

    it('peringatan beforeunload aktif hanya saat ada perubahan', async () => {
      await renderAplikasi('/admin/berita/baru')
      const bersih = new Event('beforeunload', { cancelable: true })
      window.dispatchEvent(bersih)
      expect(bersih.defaultPrevented).toBe(false)

      isi(/^Judul/, 'Mulai mengetik')
      const kotor = new Event('beforeunload', { cancelable: true })
      window.dispatchEvent(kotor)
      expect(kotor.defaultPrevented).toBe(true)
    })

    it('tautan Kembali ke daftar berita tersedia di form', async () => {
      const user = await renderAplikasi('/admin/berita/baru')
      await user.click(screen.getByRole('link', { name: /Kembali ke daftar berita/ }))
      expect(await screen.findByRole('heading', { name: 'Daftar Artikel & Publikasi Sekolah' })).toBeInTheDocument()
    })
  })
})
