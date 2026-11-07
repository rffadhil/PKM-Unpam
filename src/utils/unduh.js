// Memicu unduhan file dari teks di browser.
export function unduhTeks(nama, isi, tipe = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([isi], { type: tipe }))
  const a = Object.assign(document.createElement('a'), { href: url, download: nama })
  a.click()
  URL.revokeObjectURL(url)
}
