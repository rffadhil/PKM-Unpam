import { describe, it, expect } from 'vitest'
import { buatSlug, ketikSlug, rapikanSlug } from './slug'
import { teksDariHtml, ringkasDariHtml, rapikanKonten } from './html'
import { validasiBerita, validasiGambar, MAKS_UKURAN_GAMBAR } from './validasi'
import { rapikanTautan } from './tautan'
import { hariIniIso } from './tanggal'

const lengkap = {
  judul: 'Tim Robotik Juara Nasional',
  slug: 'tim-robotik-juara-nasional',
  ringkasan: '',
  konten: '<p>Isi artikel yang cukup panjang untuk lolos validasi.</p>',
  kategori: 'Prestasi Siswa',
  gambar: 'data:image/png;base64,AAAA',
  tanggal: '2026-02-24',
  disematkan: false,
}

describe('slug', () => {
  it('buatSlug: huruf kecil, tanpa aksen/simbol, dipotong rapi', () => {
    expect(buatSlug('Tim Robotik: Juara WRO 2026!')).toBe('tim-robotik-juara-wro-2026')
    expect(buatSlug('  Café  Adiwiyata  ')).toBe('cafe-adiwiyata')
    expect(buatSlug('a'.repeat(100), 10)).toBe('aaaaaaaaaa')
    expect(buatSlug('!!!')).toBe('')
  })
  it('ketikSlug membiarkan tanda hubung di ujung (agar bisa mengetik "tim-")', () => {
    expect(ketikSlug('Tim Robotik-')).toBe('tim-robotik-')
  })
  it('rapikanSlug membuang tanda hubung ganda dan di ujung', () => {
    expect(rapikanSlug('--tim---robotik-')).toBe('tim-robotik')
  })
})

describe('html', () => {
  it('teksDariHtml membuang tag dan merapikan spasi', () => {
    expect(teksDariHtml('<h2>Judul</h2><p>Isi  <b>tebal</b></p>')).toBe('Judul Isi tebal')
    expect(teksDariHtml('')).toBe('')
  })
  it('rapikanKonten membuang paragraf kosong di akhir saja', () => {
    expect(rapikanKonten('<p>Isi</p><p></p><p></p>')).toBe('<p>Isi</p>')
    expect(rapikanKonten('<p>A</p><p></p><p>B</p>')).toBe('<p>A</p><p></p><p>B</p>')
  })
  it('ringkasDariHtml memotong di batas kata dan menambah ...', () => {
    const r = ringkasDariHtml(`<p>${'kata '.repeat(60)}</p>`, 50)
    expect(r.endsWith('...')).toBe(true)
    expect(r.length).toBeLessThanOrEqual(53)
    expect(ringkasDariHtml('<p>pendek</p>')).toBe('pendek')
  })
})

describe('validasiBerita', () => {
  it('artikel yang lengkap valid', () => {
    expect(validasiBerita(lengkap)).toEqual({})
  })
  it('semua kolom utama wajib karena artikel langsung tayang (tidak ada draf)', () => {
    const kosong = { ...lengkap, judul: '', slug: '', kategori: '', konten: '', gambar: '', tanggal: '' }
    expect(Object.keys(validasiBerita(kosong)).sort()).toEqual(['gambar', 'judul', 'kategori', 'konten', 'slug', 'tanggal'])
  })
  it('kategori, isi ≥ 20 karakter, dan cover masing-masing diperiksa', () => {
    const galat = validasiBerita({ ...lengkap, kategori: '', konten: '<p>pendek</p>', gambar: '' })
    expect(Object.keys(galat).sort()).toEqual(['gambar', 'kategori', 'konten'])
    expect(galat.kategori).toBe('Pilih kategori.')
    expect(galat.gambar).toBe('Gambar cover wajib diunggah.')
  })
  it('batas judul, format slug, dan panjang cuplikan', () => {
    expect(validasiBerita({ ...lengkap, judul: 'abc' }).judul).toMatch(/minimal 5/)
    expect(validasiBerita({ ...lengkap, judul: 'x'.repeat(151) }).judul).toMatch(/maksimal 150/)
    expect(validasiBerita({ ...lengkap, slug: 'Slug Salah' }).slug).toMatch(/huruf kecil/)
    expect(validasiBerita({ ...lengkap, slug: 'slug-' }).slug).toMatch(/huruf kecil/)
    expect(validasiBerita({ ...lengkap, ringkasan: 'x'.repeat(201) }).ringkasan).toMatch(/maksimal 200/)
  })
})

describe('validasiGambar', () => {
  const buat = (tipe, ukuran) => Object.defineProperty(new File(['x'], 'a'), 'size', { value: ukuran })
    && Object.defineProperties(new File(['x'], 'a', { type: tipe }), { size: { value: ukuran } })
  it('menerima JPG/PNG/WebP ≤ 5 MB', () => {
    ;['image/jpeg', 'image/png', 'image/webp'].forEach((t) => expect(validasiGambar(buat(t, 1000))).toBe(''))
    expect(validasiGambar(buat('image/png', MAKS_UKURAN_GAMBAR))).toBe('')
  })
  it('menolak format lain dan file > 5 MB', () => {
    expect(validasiGambar(buat('image/gif', 1000))).toMatch(/JPG, PNG, atau WebP/)
    expect(validasiGambar(buat('application/pdf', 1000))).toMatch(/JPG, PNG, atau WebP/)
    expect(validasiGambar(buat('image/png', MAKS_UKURAN_GAMBAR + 1))).toMatch(/maksimal 5 MB/)
  })
})

describe('rapikanTautan', () => {
  it('menambah https:// bila tanpa skema, menolak skema berbahaya', () => {
    expect(rapikanTautan('smaharapanjaya.sch.id')).toBe('https://smaharapanjaya.sch.id')
    expect(rapikanTautan('http://a.id')).toBe('http://a.id')
    expect(rapikanTautan('mailto:humas@a.id')).toBe('mailto:humas@a.id')
    expect(rapikanTautan('  ')).toBe('')
    expect(rapikanTautan('javascript:alert(1)')).toBeNull()
    expect(rapikanTautan('data:text/html,x')).toBeNull()
  })
})

describe('hariIniIso', () => {
  it('format YYYY-MM-DD dengan nol di depan', () => {
    expect(hariIniIso(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(hariIniIso(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})
