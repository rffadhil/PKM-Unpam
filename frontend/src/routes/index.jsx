
/** @format */

import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// ==============================
// HALAMAN PUBLIC
// ==============================

import HomePage from "@/pages/public/HomePage";
import PlaceholderPage from "@/pages/public/PlaceholderPage";
import GaleriPage from "@/pages/public/GaleriPage";
import BeritaPublicPage from "@/pages/public/BeritaPage";
import BeritaDetailPage from "@/pages/public/BeritaDetailPage";
import AgendaPage from "@/pages/public/AgendaPage";
import AgendaDetailPage from "@/pages/public/AgendaDetailPage";
import PPDBPage from "@/pages/public/PPDBPage";
import KontakPage from "@/pages/public/KontakPage";
import ProfilPage from "@/pages/public/ProfilPage";
import PencarianPage from "@/pages/public/PencarianPage";

import VisiMisiPage from "@/components/layout/VisiMisiPage";
import GuruPage from "@/components/layout/GuruPage";
import { getStoredAuth } from "@/services/authService";

// ==============================
// HALAMAN ADMIN
// ==============================

import AdminPlaceholderPage from "@/pages/admin/AdminPlaceholderPage";
import LoginPage from "@/pages/admin/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import BeritaFormPage from "@/pages/admin/BeritaFormPage";
import BeritaAdminPage from "@/pages/admin/BeritaAdminPage";
import KelolaAgendaPage from "@/pages/admin/KelolaAgendaPage";
import KelolaGaleriPage from "@/pages/admin/KelolaGaleriPage";
import KelolaDokumenPage from "@/pages/admin/KelolaDokumenPage";
import KelolaProfilStafPage from "@/pages/admin/KelolaProfilStafPage";
import KelolaEkstrakurikulerPage from "@/pages/admin/KelolaEkstrakurikulerPage";
import KelolaPesanPage from "@/pages/admin/KelolaPesanPage";
import KelolaPengaturanPage from "@/pages/admin/KelolaPengaturanPage";

// ==============================
// PROTEKSI HALAMAN ADMIN
// ==============================

function ProtectedAdminRoute({ children }) {
  const { token, user } = getStoredAuth();
  const sudahLogin = Boolean(token || user);

  if (!sudahLogin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// ==============================
// ROUTING UTAMA
// ==============================

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================================= */}
      {/* HALAMAN PUBLIK */}
      {/* ================================= */}

      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />

        {/* PENCARIAN */}
        <Route
          path="pencarian"
          element={<PencarianPage />}
        />

        {/* PROFIL */}
        <Route
          path="profil"
          element={<ProfilPage />}
        />

        <Route
          path="profil/visi-misi"
          element={<VisiMisiPage />}
        />

        <Route
          path="profil/guru"
          element={<GuruPage />}
        />

        {/* BERITA */}
        <Route
          path="berita"
          element={<BeritaPublicPage />}
        />

        <Route
          path="berita/:slug"
          element={<BeritaDetailPage />}
        />

        {/* AGENDA */}
        <Route
          path="agenda"
          element={<AgendaPage />}
        />

        <Route
          path="agenda/:id"
          element={<AgendaDetailPage />}
        />

        {/* GALERI */}
        <Route
          path="galeri"
          element={<GaleriPage />}
        />

        <Route
          path="agenda-galeri"
          element={<GaleriPage />}
        />

        {/* PPDB */}
        <Route
          path="ppdb"
          element={<PPDBPage />}
        />

        {/* KONTAK */}
        <Route
          path="kontak"
          element={<KontakPage />}
        />

        {/* HALAMAN PUBLIK TIDAK DITEMUKAN */}
        <Route
          path="*"
          element={
            <PlaceholderPage judul="Halaman tidak ditemukan" />
          }
        />
      </Route>

      {/* ================================= */}
      {/* LOGIN ADMIN */}
      {/* ================================= */}

      <Route
        path="admin/login"
        element={<LoginPage />}
      />

      {/* ================================= */}
      {/* HALAMAN ADMIN */}
      {/* ================================= */}

      <Route
        path="admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        {/* OVERVIEW */}
        <Route
          index
          element={<DashboardPage />}
        />

        {/* BERITA */}
        <Route
          path="berita"
          element={<BeritaAdminPage />}
        />

        <Route
          path="berita/baru"
          element={<BeritaFormPage />}
        />

        <Route
          path="berita/:id/edit"
          element={<BeritaFormPage />}
        />

        {/* AGENDA */}
        <Route
          path="agenda"
          element={<KelolaAgendaPage />}
        />

        {/* GALERI */}
        <Route
          path="galeri"
          element={<KelolaGaleriPage />}
        />

        {/* DOKUMEN */}
        <Route
          path="dokumen"
          element={<KelolaDokumenPage />}
        />

        {/* PROFIL DAN STAF */}
        <Route
          path="profil-staf"
          element={
            <Navigate
              to="/admin/profil-staf/profil"
              replace
            />
          }
        />

        <Route
          path="profil-staf/:sub"
          element={<KelolaProfilStafPage />}
        />

        {/* PESAN MASUK */}
        <Route
          path="pesan"
          element={<KelolaPesanPage />}
        />

        {/* PENGATURAN */}
        <Route
          path="pengaturan"
          element={<KelolaPengaturanPage />}
        />

        {/* LOG AKTIVITAS */}
        <Route
          path="log"
          element={
            <AdminPlaceholderPage judul="Log Aktivitas" />
          }
        />

        {/* HALAMAN ADMIN TIDAK DITEMUKAN */}
        <Route
          path="*"
          element={
            <AdminPlaceholderPage judul="Halaman tidak ditemukan" />
          }
        />
      </Route>
    </Routes>
  );
}
