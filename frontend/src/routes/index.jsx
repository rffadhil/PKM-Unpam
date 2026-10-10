import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import HomePage from '@/pages/public/HomePage'
import PlaceholderPage from '@/pages/public/PlaceholderPage'
import AdminPlaceholderPage from '@/pages/admin/AdminPlaceholderPage'
import BeritaAdminPage from '@/pages/admin/BeritaAdminPage'

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

      {/* TODO: halaman login admin */}
      <Route path="admin/login" element={<AdminPlaceholderPage judul="Login Admin" />} />

      {/* CMS — TODO: bungkus dengan ProtectedRoute (cek login) */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminPlaceholderPage judul="Overview Dashboard" />} />
        <Route path="berita" element={<BeritaAdminPage />} />
        <Route path="berita/baru" element={<AdminPlaceholderPage judul="Tambah Berita Baru" />} />
        <Route path="berita/:id/edit" element={<AdminPlaceholderPage judul="Edit Berita" />} />
        <Route path="agenda" element={<AdminPlaceholderPage judul="Manajemen Agenda" />} />
        <Route path="galeri" element={<AdminPlaceholderPage judul="Manajemen Galeri" />} />
        <Route path="dokumen" element={<AdminPlaceholderPage judul="Manajemen Dokumen" />} />
        <Route path="profil-staf" element={<AdminPlaceholderPage judul="Profil Sekolah & Staf" />} />
        <Route path="pesan" element={<AdminPlaceholderPage judul="Pesan Masuk & Kontak" />} />
        <Route path="pengaturan" element={<AdminPlaceholderPage judul="Pengaturan Sistem & Akun" />} />
        <Route path="*" element={<AdminPlaceholderPage judul="Halaman tidak ditemukan" />} />
      </Route>
    </Routes>
  )
}
