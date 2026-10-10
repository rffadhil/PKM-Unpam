import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom tidak mengimplementasikan scroll; PublicLayout memanggilnya saat pindah halaman.
window.scrollTo = () => {}
Element.prototype.scrollIntoView = () => {}

afterEach(() => cleanup())
