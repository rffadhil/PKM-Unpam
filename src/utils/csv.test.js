import { describe, it, expect } from 'vitest'
import { bangunCsv } from './csv'

describe('bangunCsv', () => {
  const kolom = [
    { judul: 'ID', nilai: (b) => b.id },
    { judul: 'Judul', nilai: (b) => b.judul },
  ]

  it('membuat header dan baris dipisah CRLF', () => {
    expect(bangunCsv(kolom, [{ id: 1, judul: 'Halo' }])).toBe('ID,Judul\r\n1,Halo')
  })

  it('membungkus nilai berisi koma dan menggandakan tanda kutip', () => {
    const csv = bangunCsv(kolom, [{ id: 2, judul: 'Juara, "Nasional"' }])
    expect(csv).toBe('ID,Judul\r\n2,"Juara, ""Nasional"""')
  })
})
