import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import AdminLayout from '@/components/layout/AdminLayout'

import HomePage from '@/pages/public/HomePage'
import PlaceholderPage from '@/pages/public/PlaceholderPage'
import GaleriPage from '@/pages/public/GaleriPage'
import BeritaPublicPage from '@/pages/public/BeritaPage'

import AdminPlaceholderPage from '@/pages/admin/AdminPlaceholderPage'
import LoginPage from '@/pages/admin/LoginPage'
import DashboardPage from '@/pages/admin/DashboardPage'
import BeritaFormPage from '@/pages/admin/BeritaFormPage'
import BeritaAdminPage from '@/pages/admin/BeritaAdminPage'
import KelolaAgendaPage from '@/pages/admin/KelolaAgendaPage'
import KelolaGaleriPage from '@/pages/admin/KelolaGaleriPage'
import KelolaDokumenPage from '@/pages/admin/KelolaDokumenPage'
import KelolaProfilStafPage from '@/pages/admin/KelolaProfilStafPage'
import KelolaPesanPage from '@/pages/admin/KelolaPesanPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />

        <Route
          path="profil"
          element={<PlaceholderPage judul="Profil Sekolah" />}
        />

        <Route path="berita" element={<BeritaPublicPage />} />

        <Route
          path="berita/:slug"
          element={<PlaceholderPage judul="Detail Berita" />}
        />

        <Route
          path="agenda"
          element={<PlaceholderPage judul="Agenda Sekolah" />}
        />

        <Route path="galeri" element={<GaleriPage />} />
        <Route path="agenda-galeri" element={<GaleriPage />} />

        <Route
          path="ppdb"
          element={<PlaceholderPage judul="Informasi PPDB" />}
        />

        <Route
          path="kontak"
          element={<PlaceholderPage judul="Kontak & Layanan" />}
        />

        <Route
          path="*"
          element={<PlaceholderPage judul="Halaman tidak ditemukan" />}
        />
      </Route>

      {/* Login admin */}
      <Route path="admin/login" element={<LoginPage />} />

      {/* Halaman pengelolaan admin */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />

        <Route path="berita" element={<BeritaAdminPage />} />
        <Route path="berita/baru" element={<BeritaFormPage />} />
        <Route path="berita/:id/edit" element={<BeritaFormPage />} />

        <Route path="agenda" element={<KelolaAgendaPage />} />
        <Route path="galeri" element={<KelolaGaleriPage />} />
        <Route path="dokumen" element={<KelolaDokumenPage />} />
        <Route path="profil-staf" element={<KelolaProfilStafPage />} />
        <Route path="pesan" element={<KelolaPesanPage />} />

        <Route
          path="pengaturan"
          element={<AdminPlaceholderPage judul="Pengaturan Sistem & Akun" />}
        />

        <Route
          path="*"
          element={<AdminPlaceholderPage judul="Halaman tidak ditemukan" />}
        />
      </Route>
    </Routes>
  )
}