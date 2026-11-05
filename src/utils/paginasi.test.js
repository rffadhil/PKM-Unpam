import { describe, it, expect } from 'vitest'
import { daftarHalaman } from './paginasi'

describe('daftarHalaman', () => {
  it('halaman awal: 1 2 3 … 10', () => {
    expect(daftarHalaman(10, 1)).toEqual([1, 2, 3, '…', 10])
  })
  it('halaman tengah: 1 … 4 5 6 … 10', () => {
    expect(daftarHalaman(10, 5)).toEqual([1, '…', 4, 5, 6, '…', 10])
  })
  it('halaman akhir: 1 … 8 9 10', () => {
    expect(daftarHalaman(10, 10)).toEqual([1, '…', 8, 9, 10])
  })
  it('total kecil tanpa titik', () => {
    expect(daftarHalaman(3, 2)).toEqual([1, 2, 3])
    expect(daftarHalaman(1, 1)).toEqual([1])
  })
})
