import { describe, it, expect } from 'vitest'
import {
  formatTanggalLengkap,
  normalisasiTanggal,
  hitungMenitBaca,
  petakanBerita,
  olahDaftar,
  hitungKategori,
  pilihHeadline,
  pilihPengumuman,
  kelasChipKategori,
} from './beritaPublik'

const buat = (id, kategori, tanggal, extra = {}) =>
  petakanBerita({ id, slug: `s${id}`, judul: `Judul ${id}`, kategori, tanggal, penulis: { nama: 'Humas' }, ...extra })

describe('format tanggal', () => {
  it('formatTanggalLengkap', () => {
    expect(formatTanggalLengkap('2026-02-24')).toBe('24 Februari 2026')
    expect(formatTanggalLengkap('2026-12-01')).toBe('1 Desember 2026')
  })
  it('normalisasiTanggal menerima tanggal polos, timestamp lokal, dan nilai kosong/rusak', () => {
    expect(normalisasiTanggal('2026-02-24')).toBe('2026-02-24')
    expect(normalisasiTanggal('2026-02-24T08:30:00')).toBe('2026-02-24')
    expect(normalisasiTanggal('')).toBe('')
    expect(normalisasiTanggal(null)).toBe('')
    expect(normalisasiTanggal('bukan tanggal')).toBe('')
  })
})

describe('hitungMenitBaca', () => {
  it('180 kata per menit, dibulatkan ke atas, minimal 1', () => {
    expect(hitungMenitBaca(`<p>${'kata '.repeat(400)}</p>`)).toBe(3)
    expect(hitungMenitBaca('<p>pendek</p>')).toBe(1)
    expect(hitungMenitBaca('')).toBe(1)
    expect(hitungMenitBaca(undefined)).toBe(1)
  })
})

describe('petakanBerita', () => {
  it('bentuk API CMS (gambar, tanggal, penulis objek, disematkan)', () => {
    const b = petakanBerita({
      id: 7, slug: 'tim-robotik', judul: 'Tim Robotik', ringkasan: 'Ringkas', kategori: 'Akademik',
      gambar: 'https://x/a.jpg', tanggal: '2026-02-24', disematkan: true,
      penulis: { nama: 'Humas & Kesiswaan', inisial: 'HK' }, konten: '<p>isi</p>',
    })
    expect(b).toMatchObject({
      id: 7, slug: 'tim-robotik', judul: 'Tim Robotik', ringkasan: 'Ringkas', kategori: 'Akademik',
      gambar: 'https://x/a.jpg', tanggal: '2026-02-24', disematkan: true, menitBaca: 1,
      penulis: { nama: 'Humas & Kesiswaan', inisial: 'HK' },
    })
  })
  it('toleran terhadap nama field lain (gambar_cover, created_at, is_pinned, cuplikan, isi, penulis string)', () => {
    const b = petakanBerita({
      id: 1, judul: 'X', cuplikan: 'Cuplikan', gambar_cover: 'g.png', created_at: '2026-01-05T09:00:00',
      is_pinned: 1, penulis: 'Tim Adiwiyata', isi: '<p>halo</p>',
    })
    expect(b.ringkasan).toBe('Cuplikan')
    expect(b.gambar).toBe('g.png')
    expect(b.tanggal).toBe('2026-01-05')
    expect(b.disematkan).toBe(true)
    expect(b.penulis).toEqual({ nama: 'Tim Adiwiyata', inisial: 'TA' })
    expect(b.slug).toBe('1') // tanpa slug → pakai id
  })
  it('data kosong tidak membuat error', () => {
    const b = petakanBerita({ id: 3 })
    expect(b).toMatchObject({ judul: '', ringkasan: '', kategori: '', gambar: '', tanggal: '', disematkan: false })
    expect(b.penulis.nama).toBe('Redaksi Sekolah')
  })
})

