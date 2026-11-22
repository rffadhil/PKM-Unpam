
/** @format */

import { mockAlbum } from '@/mocks/adminGaleri'
import { unggahGambar } from '@/services/upload.service'

// =====================================================
// KONFIGURASI
// =====================================================

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

const STORAGE_KEY = 'cms_galeri_data'

// =====================================================
// HEADER
// =====================================================

function getHeaders(isJson = true) {
  const headers = {}

  if (isJson) {
    headers['Content-Type'] = 'application/json'
  }

  const token = localStorage.getItem('cms_token')

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

// =====================================================
// MEMBACA RESPONSE API
// =====================================================

function ambilArray(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.data?.data)) return data.data.data

  return []
}

function ambilRow(data) {
  return data?.data?.data ?? data?.data ?? data
}

// =====================================================
// REQUEST API
// =====================================================

async function requestGaleri(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      signal: controller.signal,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const error = new Error(
        data.message ||
          data.error ||
          `Permintaan gagal (${response.status}).`
      )

      error.status = response.status
      error.field = data.field

      throw error
    }

    return data
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(
        'Permintaan terlalu lama. Periksa koneksi backend.'
      )
    }

    throw error
  } finally {
    clearTimeout(timer)
  }
}

// =====================================================
// FORMAT DATA GALERI
// =====================================================

function rapikanUrlGambar(url) {
  if (!url || typeof url !== 'string') return ''
  const trim = url.trim()
  if (!trim) return ''
  if (/^(https?:|data:|blob:|\/)/i.test(trim)) {
    return trim
  }
  return `/uploads/${trim}`
}

export function formatGaleriFrontend(row) {
  if (!row) return {}

  const coverMentah =
    row.cover ||
    row.image_url ||
    row.gambar ||
    ''

  const cover = rapikanUrlGambar(coverMentah)

  const fotos = Array.isArray(row.fotos)
    ? row.fotos.map((foto, index) => {
        const fotoUrl = rapikanUrlGambar(foto.url || foto.image_url || '')
        return {
          ...foto,
          id: foto.id,
          url: fotoUrl,
          image_url: fotoUrl,
          urutan: foto.urutan ?? index,
        }
      })
    : []

  const jumlahFoto = Number(
    row.jumlahFoto ??
      row.jumlah_foto ??
      fotos.length ??
      0
  )

  const judul = row.judul || row.judul_foto || ''

  const penyelenggara =
    row.penyelenggara ||
    row.pengunggah ||
    ''

  const tanggal =
    row.tanggal ||
    (row.created_at
      ? String(row.created_at).slice(0, 10)
      : '')

  return {
    ...row,
    id: row.id,
    judul,
    judul_foto: judul,
    kategori: row.kategori || 'Adiwiyata',
    deskripsi: row.deskripsi || '',
    cover,
    gambar: cover,
    image_url: cover,
    fotos,

    jumlahFoto: Array.isArray(row.fotos)
      ? fotos.length
      : jumlahFoto,

    jumlah_foto: Array.isArray(row.fotos)
      ? fotos.length
      : jumlahFoto,

    penyelenggara,
    pengunggah: penyelenggara,
    status: (row.status || 'tayang').toLowerCase(),
    tanggal,
  }
}

// =====================================================
// LOCAL STORAGE
// =====================================================

export function getLocalGaleri() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (raw) {
      const parsed = JSON.parse(raw)

      if (Array.isArray(parsed)) {
        return parsed.map(formatGaleriFrontend)
      }
    }
  } catch (error) {
    console.error('Gagal membaca data galeri lokal:', error)
  }

  return mockAlbum.map(formatGaleriFrontend)
}

export function setLocalGaleri(list) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(list)
    )
  } catch (error) {
    console.error('Gagal menyimpan data galeri lokal:', error)
  }
}

// =====================================================
// UPLOAD GAMBAR
// =====================================================

function dataUrlKeFile(
  dataUrl,
  namaFile = 'cover-galeri.jpg'
) {
  const bagian = dataUrl.split(',')
  const mime =
    bagian[0].match(/:(.*?);/)?.[1] || 'image/jpeg'

  const binary = atob(bagian[1])
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return new File([bytes], namaFile, { type: mime })
}

async function uploadSatuGambar(file) {
  if (!(file instanceof File)) {
    throw new Error('File gambar tidak valid.')
  }

  const url = await unggahGambar(file)

  if (!url || typeof url !== 'string') {
    throw new Error('Upload gagal. URL gambar tidak ditemukan.')
  }

  return url
}

// =====================================================
// GET SEMUA ALBUM
// =====================================================

export async function daftarGaleri(params = {}) {
  const queryParts = []

  if (
    params.kategori &&
    params.kategori !== 'Semua' &&
    params.kategori !== 'Semua Album'
  ) {
    queryParts.push(
      `kategori=${encodeURIComponent(params.kategori)}`
    )
  }

  if (params.status) {
    queryParts.push(
      `status=${encodeURIComponent(params.status)}`
    )
  }

  if (params.kata || params.q) {
    queryParts.push(
      `kata=${encodeURIComponent(params.kata || params.q)}`
    )
  }

  const qs = queryParts.length
    ? `?${queryParts.join('&')}`
    : ''

  const data = await requestGaleri(
    `${API_BASE_URL}/api/galeri${qs}`,
    {
      method: 'GET',
      headers: getHeaders(false),
    }
  )

  const list = ambilArray(data)
  const formatted = list.map(formatGaleriFrontend)

  setLocalGaleri(formatted)

  return formatted
}

