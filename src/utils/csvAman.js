// Pembantu CSV yang aman dibuka di Excel (dipakai modul Staf dan Pesan).
// - BOM UTF-8 supaya huruf berakses tampil benar.
// - Teks berawalan = + - @ di-escape agar tidak dijalankan sebagai rumus.
// - Nomor panjang (NIP, NUPTK) dipaksa jadi teks agar tidak berubah menjadi 1.97E+17.

// Sel teks: dikutip, tanda kutip ganda di-escape.
export const selCsv = (v) => {
  let t = String(v ?? '')
  if (/^[=+\-@]/.test(t)) t = `'${t}`
  return `"${t.replace(/"/g, '""')}"`
}

// Sel nomor: ="196808121994031004"
export const selAngka = (v) => `="${String(v ?? '').replace(/"/g, '""')}"`

// kepala: array teks biasa. baris: array of array sel yang sudah lewat selCsv/selAngka.
export const gabungCsv = (kepala, baris) =>
  '\uFEFF' + [kepala.map(selCsv).join(','), ...baris.map((b) => b.join(','))].join('\r\n')
