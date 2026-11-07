import { describe, it, expect } from 'vitest'
import { petaTitik, kurvaHalus, bidangArea, batasAtas, Y_DASAR, Y_ATAS } from './grafik'

describe('grafik', () => {
  it('petaTitik: titik pertama di x=0, terakhir di x=700, nilai lebih besar = y lebih kecil', () => {
    const t = petaTitik([0, 50, 100], 100)
    expect(t[0]).toEqual({ x: 0, y: Y_DASAR })
    expect(t[2]).toEqual({ x: 700, y: Y_ATAS })
    expect(t[1].y).toBeLessThan(t[0].y)
    expect(t[1].y).toBeGreaterThan(t[2].y)
  })

  it('kurvaHalus: satu segmen Bezier per pasang titik', () => {
    const d = kurvaHalus(petaTitik([1, 3, 2, 5], 5))
    expect(d.startsWith('M 0,')).toBe(true)
    expect(d.match(/C /g)).toHaveLength(3)
  })

  it('kurvaHalus: kurang dari 2 titik menghasilkan string kosong', () => {
    expect(kurvaHalus([{ x: 0, y: 0 }])).toBe('')
  })

  it('bidangArea: ditutup ke garis dasar', () => {
    const d = bidangArea(petaTitik([1, 2], 2))
    expect(d.endsWith(`L 0,${Y_DASAR} Z`)).toBe(true)
  })

  it('batasAtas: membulat ke atas dengan ruang 10%', () => {
    expect(batasAtas([1000, 2410])).toBe(2700)
    expect(batasAtas([6420, 14210])).toBe(16000)
  })
})
