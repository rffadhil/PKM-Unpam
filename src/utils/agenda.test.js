import { describe, it, expect } from 'vitest'
import { bulanSingkat, formatRentang, hariAngka, saringAgenda, urutkanAgenda } from '@/utils/agenda'
import { mockAgenda } from '@/mocks/adminAgenda'

describe('utils/agenda', () => {
  it('formatRentang: satu hari, satu bulan, dan lintas bulan', () => {
    expect(formatRentang('2026-05-18', null)).toBe('18 Mei 2026')
    expect(formatRentang('2026-06-02', '2026-06-10')).toBe('02 – 10 Juni 2026')
    expect(formatRentang('2026-05-28', '2026-06-02')).toBe('28 Mei – 02 Juni 2026')
  })

  it('hari dan bulan singkat dari tanggal ISO', () => {
    expect(hariAngka('2026-06-05')).toBe('05')
    expect(bulanSingkat('2026-06-05')).toBe('JUN')
  })

  it('urutkanAgenda: yang aktif dulu menurut tanggal, yang selesai di belakang', () => {
    const urut = urutkanAgenda(mockAgenda)
    expect(urut).toHaveLength(mockAgenda.length)
    expect(urut.slice(0, 5).map((a) => a.tanggalMulai)).toEqual([
      '2026-05-18', '2026-05-22', '2026-05-28', '2026-06-02', '2026-06-05',
    ])
    const idxSelesaiPertama = urut.findIndex((a) => a.status === 'selesai')
    expect(urut.slice(idxSelesaiPertama).every((a) => a.status === 'selesai')).toBe(true)
  })

  it('saringAgenda: kategori dan kata kunci (tanpa filter periode/status)', () => {
    const akademik = saringAgenda(mockAgenda, { kategori: 'Akademik & Ujian' })
    expect(akademik.length).toBeGreaterThan(0)
    expect(akademik.every((a) => a.kategori === 'Akademik & Ujian')).toBe(true)

    const kir = saringAgenda(mockAgenda, { kata: 'karya tulis' })
    expect(kir.map((a) => a.id)).toContain(2)

    expect(saringAgenda(mockAgenda, { kategori: '', kata: '' })).toHaveLength(mockAgenda.length)
  })
})
