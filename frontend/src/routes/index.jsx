import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import HomePage from '@/pages/public/HomePage'
import PlaceholderPage from '@/pages/public/PlaceholderPage'
import AdminPlaceholderPage from '@/pages/admin/AdminPlaceholderPage'
import LoginPage from '@/pages/admin/LoginPage'
import DashboardPage from '@/pages/admin/DashboardPage'
import BeritaAdminPage from '@/pages/admin/BeritaAdminPage'
import KelolaAgendaPage from '@/pages/admin/KelolaAgendaPage'
import KelolaGaleriPage from '@/pages/admin/KelolaGaleriPage'
import KelolaProfilStafPage from '@/pages/admin/KelolaProfilStafPage'
import KelolaPesanPage from '@/pages/admin/KelolaPesanPage'

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

      <Route path="admin/login" element={<LoginPage />} />

      {/* CMS — TODO: bungkus dengan ProtectedRoute (cek login) */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="berita" element={<BeritaAdminPage />} />
        <Route path="berita/baru" element={<AdminPlaceholderPage judul="Tambah Berita Baru" />} />
        <Route path="berita/:id/edit" element={<AdminPlaceholderPage judul="Edit Berita" />} />
        <Route path="agenda" element={<KelolaAgendaPage />} />
        <Route path="galeri" element={<KelolaGaleriPage />} />
        <Route path="dokumen" element={<AdminPlaceholderPage judul="Manajemen Dokumen" />} />
        <Route path="profil-staf" element={<KelolaProfilStafPage />} />
        <Route path="pesan" element={<KelolaPesanPage />} />
        <Route path="pengaturan" element={<AdminPlaceholderPage judul="Pengaturan Sistem & Akun" />} />
        <Route path="*" element={<AdminPlaceholderPage judul="Halaman tidak ditemukan" />} />
      </Route>
    </Routes>
  )
}
