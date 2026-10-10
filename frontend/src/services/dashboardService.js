import { dashboardMock } from '@/mocks/dashboard'

// Sekarang masih mengembalikan mock. Nanti tinggal ganti dengan:
//   const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard`, { credentials: 'include' })
//   if (!res.ok) throw new Error('Gagal memuat dashboard')
//   return res.json()
export async function getDashboard() {
  await new Promise((r) => setTimeout(r, 300)) // simulasi loading jaringan
  return dashboardMock
}
