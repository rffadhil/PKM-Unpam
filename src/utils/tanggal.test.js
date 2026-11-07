import { describe, it, expect } from 'vitest'
import { formatTanggal, formatTanggalPanjang, tahunPelajaran } from './tanggal'
import { formatAngka } from './angka'

describe('tanggal & angka', () => {
  it('formatTanggal', () => {
    expect(formatTanggal('2026-02-24')).toBe('24 Feb 2026')
  })
  it('formatTanggalPanjang', () => {
    expect(formatTanggalPanjang(new Date('2026-02-24T08:00:00'))).toBe('Selasa, 24 Februari 2026')
  })
  it('tahunPelajaran berganti pada bulan Juli', () => {
    expect(tahunPelajaran(new Date('2026-02-24T08:00:00'))).toBe('2025/2026')
    expect(tahunPelajaran(new Date('2026-06-30T08:00:00'))).toBe('2025/2026')
    expect(tahunPelajaran(new Date('2026-07-01T08:00:00'))).toBe('2026/2027')
    expect(tahunPelajaran(new Date('2026-10-10T08:00:00'))).toBe('2026/2027')
  })
  it('formatAngka memakai pemisah ribuan titik', () => {
    expect(formatAngka(48250)).toBe('48.250')
    expect(formatAngka(1608)).toBe('1.608')
  })
})
