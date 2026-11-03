/** @format */

import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";

import HomePage from "@/pages/public/HomePage";
import PlaceholderPage from "@/pages/public/PlaceholderPage";
import GaleriPage from "@/pages/public/GaleriPage";
import BeritaPublicPage from "@/pages/public/BeritaPage";
import AgendaPage from "@/pages/public/AgendaPage";
import AgendaDetailPage from "@/pages/public/AgendaDetailPage";
import PPDBPage from "@/pages/public/PPDBPage";
import KontakPage from "@/pages/public/KontakPage";
import ProfilPage from "@/pages/public/ProfilPage";
import VisiMisiPage from "@/components/layout/VisiMisiPage";
import GuruPage from "@/components/layout/GuruPage";

import AdminPlaceholderPage from "@/pages/admin/AdminPlaceholderPage";
import LoginPage from "@/pages/admin/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import BeritaFormPage from "@/pages/admin/BeritaFormPage";
import BeritaAdminPage from "@/pages/admin/BeritaAdminPage";
import KelolaAgendaPage from "@/pages/admin/KelolaAgendaPage";
import KelolaGaleriPage from "@/pages/admin/KelolaGaleriPage";
import KelolaDokumenPage from "@/pages/admin/KelolaDokumenPage";
import KelolaProfilStafPage from "@/pages/admin/KelolaProfilStafPage";
import KelolaPesanPage from "@/pages/admin/KelolaPesanPage";
import KelolaPengaturanPage from "@/pages/admin/KelolaPengaturanPage";

function ProtectedAdminRoute({ children }) {
  const sudahLogin = Boolean(
    localStorage.getItem("cms_token") || localStorage.getItem("cms_user"),
  );

  if (!sudahLogin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Halaman publik */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="profil" element={<ProfilPage />} />
        <Route path="profil/visi-misi" element={<VisiMisiPage />} />
        <Route path="profil/guru" element={<GuruPage />} />

        <Route path="berita" element={<BeritaPublicPage />} />
        <Route
          path="berita/:slug"
          element={<PlaceholderPage judul="Detail Berita" />}
        />

        {/* Agenda publik */}
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="agenda/:id" element={<AgendaDetailPage />} />

        {/* Galeri publik */}
        <Route path="galeri" element={<GaleriPage />} />
        <Route path="agenda-galeri" element={<GaleriPage />} />

        {/* Informasi PPDB */}
        <Route path="ppdb" element={<PPDBPage />} />

        <Route path="kontak" element={<KontakPage />} />

        <Route
          path="*"
          element={<PlaceholderPage judul="Halaman tidak ditemukan" />}
        />
      </Route>

      {/* Login admin */}
      <Route path="admin/login" element={<LoginPage />} />

      {/* Halaman admin yang memerlukan login */}
      <Route
        path="admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<DashboardPage />} />

        <Route path="berita" element={<BeritaAdminPage />} />
        <Route path="berita/baru" element={<BeritaFormPage />} />
        <Route path="berita/:id/edit" element={<BeritaFormPage />} />

        {/* Agenda admin tetap menggunakan KelolaAgendaPage */}
        <Route path="agenda" element={<KelolaAgendaPage />} />

        <Route path="galeri" element={<KelolaGaleriPage />} />
        <Route path="dokumen" element={<KelolaDokumenPage />} />
        <Route path="profil-staf" element={<KelolaProfilStafPage />} />
        <Route path="pesan" element={<KelolaPesanPage />} />
        <Route path="pengaturan" element={<KelolaPengaturanPage />} />

        <Route
          path="*"
          element={<AdminPlaceholderPage judul="Halaman tidak ditemukan" />}
        />
      </Route>
    </Routes>
  );
}
