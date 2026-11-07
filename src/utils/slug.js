export const POLA_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// 'Tim Robotik Juara WRO 2026!' → 'tim-robotik-juara-wro-2026'
export function buatSlug(teks, maks = 80) {
  return teks
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maks)
    .replace(/-+$/g, '')
}

// Saat mengetik: huruf kecil, spasi → '-', buang karakter tak valid (tanda hubung di ujung dibiarkan).
export function ketikSlug(teks) {
  return teks.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Setelah selesai mengetik: rapikan tanda hubung ganda / di ujung.
export function rapikanSlug(teks) {
  return ketikSlug(teks).replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '')
}
