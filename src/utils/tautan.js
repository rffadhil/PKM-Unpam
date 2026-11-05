const PROTOKOL_AMAN = /^(https?:\/\/|mailto:)/i

// 'smaharapanjaya.sch.id' → 'https://smaharapanjaya.sch.id'; 'javascript:...' ditolak (null)
export function rapikanTautan(masukan) {
  const teks = masukan.trim()
  if (!teks) return ''
  if (PROTOKOL_AMAN.test(teks)) return teks
  if (/^[a-z][a-z0-9+.-]*:/i.test(teks)) return null
  return `https://${teks}`
}
