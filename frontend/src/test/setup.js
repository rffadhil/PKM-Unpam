import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { resetBerita } from '@/services/berita.service'

// jsdom tidak mengimplementasikan scroll; PublicLayout memanggilnya saat pindah halaman.
window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

// Data berita dummy disimpan di memori modul — kembalikan ke awal tiap tes.
beforeEach(() => resetBerita())
afterEach(() => cleanup())