// =====================================================
// GET DETAIL ALBUM
// =====================================================

export async function ambilGaleri(id) {
  if (!id) {
    throw new Error('ID album tidak ditemukan.')
  }

  const data = await requestGaleri(
    `${API_BASE_URL}/api/galeri/${encodeURIComponent(id)}`,
    {
      method: 'GET',
      headers: getHeaders(false),
    }
  )

  const row = ambilRow(data)

  if (!row?.id) {
    throw new Error('Data album tidak ditemukan.')
  }

  return formatGaleriFrontend(row)
}

// =====================================================
// POST / PUT ALBUM
// =====================================================

export async function simpanGaleri(input) {
  if (!input?.judul?.trim()) {
    throw new Error('Judul album wajib diisi.')
  }

  const isUpdate = Boolean(
    input.id &&
      !String(input.id).startsWith('local-') &&
      String(input.id).length > 10
  )

  const url = isUpdate
    ? `${API_BASE_URL}/api/galeri/${encodeURIComponent(input.id)}`
    : `${API_BASE_URL}/api/galeri`

  const method = isUpdate ? 'PUT' : 'POST'

  let coverUrl =
    input.cover ||
    input.gambar ||
    input.image_url ||
    ''

  // Upload sampul jika berupa Base64.
  if (
    typeof coverUrl === 'string' &&
    coverUrl.startsWith('data:image/')
  ) {
    const fileCover =
      input.fileCover instanceof File
        ? input.fileCover
        : dataUrlKeFile(coverUrl)

    coverUrl = await uploadSatuGambar(fileCover)
  }

  const payload = {
    judul: input.judul.trim(),
    kategori: input.kategori || 'Adiwiyata',
    deskripsi: input.deskripsi || '',
    image_url: coverUrl,
    jumlah_foto: Number(
      input.jumlahFoto ??
        input.jumlah_foto ??
        (coverUrl ? 1 : 0)
    ),
    pengunggah:
      input.penyelenggara ||
      input.pengunggah ||
      'Admin Sekolah',
    status: (input.status || 'tayang').toLowerCase(),
    tanggal:
      input.tanggal ||
      new Date().toISOString().slice(0, 10),
  }

  const data = await requestGaleri(url, {
    method,
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  })

  const savedRow = ambilRow(data)

  if (!savedRow?.id) {
    throw new Error(
      'Backend tidak mengembalikan ID album.'
    )
  }

  const formatted = formatGaleriFrontend({
    ...input,
    ...savedRow,
    id: savedRow.id,
    cover: savedRow.image_url || coverUrl,
    image_url: savedRow.image_url || coverUrl,
  })

  const current = getLocalGaleri()

  const updated = isUpdate
    ? current.map((item) =>
        String(item.id) === String(formatted.id)
          ? formatted
          : item
      )
    : [formatted, ...current]

  setLocalGaleri(updated)

  return formatted
}

// =====================================================
// DELETE ALBUM
// =====================================================

export async function hapusGaleri(id) {
  if (!id) {
    throw new Error('ID album tidak ditemukan.')
  }

  await requestGaleri(
    `${API_BASE_URL}/api/galeri/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: getHeaders(false),
    }
  )

  const current = getLocalGaleri()

  const updated = current.filter(
    (item) => String(item.id) !== String(id)
  )

  setLocalGaleri(updated)

  return { success: true }
}

// =====================================================
// TAMBAH BANYAK FOTO KE ALBUM
// =====================================================

export async function tambahFotoGaleri(id, files) {
  if (!id) {
    throw new Error('ID album tidak ditemukan.')
  }

  const daftarFile = Array.from(files || [])

  if (daftarFile.length === 0) {
    throw new Error('Pilih minimal satu foto.')
  }

  // 1. Upload seluruh file gambar.
  const urls = await Promise.all(
    daftarFile.map((file) => uploadSatuGambar(file))
  )

  // 2. Simpan URL ke backend.
  await requestGaleri(
    `${API_BASE_URL}/api/galeri/${encodeURIComponent(id)}/foto`,
    {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        fotos: urls.map((url) => ({ url })),
      }),
    }
  )

  // 3. Ambil detail album terbaru.
  const detail = await ambilGaleri(id)

  // 4. Perbarui local storage.
  const current = getLocalGaleri()

  const updated = current.map((item) =>
    String(item.id) === String(id)
      ? detail
      : item
  )

  setLocalGaleri(updated)

  return detail
}

// =====================================================
// HAPUS SATU FOTO DARI ALBUM
// =====================================================

export async function hapusFotoGaleri(id, fotoId) {
  if (!id || !fotoId) {
    throw new Error('ID album atau ID foto tidak ditemukan.')
  }

  // 1. Hapus satu foto berdasarkan ID album dan ID foto.
  await requestGaleri(
    `${API_BASE_URL}/api/galeri/${encodeURIComponent(id)}/foto/${encodeURIComponent(fotoId)}`,
    {
      method: 'DELETE',
      headers: getHeaders(false),
    }
  )

  // 2. Ambil detail album terbaru dari backend.
  const detail = await ambilGaleri(id)

  // 3. Perbarui data album di local storage.
  const current = getLocalGaleri()

  const updated = current.map((item) =>
    String(item.id) === String(id)
      ? detail
      : item
  )

  setLocalGaleri(updated)

  // 4. Kembalikan data terbaru untuk React Query.
  return detail
}
