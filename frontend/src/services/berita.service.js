import { buatDaftarBerita } from '@/mocks/adminBerita'
import { adminUser } from '@/mocks/admin'

// LAYANAN DATA BERITA (sementara: penyimpanan di memori, hilang saat halaman di-refresh).
// Semua fungsi async dan mengembalikan salinan data, jadi pemakai (React Query) tidak perlu
// diubah ketika diganti ke API. Padanan endpoint:
//   daftarBerita()  → GET    /api/posts
//   ambilBerita(id) → GET    /api/posts/:id
//   simpanBerita()  → POST   /api/posts  (tanpa id)  |  PUT /api/posts/:id  (dengan id)
//   hapusBerita(id) → DELETE /api/posts/:id           (soft delete)
// Kesalahan validasi dari server: lempar Error dengan properti `field` (mis. 'slug').

let data = buatDaftarBerita()
let idBerikut = data.length + 1

// Dipakai tes agar tiap kasus mulai dari data awal.
export function resetBerita() {
  data = buatDaftarBerita()
  idBerikut = data.length + 1
}

const salin = (a) => ({ ...a, penulis: { ...a.penulis } })

export async function daftarBerita() {
  return data.map(salin)
}

export async function ambilBerita(id) {
  const artikel = data.find((a) => a.id === Number(id))
  if (!artikel) throw new Error('Artikel tidak ditemukan.')
  return salin(artikel)
}

export async function simpanBerita(input) {
  if (data.some((a) => a.slug === input.slug && a.id !== input.id)) {
    const galat = new Error('Slug sudah dipakai artikel lain.')
    galat.field = 'slug'
    throw galat
  }

  if (input.id) {
    const indeks = data.findIndex((a) => a.id === input.id)
    if (indeks === -1) throw new Error('Artikel tidak ditemukan.')
    data[indeks] = { ...data[indeks], ...input, penulis: data[indeks].penulis }
    return salin(data[indeks])
  }

  const baru = {
    ...input,
    id: idBerikut,
    penulis: {
      nama: adminUser.namaSingkat,
      email: adminUser.email,
      inisial: adminUser.inisial,
      tone: 'netral',
    },
  }
  idBerikut += 1
  data = [baru, ...data]
  return salin(baru)
}

export async function hapusBerita(id) {
  data = data.filter((a) => a.id !== Number(id))
}
