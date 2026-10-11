// UNGGAH GAMBAR (sementara: dibaca jadi data URL di browser, tidak dikirim ke server).
// TODO: POST multipart ke /api/upload (multer → Cloudinary/Supabase Storage) lalu kembalikan URL-nya:
//   const form = new FormData(); form.append('file', file)
//   const { data } = await api.post('/upload', form); return data.url
export function unggahGambar(file) {
  return new Promise((resolve, reject) => {
    const pembaca = new FileReader()
    pembaca.onload = () => resolve(pembaca.result)
    pembaca.onerror = () => reject(new Error('Gagal membaca file gambar.'))
    pembaca.readAsDataURL(file)
  })
}