describe('olahDaftar', () => {
  const daftar = [
    buat(1, 'Akademik', '2026-02-20', { judul: 'Sosialisasi ABM' }),
    buat(2, 'Prestasi Siswa', '2026-02-24', { judul: 'Tim Robotik Juara' }),
    buat(3, 'Prestasi Siswa', '2026-02-22', { judul: 'Pramuka Juara Umum', ringkasan: 'robotik juga' }),
  ]
  it('urut terbaru (default) dan terlama', () => {
    expect(olahDaftar(daftar).map((a) => a.id)).toEqual([2, 3, 1])
    expect(olahDaftar(daftar, { urut: 'terlama' }).map((a) => a.id)).toEqual([1, 3, 2])
  })
  it('saring kategori', () => {
    expect(olahDaftar(daftar, { kategori: 'Prestasi Siswa' }).map((a) => a.id)).toEqual([2, 3])
  })
  it('kata kunci tidak peka huruf besar/kecil dan mencari judul, ringkasan, penulis', () => {
    expect(olahDaftar(daftar, { kataKunci: 'ROBOTIK' }).map((a) => a.id)).toEqual([2, 3])
    expect(olahDaftar(daftar, { kataKunci: 'humas' }).length).toBe(3)
    expect(olahDaftar(daftar, { kataKunci: 'tidak-ada' })).toEqual([])
  })
  it('tidak mengubah array asli', () => {
    const salinan = [...daftar]
    olahDaftar(daftar, { urut: 'terlama' })
    expect(daftar).toEqual(salinan)
  })
})

describe('hitungKategori', () => {
  it('urutan dari konfigurasi CMS, jumlah dihitung, kategori tak dikenal ditaruh di akhir', () => {
    const hasil = hitungKategori([
      buat(1, 'Akademik', '2026-02-01'),
      buat(2, 'Akademik', '2026-02-02'),
      buat(3, 'Olahraga', '2026-02-03'),
    ])
    expect(hasil.map((k) => k.nama)).toEqual(['Prestasi Siswa', 'Adiwiyata & Lingkungan', 'Akademik', 'Pengumuman Resmi', 'Olahraga'])
    expect(hasil.find((k) => k.nama === 'Akademik').jumlah).toBe(2)
    expect(hasil.find((k) => k.nama === 'Prestasi Siswa').jumlah).toBe(0)
    expect(hasil.find((k) => k.nama === 'Olahraga').jumlah).toBe(1)
  })
})

describe('pilihHeadline & pilihPengumuman', () => {
  const daftar = [
    buat(1, 'Pengumuman Resmi', '2026-02-25'),
    buat(2, 'Prestasi Siswa', '2026-02-24'),
    buat(3, 'Akademik', '2026-02-20'),
    buat(4, 'Pengumuman Resmi', '2026-02-10', { disematkan: true }),
    buat(5, 'Pengumuman Resmi', '2026-02-12'),
    buat(6, 'Pengumuman Resmi', '2026-02-11'),
  ]
  it('headline = terbaru yang bukan pengumuman; null bila tidak ada', () => {
    expect(pilihHeadline(daftar).id).toBe(2)
    expect(pilihHeadline([buat(1, 'Pengumuman Resmi', '2026-02-25')])).toBeNull()
    expect(pilihHeadline([])).toBeNull()
  })
  it('pengumuman: yang disematkan dulu, lalu terbaru, maksimal 3', () => {
    expect(pilihPengumuman(daftar).map((a) => a.id)).toEqual([4, 1, 5])
    expect(pilihPengumuman(daftar, 2)).toHaveLength(2)
  })
})

describe('kelasChipKategori', () => {
  it('pengumuman emas, kategori sosial hijau muda, lainnya hijau tua', () => {
    expect(kelasChipKategori('Pengumuman Resmi')).toContain('bg-cta-gold')
    expect(kelasChipKategori('Sosial & Kemanusiaan')).toContain('bg-secondary-fixed')
    expect(kelasChipKategori('Akademik')).toContain('bg-primary-container')
  })
})
