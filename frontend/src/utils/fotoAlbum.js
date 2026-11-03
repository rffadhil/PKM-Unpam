// Fungsi pembantu untuk lightbox album publik (fungsi murni, mudah dites).

// "2026-05-12" -> "12 Mei 2026"
export function formatTanggalLengkap(iso) {
  if (!iso) return ''
  const d = new Date(`${String(iso).slice(0, 10)}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(d)
}

// Mengubah berbagai bentuk data foto dari backend/mock menjadi satu bentuk:
// [{ id, url, caption }]
// Sumber yang dicek (berurutan): fotos, foto, photos, images, galeri_foto.
// Isi array boleh berupa string URL atau object { id, url | image_url | src | path, caption | keterangan | judul }.
export function normalisasiFoto(...sumber) {
  for (const album of sumber) {
    if (!album) continue
    const mentah = album.fotos ?? album.foto ?? album.photos ?? album.images ?? album.galeri_foto
    if (!Array.isArray(mentah) || mentah.length === 0) continue

    const hasil = mentah
      .map((item, i) => {
        if (typeof item === 'string') return { id: `f-${i}`, url: item, caption: '' }
        if (!item) return null
        return {
          id: item.id ?? `f-${i}`,
          url: item.url || item.image_url || item.src || item.path || '',
          caption: item.caption || item.keterangan || item.judul || '',
        }
      })
      .filter((f) => f && f.url)

    if (hasil.length > 0) return { daftar: hasil, lengkap: true }
  }

  // Cadangan: belum ada daftar foto, tampilkan sampul album saja.
  const sampul = sumber.find((a) => a && (a.cover || a.gambar || a.image_url))
  const url = sampul ? sampul.cover || sampul.gambar || sampul.image_url : ''
  return {
    daftar: url ? [{ id: 'sampul', url, caption: '' }] : [],
    lengkap: false,
  }
}
