import { describe, it, expect } from 'vitest'
import { bulanSingkat, formatTanggalPanjang, hariDuaDigit, tahunPelajaran } from '@/utils/overview'

describe('utils/overview', () => {
  it('tahun pelajaran berganti pada bulan Juli', () => {
    expect(tahunPelajaran(new Date(2026, 1, 24))).toBe('2025/2026')
    expect(tahunPelajaran(new Date(2026, 5, 30))).toBe('2025/2026')
    expect(tahunPelajaran(new Date(2026, 6, 1))).toBe('2026/2027')
    expect(tahunPelajaran(new Date(2026, 9, 10))).toBe('2026/2027')
  })

  it('format tanggal panjang bahasa Indonesia', () => {
    expect(formatTanggalPanjang(new Date(2026, 1, 24))).toBe('Selasa, 24 Februari 2026')
  })

  it('bulan singkat & hari dua digit dari tanggal ISO', () => {
    expect(bulanSingkat('2026-02-26')).toBe('FEB')
    expect(bulanSingkat('2026-03-02')).toBe('MAR')
    expect(hariDuaDigit('2026-03-02')).toBe('02')
  })

  it('tanggal kosong atau salah tidak membuat error', () => {
    expect(bulanSingkat('')).toBe('-')
    expect(hariDuaDigit('bukan-tanggal')).toBe('--')
  })
})
