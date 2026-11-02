import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { resetBerita } from '@/services/berita.service'

// jsdom tidak mengimplementasikan scroll; PublicLayout memanggilnya saat pindah halaman.
window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

// jsdom tidak punya pengukuran tata letak pada Range; ProseMirror (editor TipTap) memanggilnya
// saat menggulir ke posisi kursor. Beri nilai kosong agar tidak muncul error tak tertangani.
const rectKosong = { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0, toJSON: () => ({}) }
if (!Range.prototype.getClientRects) {
  Range.prototype.getClientRects = () => ({ length: 0, item: () => null, [Symbol.iterator]: function* () {} })
}
if (!Range.prototype.getBoundingClientRect) Range.prototype.getBoundingClientRect = () => rectKosong

// Data berita dummy disimpan di memori modul — kembalikan ke awal tiap tes.
beforeEach(() => {
  localStorage.setItem('cms_token', 'test-token')
  localStorage.setItem('cms_user', JSON.stringify({ nama: 'Admin Test' }))
  resetBerita()
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})
