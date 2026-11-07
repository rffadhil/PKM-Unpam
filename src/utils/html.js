// Teks polos dari potongan HTML (tanpa tag).
export function teksDariHtml(html) {
  if (!html) return ''
  // Beri spasi di antara blok agar "<h2>A</h2><p>B</p>" menjadi "A B", bukan "AB".
  const berspasi = html.replace(/<\/(p|h[1-6]|li|blockquote|div|ul|ol)>/gi, '$& ')
  const dok = new DOMParser().parseFromString(berspasi, 'text/html')
  return (dok.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

// Cuplikan otomatis: awal teks artikel, dipotong di batas kata.
export function ringkasDariHtml(html, maks = 160) {
  const teks = teksDariHtml(html)
  if (teks.length <= maks) return teks
  const potong = teks.slice(0, maks)
  return `${potong.slice(0, potong.lastIndexOf(' ') > 40 ? potong.lastIndexOf(' ') : maks)}...`
}

// Editor menambah paragraf kosong di akhir isi (TrailingNode); buang sebelum disimpan.
export function rapikanKonten(html) {
  return html.replace(/(<p>\s*<\/p>\s*)+$/i, '').trim()
}
