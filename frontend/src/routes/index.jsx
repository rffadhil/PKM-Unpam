import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import HomePage from '@/pages/public/HomePage'
import PlaceholderPage from '@/pages/public/PlaceholderPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="profil" element={<PlaceholderPage judul="Profil Sekolah" />} />
        <Route path="berita" element={<PlaceholderPage judul="Berita & Pengumuman" />} />
        <Route path="berita/:slug" element={<PlaceholderPage judul="Detail Berita" />} />
        <Route path="agenda-galeri" element={<PlaceholderPage judul="Agenda & Galeri" />} />
        <Route path="ppdb" element={<PlaceholderPage judul="Informasi PPDB" />} />
        <Route path="kontak" element={<PlaceholderPage judul="Kontak & Layanan" />} />
        <Route path="*" element={<PlaceholderPage judul="Halaman tidak ditemukan" />} />
      </Route>

      {/* TODO admin: /admin/login dan /admin/* (AdminLayout + ProtectedRoute) */}
    </Routes>
  )
}
